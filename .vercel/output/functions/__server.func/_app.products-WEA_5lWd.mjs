import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { u as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { s as supabase } from "./_ssr/client-IbqXIlEo.mjs";
import { u as useAuth } from "./_ssr/router-CzeTO2qA.mjs";
import { u as useActiveMode, a as useProducts, c as useProfile, b as useEntries } from "./_ssr/queries-BVXaOG3h.mjs";
import { u as useDropshippingFx } from "./_ssr/use-dropshipping-fx-BU2EJUFO.mjs";
import { u as useSubscription } from "./_ssr/use-subscription-BHAI1fRK.mjs";
import { p as productLimitFor, b as canAddProduct, d as canUseMultiZonesCod, c as canAccessDropshipping, e as productLimitLabel } from "./_ssr/plan-limits-BrKNWLKd.mjs";
import { d as dateRangeForPreset, c as computeKPIs, f as formatCurrency, p as profitVerdictBadgeClass, a as profitVerdictLabel, b as profitVerdictKind } from "./_ssr/calc-DHAnOS6I.mjs";
import { n as normalizeDropshippingCurrency } from "./_ssr/dropshipping-fx-BpQqYaq9.mjs";
import "./_libs/stripe.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { o as objectType, c as coerce, s as stringType } from "./_libs/zod.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-CcppqNZQ.mjs";
import "./_ssr/shopify-sync.server-B3mu1MxO.mjs";
import "./_ssr/stripe.server-D419Yq3N.mjs";
import "events";
import "http";
import "https";
import "os";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
const REGIONS_BY_COUNTRY = {
  SN: [
    "Dakar",
    "Thiès",
    "Diourbel",
    "Fatick",
    "Kaffrine",
    "Kaolack",
    "Kédougou",
    "Kolda",
    "Louga",
    "Matam",
    "Saint-Louis",
    "Sédhiou",
    "Tambacounda",
    "Ziguinchor"
  ],
  CI: [
    "Abidjan",
    "Yamoussoukro",
    "Bouaké",
    "Daloa",
    "San-Pédro",
    "Korhogo",
    "Man",
    "Gagnoa",
    "Divo",
    "Anyama",
    "Abengourou",
    "Agboville",
    "Grand-Bassam",
    "Dabou",
    "Soubré",
    "Bondoukou",
    "Odienné",
    "Séguéla"
  ],
  ML: [
    "Bamako",
    "Kayes",
    "Koulikoro",
    "Sikasso",
    "Ségou",
    "Mopti",
    "Tombouctou",
    "Gao",
    "Kidal",
    "Taoudénit",
    "Ménaka"
  ],
  BF: [
    "Ouagadougou",
    "Bobo-Dioulasso",
    "Koudougou",
    "Banfora",
    "Ouahigouya",
    "Kaya",
    "Tenkodogo",
    "Fada N'Gourma",
    "Dédougou",
    "Manga",
    "Dori",
    "Gaoua",
    "Ziniaré"
  ],
  GN: [
    "Conakry",
    "Nzérékoré",
    "Kindia",
    "Kankan",
    "Boké",
    "Labé",
    "Mamou",
    "Faranah",
    "Siguiri",
    "Kissidougou"
  ],
  TG: [
    "Lomé",
    "Sokodé",
    "Kara",
    "Kpalimé",
    "Atakpamé",
    "Dapaong",
    "Tsévié",
    "Aného",
    "Bassar",
    "Tchamba"
  ],
  BJ: [
    "Cotonou",
    "Porto-Novo",
    "Parakou",
    "Abomey",
    "Bohicon",
    "Djougou",
    "Natitingou",
    "Lokossa",
    "Kandi",
    "Ouidah",
    "Abomey-Calavi"
  ],
  NE: [
    "Niamey",
    "Zinder",
    "Maradi",
    "Agadez",
    "Tahoua",
    "Dosso",
    "Tillabéri",
    "Diffa"
  ],
  MR: [
    "Nouakchott",
    "Nouadhibou",
    "Rosso",
    "Kaédi",
    "Zouérat",
    "Atar",
    "Néma",
    "Kiffa",
    "Aleg",
    "Tidjikja"
  ],
  CM: [
    "Yaoundé",
    "Douala",
    "Bafoussam",
    "Bamenda",
    "Garoua",
    "Maroua",
    "Ngaoundéré",
    "Bertoua",
    "Ebolowa",
    "Edéa",
    "Kribi",
    "Limbé",
    "Buea",
    "Dschang",
    "Kumba"
  ],
  GA: [
    "Libreville",
    "Port-Gentil",
    "Franceville",
    "Oyem",
    "Moanda",
    "Mouila",
    "Lambaréné",
    "Tchibanga",
    "Koulamoutou",
    "Makokou"
  ],
  CG: [
    "Brazzaville",
    "Pointe-Noire",
    "Dolisie",
    "Nkayi",
    "Ouesso",
    "Owando",
    "Madingou",
    "Impfondo"
  ],
  CD: [
    "Kinshasa",
    "Lubumbashi",
    "Mbuji-Mayi",
    "Kananga",
    "Kisangani",
    "Bukavu",
    "Goma",
    "Likasi",
    "Kolwezi",
    "Tshikapa",
    "Matadi",
    "Mbandaka",
    "Bunia",
    "Uvira",
    "Boma"
  ],
  TD: [
    "N'Djamena",
    "Moundou",
    "Sarh",
    "Abéché",
    "Kelo",
    "Koumra",
    "Pala",
    "Am Timan",
    "Bongor",
    "Mongo"
  ],
  CF: [
    "Bangui",
    "Bimbo",
    "Berbérati",
    "Carnot",
    "Bambari",
    "Bouar",
    "Bossangoa",
    "Bria",
    "Bangassou",
    "Nola"
  ],
  MA: [
    "Casablanca",
    "Rabat",
    "Fès",
    "Marrakech",
    "Agadir",
    "Tanger",
    "Meknès",
    "Oujda",
    "Kénitra",
    "Tétouan",
    "Salé",
    "Mohammedia",
    "El Jadida",
    "Béni Mellal",
    "Nador",
    "Taza",
    "Settat",
    "Khouribga",
    "Safi",
    "Larache",
    "Ouarzazate",
    "Errachidia",
    "Laâyoune",
    "Dakhla"
  ]
};
function regionsFor(countryCodes) {
  if (!countryCodes || countryCodes.length === 0) return [];
  const set = /* @__PURE__ */ new Set();
  for (const code of countryCodes) {
    for (const r of REGIONS_BY_COUNTRY[code] ?? []) set.add(r);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
}
const productSchema = objectType({
  name: stringType().trim().min(1, "Nom requis").max(100),
  sale_price: coerce.number().min(0).max(1e9),
  cost_price: coerce.number().min(0).max(1e9),
  shipping_cost: coerce.number().min(0).max(1e9)
});
const productCreateSchema = productSchema.refine((d) => d.sale_price > 0, {
  message: "Le prix de vente doit être > 0.",
  path: ["sale_price"]
}).refine((d) => d.cost_price + d.shipping_cost <= d.sale_price, {
  message: "Coût + livraison > prix de vente : marge négative.",
  path: ["cost_price"]
});
const DROPSHIP_COUNTRIES = [{
  code: "FR",
  name: "France",
  flag: "🇫🇷"
}, {
  code: "US",
  name: "États-Unis",
  flag: "🇺🇸"
}, {
  code: "GB",
  name: "Royaume-Uni",
  flag: "🇬🇧"
}, {
  code: "ES",
  name: "Espagne",
  flag: "🇪🇸"
}, {
  code: "DE",
  name: "Allemagne",
  flag: "🇩🇪"
}, {
  code: "IT",
  name: "Italie",
  flag: "🇮🇹"
}];
const COD_COUNTRIES = [{
  code: "SN",
  name: "Sénégal",
  flag: "🇸🇳"
}, {
  code: "CI",
  name: "Côte d'Ivoire",
  flag: "🇨🇮"
}, {
  code: "ML",
  name: "Mali",
  flag: "🇲🇱"
}, {
  code: "BF",
  name: "Burkina Faso",
  flag: "🇧🇫"
}, {
  code: "BJ",
  name: "Bénin",
  flag: "🇧🇯"
}, {
  code: "TG",
  name: "Togo",
  flag: "🇹🇬"
}, {
  code: "CM",
  name: "Cameroun",
  flag: "🇨🇲"
}, {
  code: "GA",
  name: "Gabon",
  flag: "🇬🇦"
}];
function ProductsPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    mode: activeMode
  } = useActiveMode();
  const productsQ = useProducts(user?.id);
  const profileQ = useProfile(user?.id);
  const sub = useSubscription(user?.id);
  const isCod = activeMode === "cod";
  const productCount = productsQ.data?.length ?? 0;
  const legacyDual = Boolean(profileQ.data?.legacy_dual_mode);
  const limit = productLimitFor(sub.plan, activeMode);
  const limitReached = !canAddProduct(sub.plan, productCount, activeMode);
  const multiZonesAllowed = canUseMultiZonesCod(sub.plan);
  const dropBlocked = !isCod && !canAccessDropshipping(sub.plan, legacyDual);
  const range = reactExports.useMemo(() => dateRangeForPreset("30d"), []);
  const entriesQ = useEntries(user?.id, range);
  const {
    fx: dropshippingFx
  } = useDropshippingFx(user?.id);
  const metaTaxPct = Number(profileQ.data?.meta_tax_pct ?? 0);
  const COUNTRIES = isCod ? COD_COUNTRIES : DROPSHIP_COUNTRIES;
  const defaultCountry = isCod ? "SN" : "FR";
  const [editing, setEditing] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [search, setSearch] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    name: "",
    sale_price: "",
    cost_price: "",
    shipping_cost: ""
  });
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [countries, setCountries] = reactExports.useState(/* @__PURE__ */ new Set([defaultCountry]));
  const [currency, setCurrency] = reactExports.useState("EUR");
  const defaultZones = () => [{
    name: "Zone 1",
    cost: "",
    regions: []
  }];
  const [zones, setZones] = reactExports.useState(defaultZones());
  const availableRegions = reactExports.useMemo(() => isCod ? regionsFor(Array.from(countries)) : [], [isCod, countries]);
  const regionsTakenBy = (idx) => {
    const s = /* @__PURE__ */ new Set();
    zones.forEach((z2, j) => {
      if (j === idx) return;
      for (const r of z2.regions) s.add(r);
    });
    return s;
  };
  const formCurrency = isCod ? "XOF" : currency;
  const currencySymbol = isCod ? "FCFA" : formCurrency;
  const allIds = productsQ.data?.map((p) => p.id) ?? [];
  const allSelected = allIds.length > 0 && selected.size === allIds.length;
  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    if (allSelected) setSelected(/* @__PURE__ */ new Set());
    else setSelected(new Set(allIds));
  }
  async function handleBulkDelete() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Supprimer ${ids.length} produit${ids.length > 1 ? "s" : ""} et toutes leurs données ?`)) return;
    const {
      error
    } = await supabase.from("products").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`${ids.length} produit${ids.length > 1 ? "s supprimés" : " supprimé"}.`);
    setSelected(/* @__PURE__ */ new Set());
    qc.invalidateQueries({
      queryKey: ["products"]
    });
  }
  function resetForm() {
    setForm({
      name: "",
      sale_price: "",
      cost_price: "",
      shipping_cost: ""
    });
    setImageUrl("");
    setCountries(/* @__PURE__ */ new Set([defaultCountry]));
    setCurrency("EUR");
    setZones(defaultZones());
    setEditing(null);
    setShowForm(false);
  }
  async function compressImage(file, maxDim = 1200, quality = 0.82) {
    const bitmap = await new Promise((resolve, reject) => {
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
    return await new Promise((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Compression échouée")), "image/jpeg", quality);
    });
  }
  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Lecture base64 impossible"));
      r.readAsDataURL(blob);
    });
  }
  async function handleImageUpload(file) {
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
      let blob;
      try {
        blob = await compressImage(file);
      } catch {
        blob = file;
      }
      const path = `${user.id}/${Date.now()}.jpg`;
      let lastErr = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const {
            error: upErr
          } = await supabase.storage.from("product-images").upload(path, blob, {
            upsert: false,
            contentType: "image/jpeg"
          });
          if (upErr) throw upErr;
          const {
            data,
            error: sErr
          } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365);
          if (sErr || !data?.signedUrl) throw sErr ?? new Error("URL signée indisponible");
          setImageUrl(data.signedUrl);
          toast.success("Image importée.");
          return;
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 400));
        }
      }
      const dataUrl = await blobToDataUrl(blob);
      if (dataUrl.length < 700 * 1024) {
        setImageUrl(dataUrl);
        toast.success("Image importée (mode local).");
        return;
      }
      throw lastErr ?? new Error("Upload impossible");
    } catch (e) {
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
  function toggleCountry(code) {
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
  function startEdit(p) {
    setForm({
      name: p.name,
      sale_price: String(p.sale_price),
      cost_price: String(p.cost_price),
      shipping_cost: String(p.shipping_cost ?? 0)
    });
    setImageUrl(String(p.image_url ?? ""));
    const cs = Array.isArray(p.countries) ? p.countries : [];
    setCountries(new Set(cs.length > 0 ? cs : [defaultCountry]));
    setCurrency(normalizeDropshippingCurrency(p.currency));
    const sz = Array.isArray(p.shipping_zones) ? p.shipping_zones : [];
    setZones(sz.length > 0 ? sz.map((z2) => ({
      name: String(z2.name ?? ""),
      cost: String(z2.cost ?? ""),
      regions: Array.isArray(z2.regions) ? z2.regions.map(String) : []
    })) : defaultZones());
    setEditing(p.id);
    setShowForm(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const cleanZones = zones.map((z2) => ({
      name: z2.name.trim(),
      cost: Number(z2.cost) || 0,
      regions: (z2.regions || []).map((r) => r.trim()).filter(Boolean)
    })).filter((z2) => z2.name.length > 0);
    const formForParse = isCod ? {
      ...form,
      shipping_cost: cleanZones.length > 0 ? String(cleanZones.reduce((s, z2) => s + z2.cost, 0) / cleanZones.length) : "0"
    } : form;
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
    const payload = {
      name: parsed.data.name,
      sale_price: parsed.data.sale_price,
      cost_price: parsed.data.cost_price,
      shipping_cost: parsed.data.shipping_cost,
      shipping_zones: isCod ? cleanZones : [],
      countries: Array.from(countries),
      currency: formCurrency,
      business_mode: activeMode,
      image_url: imageUrl || null,
      user_id: user.id
    };
    if (editing) {
      const {
        error
      } = await supabase.from("products").update(payload).eq("id", editing);
      if (error) return toast.error(error.message);
    } else {
      if (limitReached) {
        toast.error("Limite de produits atteinte pour ton plan.");
        return;
      }
      const {
        error
      } = await supabase.from("products").insert(payload);
      if (error) {
        const msg = `${error.message || ""} ${error.hint || ""}`;
        if (msg.includes("plan_product_limit_reached") || msg.toLowerCase().includes("limite de produits")) {
          toast.error("Tu as atteint la limite de produits de ton plan.", {
            description: "Passe au plan supérieur pour en ajouter davantage.",
            action: {
              label: "Voir les plans",
              onClick: () => navigate({
                to: "/plan"
              })
            }
          });
          return;
        }
        return toast.error(error.message);
      }
    }
    toast.success(editing ? "Produit mis à jour." : "Produit créé.");
    qc.invalidateQueries({
      queryKey: ["products"]
    });
    resetForm();
  }
  async function handleDelete(id) {
    if (!confirm("Supprimer ce produit et toutes ses données ?")) return;
    const {
      error
    } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produit supprimé.");
    qc.invalidateQueries({
      queryKey: ["products"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-10", children: [
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: isCod ? "CATALOGUE COD · AFRIQUE" : "CATALOGUE DROPSHIPPING" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-black tracking-tighter mt-1", children: "PRODUITS" })
      ] }),
      !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          if (limitReached) {
            toast.error("Limite de produits atteinte pour ton plan.");
            return;
          }
          setShowForm(true);
        }, disabled: limitReached, className: `brutal-border px-4 md:px-6 py-3 font-bold uppercase tracking-wider text-sm md:text-base ${limitReached ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60" : "bg-foreground text-background hover:bg-accent hover:border-accent"}`, children: "+ Nouveau produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground", children: [
          productCount,
          limit === -1 ? " / illimité" : ` / ${limit}`,
          " · Plan ",
          sub.plan,
          limitReached && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "ml-2 text-accent underline", children: "Upgrade →" })
        ] })
      ] })
    ] }),
    dropBlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 mb-6 bg-muted/40 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-wider", children: "Dropshipping indisponible" }),
        " · Ton plan COD ($10) ne couvre que le mode COD. Passe à Starter Drop pour ajouter des produits Dropshipping."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-widest", children: "Voir les plans Drop →" })
    ] }),
    limitReached && !showForm && productCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 mb-6 bg-amber-50 text-amber-900 flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold uppercase tracking-wider", children: "Limite atteinte" }),
        " · Ton plan",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sub.plan }),
        " autorise ",
        productLimitLabel(sub.plan, activeMode),
        " produit",
        limit > 1 ? "s" : "",
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "brutal-border-thin bg-foreground text-background px-3 py-2 text-xs font-bold uppercase tracking-widest", children: "Voir les plans →" })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "brutal-border p-6 md:p-8 mb-8 grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black", children: editing ? "MODIFIER" : "NOUVEAU PRODUIT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nom du produit", value: form.name, onChange: (v) => setForm({
          ...form,
          name: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Prix de vente (${currencySymbol})`, type: "number", value: form.sale_price, onChange: (v) => setForm({
          ...form,
          sale_price: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Coût d'achat (${currencySymbol})`, type: "number", value: form.cost_price, onChange: (v) => setForm({
          ...form,
          cost_price: v
        }) }),
        !isCod && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Coût d'expédition / commande (${currencySymbol})`, type: "number", value: form.shipping_cost, onChange: (v) => setForm({
          ...form,
          shipping_cost: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: [
          "Image du produit ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono normal-case", children: "— optionnelle" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
          imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: "Aperçu produit", className: "w-20 h-20 object-cover brutal-border-thin bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 brutal-border-thin bg-muted flex items-center justify-center text-3xl", children: "📦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "brutal-border-thin px-3 py-2 text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:bg-foreground hover:text-background inline-block w-fit", children: [
              uploadingImage ? "Upload…" : imageUrl ? "Remplacer l'image" : "Importer une image",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", disabled: uploadingImage, onChange: (e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
                e.target.value = "";
              } })
            ] }),
            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setImageUrl(""), className: "text-[10px] uppercase tracking-widest font-bold text-accent hover:underline w-fit", children: "Retirer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-mono text-muted-foreground", children: "JPG / PNG / WebP — max 5 Mo" })
          ] })
        ] })
      ] }),
      isCod ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4 bg-accent/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-1", children: "Devise du produit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black", children: "FCFA (XOF)" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "— verrouillée en mode COD" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold mb-3", children: [
          "Devise du produit ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["USD", "EUR", "GBP"].map((c) => {
          const active = currency === c;
          const label = c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "£ GBP";
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCurrency(c), className: `brutal-border-thin px-4 py-2 text-xs font-bold uppercase tracking-widest ${active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/5"}`, children: label }, c);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-4 ${isCod && countries.size === 0 ? "border-accent border-2 bg-accent/5" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
          isCod && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest", children: "Étape 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest font-bold", children: [
            "Pays cible ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "*" }),
            isCod && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono normal-case ml-2", children: "— multi-sélection" })
          ] })
        ] }),
        isCod && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-3", children: "Sélectionne d'abord tous les pays où tu livres ce produit — les régions disponibles s'afficheront ensuite dans les zones de livraison. Tu peux en cocher plusieurs." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: COUNTRIES.map((c) => {
          const active = countries.has(c.code);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleCountry(c.code), className: `brutal-border-thin px-3 py-1.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${active ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/10"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.flag }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.name })
          ] }, c.code);
        }) })
      ] }),
      isCod && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `brutal-border-thin p-4 ${availableRegions.length === 0 ? "opacity-60" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest", children: "Étape 2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold", children: "Zones de livraison (FCFA)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5", children: "Donne un nom à la zone, sélectionne les régions et fixe le coût" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: availableRegions.length === 0 || !multiZonesAllowed, onClick: () => {
            if (!multiZonesAllowed) return;
            setZones([...zones, {
              name: `Zone ${zones.length + 1}`,
              cost: "",
              regions: []
            }]);
          }, className: "brutal-border-thin px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground", children: "+ Zone" })
        ] }),
        !multiZonesAllowed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-dashed p-3 mb-3 text-[11px] font-mono text-muted-foreground", children: [
          "🔒 Multi-zones réservé au plan Pro Drop ($29) et au-dessus.",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/plan", className: "underline font-bold text-foreground", children: "Upgrade →" })
        ] }),
        availableRegions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin border-dashed p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: "👆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-widest mb-1", children: "Sélectionne un pays d'abord" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-mono text-muted-foreground", children: "Les régions disponibles dépendent du ou des pays cibles choisis à l'étape 1." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: zones.map((z2, i) => {
          const taken = regionsTakenBy(i);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brutal-border-thin p-3 grid gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: z2.name, onChange: (e) => {
                const next = [...zones];
                next[i] = {
                  ...next[i],
                  name: e.target.value
                };
                setZones(next);
              }, placeholder: `Zone ${i + 1}`, className: "brutal-border-thin bg-background px-3 py-2 font-mono text-sm flex-1 focus:outline-none focus:border-accent focus:border-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: z2.cost, onChange: (e) => {
                const next = [...zones];
                next[i] = {
                  ...next[i],
                  cost: e.target.value
                };
                setZones(next);
              }, type: "number", placeholder: "Coût FCFA", className: "brutal-border-thin bg-background px-3 py-2 font-mono text-sm w-32 focus:outline-none focus:border-accent focus:border-2" }),
              zones.length > 1 && multiZonesAllowed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setZones(zones.filter((_, j) => j !== i)), className: "text-xs font-bold px-2 py-2 hover:bg-foreground/10", title: "Supprimer la zone", children: "✕" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2", children: [
                "Régions (",
                z2.regions.length,
                " sél.)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: availableRegions.map((r) => {
                const selectedHere = z2.regions.includes(r);
                const takenElsewhere = taken.has(r) && !selectedHere;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: takenElsewhere, onClick: () => {
                  const next = [...zones];
                  const cur = new Set(next[i].regions);
                  if (cur.has(r)) cur.delete(r);
                  else cur.add(r);
                  next[i] = {
                    ...next[i],
                    regions: Array.from(cur)
                  };
                  setZones(next);
                }, className: `brutal-border-thin px-2 py-1 text-[11px] font-mono ${selectedHere ? "bg-foreground text-background border-foreground" : takenElsewhere ? "opacity-30 cursor-not-allowed" : "hover:bg-foreground/10"}`, title: takenElsewhere ? "Déjà dans une autre zone" : "", children: r }, r);
              }) })
            ] })
          ] }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "brutal-border bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider hover:bg-accent hover:border-accent", children: editing ? "ENREGISTRER" : "CRÉER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: resetForm, className: "brutal-border px-6 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background", children: "Annuler" })
      ] })
    ] }),
    productsQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-0 brutal-border", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center animate-pulse ${i > 0 ? "border-t border-foreground" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-foreground/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-48 bg-foreground/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-72 bg-foreground/10" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-32 bg-foreground/10" })
    ] }, i)) }),
    productsQ.data && productsQ.data.length === 0 && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brutal-border p-10 text-center text-muted-foreground", children: "Aucun produit. Crée ton premier pour commencer." }),
    productsQ.data && productsQ.data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: allSelected, onChange: toggleSelectAll, className: "w-4 h-4 accent-accent" }),
          selected.size > 0 ? `${selected.size} sélectionné${selected.size > 1 ? "s" : ""}` : "Tout sélectionner"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "search", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Rechercher un produit…", className: "brutal-border-thin bg-background pl-8 pr-3 py-2 text-xs font-mono w-56 focus:border-accent focus:border-2 outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "🔍" })
        ] })
      ] }),
      selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBulkDelete, className: "brutal-border-thin border-accent text-accent px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground", children: [
        "Supprimer la sélection (",
        selected.size,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-0 brutal-border", children: productsQ.data?.filter((p) => search.trim() === "" ? true : p.name.toLowerCase().includes(search.trim().toLowerCase())).map((p, i) => {
      const pCur = isCod ? "XOF" : normalizeDropshippingCurrency(p.currency);
      const margin = Number(p.sale_price) - Number(p.cost_price) - Number(p.shipping_cost ?? 0);
      const productEntries = (entriesQ.data ?? []).filter((e) => e.product_id === p.id);
      const pKpis = isCod ? computeKPIs(productEntries, [p], "XOF", void 0, metaTaxPct) : computeKPIs(productEntries, [p], pCur, dropshippingFx, metaTaxPct);
      const hasData = pKpis.adSpend > 0 || pKpis.revenue > 0;
      const rowVerdict = profitVerdictKind(pKpis.netProfit, pKpis.revenue, hasData);
      const verdictLabel = profitVerdictLabel(rowVerdict);
      const verdictIcon = rowVerdict === "break_even" ? "≈" : rowVerdict === "profit" ? "✓" : rowVerdict === "loss" ? "✕" : "—";
      const verdictClass = profitVerdictBadgeClass(rowVerdict);
      const isSelected = selected.has(p.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-6 grid grid-cols-1 md:grid-cols-[auto_auto_1fr_auto] gap-4 items-center ${i > 0 ? "border-t border-foreground" : ""} ${isSelected ? "bg-accent/5" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(p.id), className: "w-5 h-5 accent-accent cursor-pointer mt-1 md:mt-0", "aria-label": `Sélectionner ${p.name}` }),
        p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, loading: "lazy", className: "w-16 h-16 object-cover brutal-border-thin bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 brutal-border-thin bg-muted flex items-center justify-center text-2xl", children: "📦" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono brutal-border-thin px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-widest", children: p.business_mode === "cod" ? "💰 COD" : "📦 Dropship" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest brutal-border-thin ${verdictClass}`, title: hasData ? `Profit net : ${formatCurrency(pKpis.netProfit, pCur)}` : "Saisis tes données pour obtenir un verdict", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: verdictIcon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: verdictLabel })
            ] }),
            Array.isArray(p.countries) && p.countries.map((cc) => {
              const c = [...DROPSHIP_COUNTRIES, ...COD_COUNTRIES].find((x) => x.code === cc);
              return c ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono brutal-border-thin px-1.5 py-0.5", title: c.name, children: [
                c.flag,
                " ",
                c.code
              ] }, cc) : null;
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Vente", value: formatCurrency(Number(p.sale_price), pCur) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Achat", value: formatCurrency(Number(p.cost_price), pCur) }),
            p.business_mode === "cod" && Array.isArray(p.shipping_zones) && p.shipping_zones.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Expédition", value: p.shipping_zones.map((z2) => `${z2.name} ${formatCurrency(Number(z2.cost), pCur)}`).join(" · ") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Expédition", value: formatCurrency(Number(p.shipping_cost ?? 0), pCur) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Marge brute", value: formatCurrency(margin, pCur) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEdit(p), className: "brutal-border-thin px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background", children: "Modifier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(p.id), className: "brutal-border-thin border-accent text-accent px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-accent-foreground", children: "Supprimer" })
        ] })
      ] }, p.id);
    }) })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest font-bold mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), required: true, min: type === "number" ? 0 : void 0, step: type === "number" ? "0.01" : void 0, className: "w-full bg-background brutal-border-thin px-4 py-3 font-mono focus:border-accent focus:border-2 outline-none" })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground font-bold tabular", children: value })
  ] });
}
export {
  ProductsPage as component
};
