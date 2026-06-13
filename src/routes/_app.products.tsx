import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useEntries, useProducts, useProfile } from "@/lib/queries";
import { useActiveMode } from "@/lib/use-active-mode";
import { useSubscription } from "@/lib/use-subscription";
import {
  canAddProduct,
  canAccessDropshipping,
  canUseMultiZonesCod,
  productLimitFor,
  productLimitLabel,
} from "@/lib/plan-limits";
import {
  computeKPIs,
  dateRangeForPreset,
  formatCurrency,
  normalizeDropshippingCurrency,
  type DropshippingCurrency,
} from "@/lib/calc";
import { regionsFor } from "@/lib/regions";
import { ShopifyConnectCard } from "@/components/ShopifyConnectCard";

export const Route = createFileRoute("/_app/products")({
  head: () => ({ meta: [{ title: "Produits — NETODASH" }] }),
  component: ProductsPage,
});

const productSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100),
  sale_price: z.coerce.number().min(0).max(1e9),
  cost_price: z.coerce.number().min(0).max(1e9),
  shipping_cost: z.coerce.number().min(0).max(1e9),
});

// Refine appliqué UNIQUEMENT à la création — on ne bloque pas l'édition
// de produits existants pouvant avoir une marge négative en base.
const productCreateSchema = productSchema
  .refine((d) => d.sale_price > 0, {
    message: "Le prix de vente doit être > 0.",
    path: ["sale_price"],
  })
  .refine((d) => d.cost_price + d.shipping_cost <= d.sale_price, {
    message: "Coût + livraison > prix de vente : marge négative.",
    path: ["cost_price"],
  });

const DROPSHIP_COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "US", name: "États-Unis", flag: "🇺🇸" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
  { code: "IT", name: "Italie", flag: "🇮🇹" },
];

const COD_COUNTRIES = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
];

function ProductsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { mode: activeMode } = useActiveMode();
  const productsQ = useProducts(user?.id);
  const profileQ = useProfile(user?.id);
  const sub = useSubscription(user?.id);
  const isCod = activeMode === "cod";
  const productCount = productsQ.data?.length ?? 0;
  const legacyDual = Boolean((profileQ.data as { legacy_dual_mode?: boolean } | undefined)?.legacy_dual_mode);
  const limit = productLimitFor(sub.plan, activeMode);
  const limitReached = !canAddProduct(sub.plan, productCount, activeMode);
  const multiZonesAllowed = canUseMultiZonesCod(sub.plan);
  const dropBlocked = !isCod && !canAccessDropshipping(sub.plan, legacyDual);
  const range = useMemo(() => dateRangeForPreset("30d"), []);
  const entriesQ = useEntries(user?.id, range);

  const COUNTRIES = isCod ? COD_COUNTRIES : DROPSHIP_COUNTRIES;
  const defaultCountry = isCod ? "SN" : "FR";

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    sale_price: "",
    cost_price: "",
    shipping_cost: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  // Pays cible : multi-sélection (surtout utile en COD pour couvrir plusieurs pays).
  const [countries, setCountries] = useState<Set<string>>(new Set([defaultCountry]));
  const [currency, setCurrency] = useState<DropshippingCurrency>("EUR");
  // Zones de livraison COD : chaque zone est un groupe de régions avec un coût.
  type ZoneDraft = { name: string; cost: string; regions: string[] };
  const defaultZones = (): ZoneDraft[] => [
    { name: "Zone 1", cost: "", regions: [] },
  ];
  const [zones, setZones] = useState<ZoneDraft[]>(defaultZones());

  // Régions disponibles selon les pays sélectionnés (mode COD).
  const availableRegions = useMemo(
    () => (isCod ? regionsFor(Array.from(countries)) : []),
    [isCod, countries],
  );
  // Régions déjà prises par d'autres zones (pour éviter les doublons).
  const regionsTakenBy = (idx: number): Set<string> => {
    const s = new Set<string>();
    zones.forEach((z, j) => {
      if (j === idx) return;
      for (const r of z.regions) s.add(r);
    });
    return s;
  };

  // Devise affichée dans le formulaire selon le mode
  const formCurrency = isCod ? "XOF" : currency;
  const currencySymbol = isCod ? "FCFA" : formCurrency;

  const allIds = productsQ.data?.map((p) => p.id) ?? [];
  const allSelected = allIds.length > 0 && selected.size === allIds.length;

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  }

  async function handleBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Supprimer ${ids.length} produit${ids.length > 1 ? "s" : ""} et toutes leurs données ?`)) return;
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`${ids.length} produit${ids.length > 1 ? "s supprimés" : " supprimé"}.`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  function resetForm() {
    setForm({
      name: "",
      sale_price: "",
      cost_price: "",
      shipping_cost: "",
    });
    setImageUrl("");
    setCountries(new Set([defaultCountry]));
    setCurrency("EUR");
    setZones(defaultZones());
    setEditing(null);
    setShowForm(false);
  }

  async function compressImage(file: File, maxDim = 1200, quality = 0.82): Promise<Blob> {
    const bitmap = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Lecture image impossible"));
      img.src = URL.createObjectURL(file);
    });
    const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponible");
    ctx.drawImage(bitmap, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Compression échouée"))),
        "image/jpeg",
        quality,
      );
    });
  }

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Lecture base64 impossible"));
      r.readAsDataURL(blob);
    });
  }

  async function handleImageUpload(file: File) {
    if (!user?.id) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Sélectionne un fichier image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image trop lourde (max 10 Mo).");
      return;
    }
    setUploadingImage(true);
    try {
      // Toujours compresser → JPEG ≤1200px pour fiabilité (évite webp lourd, etc.)
      let blob: Blob;
      try {
        blob = await compressImage(file);
      } catch {
        blob = file; // fallback : envoyer l'original
      }
      const path = `${user.id}/${Date.now()}.jpg`;

      // Tentative storage avec 2 essais (réseau capricieux / extensions)
      let lastErr: any = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { error: upErr } = await supabase.storage
            .from("product-images")
            .upload(path, blob, { upsert: false, contentType: "image/jpeg" });
          if (upErr) throw upErr;
          const { data, error: sErr } = await supabase.storage
            .from("product-images")
            .createSignedUrl(path, 60 * 60 * 24 * 365);
          if (sErr || !data?.signedUrl) throw sErr ?? new Error("URL signée indisponible");
          setImageUrl(data.signedUrl);
          toast.success("Image importée.");
          return;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      // Fallback : si l'upload échoue (extension qui bloque, réseau), stocker en data URL
      // tant que ça reste raisonnable (<700 Ko base64).
      const dataUrl = await blobToDataUrl(blob);
      if (dataUrl.length < 700 * 1024) {
        setImageUrl(dataUrl);
        toast.success("Image importée (mode local).");
        return;
      }
      throw lastErr ?? new Error("Upload impossible");
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? "");
      if (/failed to fetch/i.test(msg)) {
        toast.error("Upload bloqué (extension/réseau). Désactive AdBlock puis réessaie.");
      } else {
        toast.error(msg || "Échec de l'upload");
      }
    } finally {
      setUploadingImage(false);
    }
  }

  function toggleCountry(code: string) {
    setCountries((prev) => {
      const next = new Set(prev);
      if (isCod) {
        if (next.has(code)) {
          if (next.size > 1) next.delete(code);
        } else {
          next.add(code);
        }
      } else {
        next.clear();
        next.add(code);
      }
      return next;
    });
  }

  function startEdit(p: any) {
    setForm({
      name: p.name,
      sale_price: String(p.sale_price),
      cost_price: String(p.cost_price),
      shipping_cost: String(p.shipping_cost ?? 0),
    });
    setImageUrl(String((p as any).image_url ?? ""));
    const cs = Array.isArray(p.countries) ? p.countries : [];
    setCountries(new Set(cs.length > 0 ? cs : [defaultCountry]));
    setCurrency(normalizeDropshippingCurrency(p.currency));
    const sz = Array.isArray(p.shipping_zones) ? p.shipping_zones : [];
    setZones(
      sz.length > 0
        ? sz.map((z: any) => ({
            name: String(z.name ?? ""),
            cost: String(z.cost ?? ""),
            regions: Array.isArray(z.regions) ? z.regions.map(String) : [],
          }))
        : defaultZones(),
    );
    setEditing(p.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // En COD, le shipping_cost global est remplacé par les zones — on prend la moyenne comme fallback
    const cleanZones = zones
      .map((z) => ({
        name: z.name.trim(),
        cost: Number(z.cost) || 0,
        regions: (z.regions || []).map((r) => r.trim()).filter(Boolean),
      }))
      .filter((z) => z.name.length > 0);
    const formForParse = isCod
      ? {
          ...form,
          shipping_cost:
            cleanZones.length > 0
              ? String(cleanZones.reduce((s, z) => s + z.cost, 0) / cleanZones.length)
              : "0",
        }
      : form;
    const schema = editing ? productSchema : productCreateSchema;
    const parsed = schema.safeParse(formForParse);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (isCod && cleanZones.length === 0) {
      toast.error("Ajoute au moins une zone de livraison.");
      return;
    }
    if (countries.size === 0) {
      toast.error("Sélectionne au moins un pays cible.");
      return;
    }

    const payload: any = {
      name: parsed.data.name,
      sale_price: parsed.data.sale_price,
      cost_price: parsed.data.cost_price,
      shipping_cost: parsed.data.shipping_cost,
      shipping_zones: isCod ? cleanZones : [],
      countries: Array.from(countries),
      currency: formCurrency,
      business_mode: activeMode,
      image_url: imageUrl || null,
      user_id: user!.id,
    };

    if (editing) {
      const { error } = await (supabase.from("products").update(payload) as any).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      if (limitReached) {
        toast.error("Limite de produits atteinte pour ton plan.");
        return;
      }
      const { error } = await (supabase.from("products") as any).insert(payload);
      if (error) {
        // Trigger DB enforce_product_limit() renvoie HINT = 'plan_product_limit_reached'
        const msg = `${error.message || ""} ${(error as any).hint || ""}`;
        if (msg.includes("plan_product_limit_reached") || msg.toLowerCase().includes("limite de produits")) {
          toast.error("Tu as atteint la limite de produits de ton plan.", {
            description: "Passe au plan supérieur pour en ajouter davantage.",
            action: { label: "Voir les plans", onClick: () => navigate({ to: "/plan" }) },
          });
          return;
        }
        return toast.error(error.message);
      }
    }

    toast.success(editing ? "Produit mis à jour." : "Produit créé.");
    qc.invalidateQueries({ queryKey: ["products"] });
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit et toutes ses données ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produit supprimé.");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Synchro Shopify désactivée temporairement (en attente publication App Store) */}
      {false && (
        <div className="mb-6">
          <ShopifyConnectCard />
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            {isCod ? "CATALOGUE COD · AFRIQUE" : "CATALOGUE DROPSHIPPING"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-1">PRODUITS</h1>
        </div>
        {!showForm && (
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => {
                if (limitReached) {
                  toast.error("Limite de produits atteinte pour ton plan.");
                  return;
                }
                setShowForm(true);
              }}
              disabled={limitReached}
              className={`brutal-border px-4 md:px-6 py-3 font-bold uppercase tracking-wider text-sm md:text-base ${
                limitReached
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  : "bg-foreground text-background hover:bg-accent hover:border-accent"
              }`}
            >
              + Nouveau produit
            </button>
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              {productCount}
              {limit === -1 ? " / illimité" : ` / ${limit}`} · Plan {sub.plan}
              {limitReached && (
                <Link to="/plan" className="ml-2 text-accent underline">
                  Upgrade →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {dropBlocked && (
        <div className="brutal-border-thin p-4 mb-6 bg-muted/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-mono">
            <span className="font-bold uppercase tracking-wider">Dropshipping indisponible</span> · Ton plan COD
            ($10) ne couvre que le mode COD. Passe à Starter Drop pour ajouter des produits Dropshipping.
          </div>
          <Link
            to="/plan"
            className="brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-widest"
          >
            Voir les plans Drop →
          </Link>
        </div>
      )}

      {limitReached && !showForm && productCount > 0 && (
        <div className="brutal-border-thin p-4 mb-6 bg-amber-50 text-amber-900 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm">
            <span className="font-bold uppercase tracking-wider">Limite atteinte</span> · Ton plan{" "}
            <strong>{sub.plan}</strong> autorise {productLimitLabel(sub.plan, activeMode)} produit
            {limit > 1 ? "s" : ""}.
          </div>
          <Link
            to="/plan"
            className="brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-widest"
          >
            Voir les plans →
          </Link>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="brutal-border p-6 md:p-8 mb-8 grid gap-4">
          <h2 className="text-2xl font-black">{editing ? "MODIFIER" : "NOUVEAU PRODUIT"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nom du produit" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field
              label={`Prix de vente (${currencySymbol})`}
              type="number"
              value={form.sale_price}
              onChange={(v) => setForm({ ...form, sale_price: v })}
            />
            <Field
              label={`Coût d'achat (${currencySymbol})`}
              type="number"
              value={form.cost_price}
              onChange={(v) => setForm({ ...form, cost_price: v })}
            />
            {!isCod && (
              <Field
                label={`Coût d'expédition / commande (${currencySymbol})`}
                type="number"
                value={form.shipping_cost}
                onChange={(v) => setForm({ ...form, shipping_cost: v })}
              />
            )}
          </div>

          {true && (
            <div className="brutal-border-thin p-4">
              <div className="text-xs uppercase tracking-widest font-bold mb-2">
                Image du produit <span className="text-muted-foreground font-mono normal-case">— optionnelle</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Aperçu produit"
                    className="w-20 h-20 object-cover brutal-border-thin bg-muted"
                  />
                ) : (
                  <div className="w-20 h-20 brutal-border-thin bg-muted flex items-center justify-center text-3xl">
                    📦
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="brutal-border-thin px-3 py-2 text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:bg-foreground hover:text-background inline-block w-fit">
                    {uploadingImage ? "Upload…" : imageUrl ? "Remplacer l'image" : "Importer une image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-[10px] uppercase tracking-widest font-bold text-accent hover:underline w-fit"
                    >
                      Retirer
                    </button>
                  )}
                  <div className="text-[10px] font-mono text-muted-foreground">
                    JPG / PNG / WebP — max 5 Mo
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCod ? (
            <div className="brutal-border-thin p-4 bg-accent/10">
              <div className="text-xs uppercase tracking-widest font-bold mb-1">
                Devise du produit
              </div>
              <div className="font-mono text-sm">
                <span className="font-black">FCFA (XOF)</span>{" "}
                <span className="text-muted-foreground">— verrouillée en mode COD</span>
              </div>
            </div>
          ) : (
            <div className="brutal-border-thin p-4">
              <div className="text-xs uppercase tracking-widest font-bold mb-3">
                Devise du produit <span className="text-accent">*</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["USD", "EUR", "GBP"] as const).map((c) => {
                  const active = currency === c;
                  const label = c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "£ GBP";
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${
                        active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/5"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ÉTAPE 1 — Pays cible. En COD, c'est obligatoire avant de définir les zones */}
          <div className={`brutal-border-thin p-4 ${isCod && countries.size === 0 ? "border-accent border-2 bg-accent/5" : ""}`}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {isCod && (
                <span className="text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest">
                  Étape 1
                </span>
              )}
              <div className="text-xs uppercase tracking-widest font-bold">
                Pays cible <span className="text-accent">*</span>
                {isCod && <span className="text-muted-foreground font-mono normal-case ml-2">— multi-sélection</span>}
              </div>
            </div>
            {isCod && (
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Sélectionne d'abord tous les pays où tu livres ce produit — les régions disponibles s'afficheront ensuite dans les zones de livraison. Tu peux en cocher plusieurs.
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {COUNTRIES.map((c) => {
                const active = countries.has(c.code);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleCountry(c.code)}
                    className={`brutal-border-thin px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                      active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/10"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ÉTAPE 2 — Zones de livraison COD. Dépend des pays sélectionnés */}
          {isCod && (
            <div className={`brutal-border-thin p-4 ${availableRegions.length === 0 ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest">
                      Étape 2
                    </span>
                    <div className="text-xs uppercase tracking-widest font-bold">
                      Zones de livraison (FCFA)
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    Donne un nom à la zone, sélectionne les régions et fixe le coût
                  </div>
                </div>
                <button
                  type="button"
                  disabled={availableRegions.length === 0 || !multiZonesAllowed}
                  onClick={() => {
                    if (!multiZonesAllowed) return;
                    setZones([
                      ...zones,
                      { name: `Zone ${zones.length + 1}`, cost: "", regions: [] },
                    ]);
                  }}
                  className="brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
                >
                  + Zone
                </button>
              </div>
              {!multiZonesAllowed && (
                <div className="brutal-border-thin border-dashed p-3 mb-3 text-[11px] font-mono text-muted-foreground">
                  🔒 Multi-zones réservé au plan Pro Drop ($29) et au-dessus.{" "}
                  <Link to="/plan" className="underline font-bold text-foreground">
                    Upgrade →
                  </Link>
                </div>
              )}
              {availableRegions.length === 0 ? (
                <div className="brutal-border-thin border-dashed p-4 text-center">
                  <div className="text-2xl mb-1">👆</div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1">
                    Sélectionne un pays d'abord
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    Les régions disponibles dépendent du ou des pays cibles choisis à l'étape 1.
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {zones.map((z, i) => {
                    const taken = regionsTakenBy(i);
                    return (
                      <div key={i} className="brutal-border-thin p-3 grid gap-3">
                        <div className="flex gap-2 items-center">
                          <input
                            value={z.name}
                            onChange={(e) => {
                              const next = [...zones];
                              next[i] = { ...next[i], name: e.target.value };
                              setZones(next);
                            }}
                            placeholder={`Zone ${i + 1}`}
                            className="brutal-border-thin bg-background px-3 py-2 font-mono text-sm flex-1 focus:outline-none focus:border-accent focus:border-2"
                          />
                          <input
                            value={z.cost}
                            onChange={(e) => {
                              const next = [...zones];
                              next[i] = { ...next[i], cost: e.target.value };
                              setZones(next);
                            }}
                            type="number"
                            placeholder="Coût FCFA"
                            className="brutal-border-thin bg-background px-3 py-2 font-mono text-sm w-32 focus:outline-none focus:border-accent focus:border-2"
                          />
                          {zones.length > 1 && multiZonesAllowed && (
                            <button
                              type="button"
                              onClick={() => setZones(zones.filter((_, j) => j !== i))}
                              className="text-xs font-bold px-2 py-2 hover:bg-foreground/10"
                              title="Supprimer la zone"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
                            Régions ({z.regions.length} sél.)
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {availableRegions.map((r) => {
                              const selectedHere = z.regions.includes(r);
                              const takenElsewhere = taken.has(r) && !selectedHere;
                              return (
                                <button
                                  key={r}
                                  type="button"
                                  disabled={takenElsewhere}
                                  onClick={() => {
                                    const next = [...zones];
                                    const cur = new Set(next[i].regions);
                                    if (cur.has(r)) cur.delete(r);
                                    else cur.add(r);
                                    next[i] = { ...next[i], regions: Array.from(cur) };
                                    setZones(next);
                                  }}
                                  className={`brutal-border-thin px-2 py-1 text-[11px] font-mono ${
                                    selectedHere
                                      ? "bg-foreground text-background border-foreground"
                                      : takenElsewhere
                                        ? "opacity-30 cursor-not-allowed"
                                        : "hover:bg-foreground/10"
                                  }`}
                                  title={takenElsewhere ? "Déjà dans une autre zone" : ""}
                                >
                                  {r}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
            >
              {editing ? "ENREGISTRER" : "CRÉER"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="brutal-border px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {productsQ.isLoading && (
        <div className="grid gap-0 brutal-border">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center animate-pulse ${
                i > 0 ? "border-t border-foreground" : ""
              }`}
            >
              <div className="w-16 h-16 bg-foreground/10" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-foreground/10" />
                <div className="h-3 w-72 bg-foreground/10" />
              </div>
              <div className="h-10 w-32 bg-foreground/10" />
            </div>
          ))}
        </div>
      )}

      {productsQ.data && productsQ.data.length === 0 && !showForm && (
        <div className="brutal-border p-10 text-center text-muted-foreground">
          Aucun produit. Crée ton premier pour commencer.
        </div>
      )}

      {productsQ.data && productsQ.data.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-accent"
              />
              {selected.size > 0
                ? `${selected.size} sélectionné${selected.size > 1 ? "s" : ""}`
                : "Tout sélectionner"}
            </label>
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit…"
                className="brutal-border-thin bg-background pl-8 pr-3 py-2 text-xs font-mono w-56 focus:border-accent focus:border-2 outline-none"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                🔍
              </span>
            </div>
          </div>
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="brutal-border-thin border-accent text-accent px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground"
            >
              Supprimer la sélection ({selected.size})
            </button>
          )}
        </div>
      )}

      <div className="grid gap-0 brutal-border">
        {productsQ.data
          ?.filter((p) =>
            search.trim() === ""
              ? true
              : p.name.toLowerCase().includes(search.trim().toLowerCase()),
          )
          .map((p, i) => {
          const pCur = isCod ? "XOF" : normalizeDropshippingCurrency((p as any).currency);
          const margin =
            Number(p.sale_price) -
            Number(p.cost_price) -
            Number((p as any).shipping_cost ?? 0);
          const productEntries = (entriesQ.data ?? []).filter((e) => e.product_id === p.id);
          const pKpis = computeKPIs(productEntries, [p as any], pCur, 0, 0);
          const hasData = pKpis.adSpend > 0 || pKpis.revenue > 0;
          const marginPct = pKpis.revenue > 0 ? (pKpis.netProfit / pKpis.revenue) * 100 : 0;
          const isProfit = pKpis.netProfit > 0;
          const isLoss = pKpis.netProfit < 0;
          const isBreakEven = hasData && (!isLoss && !isProfit || Math.abs(marginPct) < 2);
          const verdictLabel = !hasData
            ? "EN ATTENTE"
            : isBreakEven
              ? "BREAK EVEN"
              : isProfit
                ? "RENTABLE"
                : "PERTE";
          const verdictIcon = !hasData ? "—" : isBreakEven ? "≈" : isProfit ? "✓" : "✕";
          const verdictClass = !hasData
            ? "bg-muted text-muted-foreground"
            : isBreakEven
              ? "bg-[#eab308] text-foreground"
              : isProfit
                ? "bg-[#16a34a] text-white"
                : "bg-accent text-accent-foreground";
          const isSelected = selected.has(p.id);
          return (
            <div
              key={p.id}
              className={`p-6 grid grid-cols-1 md:grid-cols-[auto_auto_1fr_auto] gap-4 items-center ${
                i > 0 ? "border-t border-foreground" : ""
              } ${isSelected ? "bg-accent/5" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(p.id)}
                className="w-5 h-5 accent-accent cursor-pointer mt-1 md:mt-0"
                aria-label={`Sélectionner ${p.name}`}
              />
              {(p as any).image_url ? (
                <img
                  src={(p as any).image_url}
                  alt={p.name}
                  loading="lazy"
                  className="w-16 h-16 object-cover brutal-border-thin bg-muted"
                />
              ) : (
                <div className="w-16 h-16 brutal-border-thin bg-muted flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="text-xl font-black">{p.name}</div>
                  <span className="text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest">
                    {(p as any).business_mode === "cod" ? "💰 COD" : "📦 Dropship"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${verdictClass}`}
                    title={hasData ? `Profit net : ${formatCurrency(pKpis.netProfit, pCur)}` : "Saisis tes données pour obtenir un verdict"}
                  >
                    <span>{verdictIcon}</span>
                    <span>{verdictLabel}</span>
                  </span>
                  {Array.isArray((p as any).countries) &&
                    (p as any).countries.map((cc: string) => {
                      const c =
                        [...DROPSHIP_COUNTRIES, ...COD_COUNTRIES].find((x) => x.code === cc);
                      return c ? (
                        <span
                          key={cc}
                          className="text-xs font-mono brutal-border-thin px-1.5 py-0.5"
                          title={c.name}
                        >
                          {c.flag} {c.code}
                        </span>
                      ) : null;
                    })}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider">
                  <Stat label="Vente" value={formatCurrency(Number(p.sale_price), pCur)} />
                  <Stat label="Achat" value={formatCurrency(Number(p.cost_price), pCur)} />
                  {(p as any).business_mode === "cod" && Array.isArray((p as any).shipping_zones) && (p as any).shipping_zones.length > 0 ? (
                    <Stat
                      label="Expédition"
                      value={
                        (p as any).shipping_zones
                          .map((z: any) => `${z.name} ${formatCurrency(Number(z.cost), pCur)}`)
                          .join(" · ")
                      }
                    />
                  ) : (
                    <Stat label="Expédition" value={formatCurrency(Number((p as any).shipping_cost ?? 0), pCur)} />
                  )}
                  <Stat
                    label="Marge brute"
                    value={formatCurrency(margin, pCur)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="brutal-border-thin px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="brutal-border-thin border-accent text-accent px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest font-bold mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "0.01" : undefined}
        className="w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="text-foreground font-bold tabular">{value}</div>
    </div>
  );
}
