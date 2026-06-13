import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  adminListUsers,
  adminImpersonateUser,
  adminGenerateMagicLink,
  adminGrantFreeAccess,
} from "@/lib/admin/users.functions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Search, ChevronLeft, ChevronRight, ExternalLink, KeyRound, Copy, Check, MessageCircle, Phone, Gift } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/users")({
  component: AdminUsersPage,
});

type Row = Awaited<ReturnType<typeof adminListUsers>>["users"][number];

const GRANT_PLANS = [
  { id: "cod", label: "COD ($10)" },
  { id: "basic", label: "Starter ($12)" },
  { id: "starter", label: "Pro ($29)" },
  { id: "pro", label: "Scale ($79)" },
] as const;

function AdminUsersPage() {
  const listUsers = useServerFn(adminListUsers);
  const impersonateUser = useServerFn(adminImpersonateUser);
  const generateMagicLink = useServerFn(adminGenerateMagicLink);
  const grantFreeAccess = useServerFn(adminGrantFreeAccess);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicBusy, setMagicBusy] = useState(false);
  const [magicResult, setMagicResult] = useState<
    | { link: string | null; email: string; emailConfirmedNow: boolean; banLifted: boolean }
    | null
  >(null);
  const [magicErr, setMagicErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [grantUser, setGrantUser] = useState<Row | null>(null);
  const [grantDuration, setGrantDuration] = useState(30);
  const [grantUnit, setGrantUnit] = useState<"days" | "months" | "years">("days");
  const [grantPlan, setGrantPlan] = useState<(typeof GRANT_PLANS)[number]["id"]>("starter");
  const [grantBusy, setGrantBusy] = useState(false);
  const pageSize = 25;

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listUsers({
        data: {
          page,
          pageSize,
          search: search || undefined,
          plan: (plan || undefined) as never,
          status: (status || undefined) as never,
        },
      });
      setRows(res.users);
      setTotal(res.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, plan, status]);

  const onImpersonate = async (id: string, email: string) => {
    if (!confirm(`Impersonner ${email} ? Cette action est tracée.`)) return;
    try {
      const r = await impersonateUser({ data: { userId: id } });
      if (r.link) {
        window.open(r.link, "_blank", "noopener,noreferrer");
      } else {
        alert("Lien d'impersonation indisponible");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openGrant = (u: Row) => {
    setGrantUser(u);
    setGrantDuration(30);
    setGrantUnit("days");
    setGrantPlan("starter");
  };

  const confirmGrant = async () => {
    if (!grantUser) return;
    setGrantBusy(true);
    try {
      const r = await grantFreeAccess({
        data: {
          userId: grantUser.id,
          duration: grantDuration,
          unit: grantUnit,
          plan: grantPlan,
        },
      });
      alert(
        `Accès offert à ${grantUser.email} · ${r.planOffert} · ${r.duree} · jusqu'au ${new Date(r.endsAt).toLocaleDateString("fr-FR")}`,
      );
      setGrantUser(null);
      void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setGrantBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="admin-eyebrow">Back-office</div>
          <h1 className="admin-h1">Utilisateurs</h1>
          <div className="text-sm mt-1 text-muted-foreground">
            {total} compte{total > 1 ? "s" : ""} au total
          </div>
        </div>
      </div>

      {/* Débloquer un compte payant via magic link */}
      <div className="admin-card mb-4">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound size={16} />
          <h2 className="text-sm font-bold uppercase tracking-widest m-0">
            Magic link — débloquer un compte
          </h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Génère un lien de connexion immédiate pour l'utilisateur (1 usage, expire vite).
          Confirme l'email et lève un éventuel bannissement automatiquement.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!magicEmail.trim()) return;
            setMagicBusy(true);
            setMagicErr(null);
            setMagicResult(null);
            setCopied(false);
            try {
              const r = await generateMagicLink({ data: { email: magicEmail.trim() } });
              setMagicResult({
                link: r.link,
                email: r.email,
                emailConfirmedNow: r.emailConfirmedNow,
                banLifted: r.banLifted,
              });
            } catch (e2) {
              setMagicErr(e2 instanceof Error ? e2.message : "Erreur");
            } finally {
              setMagicBusy(false);
            }
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <input
            type="email"
            value={magicEmail}
            onChange={(e) => setMagicEmail(e.target.value)}
            placeholder="email@client.com"
            className="flex-1 min-w-[240px] bg-transparent outline-none text-sm py-2 px-3 brutal-border-thin"
            required
          />
          <button type="submit" disabled={magicBusy} className="admin-btn-primary">
            {magicBusy ? "Génération…" : "Générer le lien"}
          </button>
        </form>

        {magicErr && (
          <div className="mt-3 text-sm text-destructive">{magicErr}</div>
        )}

        {magicResult && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-muted-foreground">
              ✅ Lien généré pour <span className="font-bold">{magicResult.email}</span>
              {magicResult.emailConfirmedNow && " · email confirmé"}
              {magicResult.banLifted && " · ban levé"}
            </div>
            {magicResult.link ? (
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={magicResult.link}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 bg-muted text-xs font-mono py-2 px-3 brutal-border-thin overflow-hidden text-ellipsis"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!magicResult.link) return;
                    try {
                      await navigator.clipboard.writeText(magicResult.link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      /* ignore */
                    }
                  }}
                  className="admin-btn-ghost inline-flex items-center gap-1"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copié" : "Copier"}
                </button>
                <a
                  href={magicResult.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-ghost inline-flex items-center gap-1"
                >
                  <ExternalLink size={14} /> Ouvrir
                </a>
              </div>
            ) : (
              <div className="text-sm text-destructive">Lien indisponible.</div>
            )}
            <div className="text-[11px] text-muted-foreground">
              Envoie ce lien à l'utilisateur par email/WhatsApp. Il sera connecté en un clic.
            </div>
          </div>
        )}
      </div>


      <div className="admin-card mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            void load();
          }}
          className="flex items-center gap-2 w-full md:flex-1 md:min-w-[260px]"
        >
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email, nom ou téléphone…"
            className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
          />
          <button type="submit" className="admin-btn-primary shrink-0">
            OK
          </button>
        </form>
        <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
          <select
            value={plan}
            onChange={(e) => {
              setPlan(e.target.value);
              setPage(1);
            }}
            className="admin-select"
          >
            <option value="">Tous plans</option>
            <option value="free">Free</option>
            <option value="trial">Trial</option>
            <option value="cod">COD</option>
            <option value="basic">Starter</option>
            <option value="starter">Pro</option>
            <option value="pro">Scale</option>
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="admin-select"
          >
            <option value="">Tous statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="banned">Banni</option>
          </select>
        </div>
      </div>

      {err && <div className="admin-card text-destructive mb-4">{err}</div>}

      {/* MOBILE — liste en cartes */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="admin-card text-center text-xs uppercase tracking-widest">
            Chargement…
          </div>
        ) : rows.length === 0 ? (
          <div className="admin-card text-center text-muted-foreground">
            Aucun utilisateur.
          </div>
        ) : (
          rows.map((u) => {
            const waLink = u.phoneDigits
              ? `https://wa.me/${u.phoneDigits}`
              : null;
            const telLink = u.phoneDigits ? `tel:+${u.phoneDigits}` : null;
            return (
              <div key={u.id} className="admin-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm break-all">{u.email}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {u.name}
                    </div>
                  </div>
                  <StatusBadge status={u.status as never} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-60">Plan</div>
                    <div className="font-bold uppercase">{u.plan}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-60">Pays</div>
                    <div className="font-bold">{u.country}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase tracking-widest opacity-60">Téléphone</div>
                    {u.phone ? (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-mono text-sm break-all">{u.phone}</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-xs">—</div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase tracking-widest opacity-60">Créé le</div>
                    <div>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-ghost inline-flex items-center justify-center gap-1"
                      style={{ color: "#1f8a4c", borderColor: "#1f8a4c" }}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                  {telLink && (
                    <a
                      href={telLink}
                      className="admin-btn-ghost inline-flex items-center justify-center gap-1"
                    >
                      <Phone size={14} /> Appeler
                    </a>
                  )}
                  <Link
                    to={`/admin/users/${u.id}` as never}
                    className="admin-btn-ghost inline-flex items-center justify-center"
                  >
                    Détails
                  </Link>
                  <button
                    onClick={() => openGrant(u)}
                    className="admin-btn-ghost inline-flex items-center justify-center gap-1"
                  >
                    <Gift size={12} /> Offrir accès
                  </button>
                  <button
                    onClick={() => onImpersonate(u.id, u.email)}
                    className="admin-btn-ghost inline-flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={12} /> Impersonner
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP — tableau */}
      <div className="admin-card p-0 overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="admin-th">Email</th>
              <th className="admin-th">Nom</th>
              <th className="admin-th">WhatsApp / Tél</th>
              <th className="admin-th">Pays</th>
              <th className="admin-th">Plan</th>
              <th className="admin-th">Statut</th>
              <th className="admin-th">Créé le</th>
              <th className="admin-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-xs uppercase tracking-widest">
                  Chargement…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">
                  Aucun utilisateur.
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const waLink = u.phoneDigits
                  ? `https://wa.me/${u.phoneDigits}`
                  : null;
                return (
                  <tr key={u.id} className="border-t border-foreground/10">
                    <td className="admin-td font-bold">{u.email}</td>
                    <td className="admin-td">{u.name}</td>
                    <td className="admin-td font-mono text-xs whitespace-nowrap">
                      {u.phone ? (
                        <div className="flex items-center gap-2">
                          <span>{u.phone}</span>
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp"
                              style={{ color: "#1f8a4c" }}
                              className="inline-flex"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="admin-td">{u.country}</td>
                    <td className="admin-td uppercase text-xs font-bold">{u.plan}</td>
                    <td className="admin-td">
                      <StatusBadge status={u.status as never} />
                    </td>
                    <td className="admin-td text-xs">
                      {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="admin-td text-right whitespace-nowrap">
                      <Link
                        to={`/admin/users/${u.id}` as never}
                        className="admin-btn-ghost mr-2"
                      >
                        Détails
                      </Link>
                      <button
                        onClick={() => openGrant(u)}
                        className="admin-btn-ghost inline-flex items-center gap-1 mr-2"
                        title="Offrir accès gratuit"
                      >
                        <Gift size={12} /> Offrir
                      </button>
                      <button
                        onClick={() => onImpersonate(u.id, u.email)}
                        className="admin-btn-ghost inline-flex items-center gap-1"
                        title="Générer un magic link"
                      >
                        <ExternalLink size={12} /> Impersonner
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs uppercase tracking-widest">
        <div>
          Page {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="admin-btn-ghost disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Préc.
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="admin-btn-ghost disabled:opacity-30"
          >
            Suiv. <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={!!grantUser}
        title="Offrir accès gratuit"
        description={
          grantUser
            ? `Prolonger l'accès de ${grantUser.email} avec le plan choisi. L'action est tracée dans les audit logs.`
            : undefined
        }
        confirmLabel="Confirmer"
        disabled={grantBusy || grantDuration < 1}
        onCancel={() => setGrantUser(null)}
        onConfirm={confirmGrant}
      >
        <div className="grid gap-3 mb-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Durée</label>
            <input
              type="number"
              min={1}
              max={3650}
              value={grantDuration}
              onChange={(e) => setGrantDuration(Math.max(1, Number(e.target.value) || 1))}
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Unité</label>
            <select
              className="admin-input w-full"
              value={grantUnit}
              onChange={(e) => setGrantUnit(e.target.value as "days" | "months" | "years")}
            >
              <option value="days">Jours</option>
              <option value="months">Mois</option>
              <option value="years">Années</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Plan offert</label>
            <select
              className="admin-input w-full"
              value={grantPlan}
              onChange={(e) => setGrantPlan(e.target.value as (typeof GRANT_PLANS)[number]["id"])}
            >
              {GRANT_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
