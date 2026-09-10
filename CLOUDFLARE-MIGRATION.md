# Migration Cloudflare Workers + revendication du domaine

> Branche : `cloudflare-migration`
> Le **code** est prêt et vérifié par un build réel + un smoke test du Worker.
> Ce document liste les étapes qui ne peuvent être faites que par toi, parce
> qu'elles touchent des comptes (Cloudflare, Lovable, Supabase, Stripe, Shopify).

---

## 0. Ce qui a été fait dans le code

| Fichier | Changement |
|---|---|
| `vite.config.ts` | Preset Nitro `vercel` → **`cloudflare-module`** (le preset par défaut du framework — Vercel était la déviation). Ajout de `serverDir`, `scheduledTasks`, `compatibilityDate` pinnée, en-têtes de sécurité, CORS réduit au seul endpoint de l'extension. |
| `server/tasks/shopify-sync.ts` | **Nouveau.** Tâche planifiée Nitro, déclenchée par Cron Trigger. |
| `src/routes/api/public/hooks/shopify-sync.ts` | **Supprimé.** C'était un endpoint HTTP **sans aucune authentification**. |
| `src/lib/site-url.server.ts` | **Nouveau.** Source unique de vérité du domaine (`PUBLIC_SITE_URL`). |
| `src/lib/payments.functions.ts`, `src/lib/stripe.functions.ts`, `src/lib/admin/magic-link.functions.ts` | Plus aucun domaine en dur ni résidu `*.lovable.app`. |
| `src/lib/admin/users.functions.ts` | `stopImpersonation` authentifié ; `adminImpersonateUser` refuse les cibles admin. |
| `src/lib/admin/auth.functions.ts` | `checkIsAdminAccount` authentifié (plus d'oracle d'énumération). |
| `supabase/migrations/20260618100000_harden_beta_claim_and_acl.sql` | **Nouveau.** Ferme l'auto-octroi du plan Scale. |
| `package.json` | Scripts `deploy` / `cf:dev` / `cf:types` / `cf:tail` ; dépendance `wrangler`. |
| `vercel.json`, `scripts/patch-vercel-tslib.cjs`, `.vercel/` (334 fichiers, 8,5 Mo) | **Supprimés.** Plus d'artefacts de build committés. |

**Vérifié localement :**
- `npm run build` → OK, génère `dist/server/wrangler.json` (nom `netodash`, cron `0 */2 * * *`, `nodejs_compat`, assets).
- `npx tsc --noEmit` → 0 erreur.
- `wrangler dev` → le Worker démarre, SSR 200, en-têtes de sécurité présents.
- Cron déclenché manuellement → la tâche s'exécute réellement et journalise.
- `process.env` **est bien peuplé** sur Workers (risque n°1 écarté).
- Taille du Worker : 5,2 Mo / 64 MiB autorisés — large marge.

---

## 1. Revendiquer le domaine (chez Lovable)

Procédure officielle : **Workspace settings → Workspace domains → `Configure`** sur le domaine → menu **⋯** → **`Transfer out`**.

1. **Désactive le transfer lock** (le bouton `Reveal authorization code` reste grisé tant qu'il est actif).
2. Clique **`Reveal authorization code`** → récupère le **code EPP**.
   Générer un nouveau code **invalide le précédent** : ne le fais qu'une fois.
3. Donne ce code à **Cloudflare Registrar** (Dashboard → Domain Registration → Transfer).

Points importants :
- Le domaine doit avoir **au moins 60 jours** (règle ICANN). Lovable affiche la date d'éligibilité.
- Un transfert prend **plusieurs jours** (validation du registrar sortant).
- **C'est irréversible côté Lovable** : dès que le transfert aboutit, le domaine est déconnecté de tous les projets Lovable et ne sert plus de trafic depuis là.
- **Ton domaine n'est pas lié à ton abonnement** : la facturation est séparée. Même en résiliant Lovable tu gardes le contrôle et peux le transférer. **Aucune urgence.**

### Alternative sans transfert
Si tu veux juste que le domaine serve Cloudflare sans changer de registrar : `Configure` → section **Nameservers** → `Edit` → mets les 2 nameservers Cloudflare. Réversible via `Reset to Lovable`.
⚠️ Lovable cesse alors de gérer le DNS : **tu deviens responsable de tous les enregistrements, et l'e-mail du domaine tombe tant que tu ne les recrées pas.**

---

## 2. ☠️ Avant de toucher aux nameservers : sauvegarde le DNS

**Note tous les enregistrements actuels** (Lovable → Configure → DNS records), en particulier :

- **MX** (si tu as du mail sur `netodash.com` : support@, contact@…) — **à recréer à l'identique dans Cloudflare, sinon l'e-mail est coupé.**
- SPF / DKIM / DMARC (TXT) — sinon tes e-mails partent en spam.
- Tout TXT de vérification (Google Search Console, etc.).

---

## 3. Déployer le Worker

```bash
npm ci
npx wrangler login          # une seule fois
npm run deploy              # build + wrangler deploy
```

**Avant le premier déploiement**, définis les variables d'environnement. C'est le point qui casse le plus souvent.

### Secrets et variables à créer (Dashboard → Workers → netodash → Settings → Variables)

| Variable | Type | Valeur |
|---|---|---|
| `SUPABASE_URL` | Texte | `https://kycehzweexbutkxygcpc.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Texte | clé `sb_publishable_…` (publique) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | clé `service_role` — **jamais** en clair |
| `PUBLIC_SITE_URL` | Texte | `https://netodash.com` |
| `SUPER_ADMIN_EMAILS` | Texte | liste d'e-mails séparés par des virgules |
| `STRIPE_LIVE_API_KEY` / `STRIPE_SANDBOX_API_KEY` | **Secret** | `sk_live_…` / `sk_test_…` |
| `PAYMENTS_LIVE_WEBHOOK_SECRET` / `PAYMENTS_SANDBOX_WEBHOOK_SECRET` | **Secret** | `whsec_…` |
| `STRIPE_BETA_50_COUPON_LIVE` / `_SANDBOX` | Texte | id du coupon |
| `UNITECH_API_KEY` | **Secret** | clé API Unitech |
| `SHOPIFY_CLIENT_ID` / `SHOPIFY_CLIENT_SECRET` / `SHOPIFY_OAUTH_STATE_SECRET` | Secret | app Shopify |
| `OPENAI_API_KEY` | **Secret** | `sk-proj-…` |
| `COACH_MODEL` | Texte | `gpt-4o-mini` (optionnel) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_PAYMENTS_CLIENT_TOKEN` | Texte | injectées au **build** (pas au runtime) |

> **`SUPER_ADMIN_EMAILS` est désormais obligatoire pour l'auto-bootstrap admin.**
> L'ancienne liste était codée en dur dans le source — c'était une porte dérobée.
> Tes comptes admin existants restent administrateurs (ils sont déjà dans
> `admin.accounts`), donc **ne rien mettre ne te coupe pas l'accès**.

### Ordre recommandé
1. `npm run deploy` → teste sur `https://netodash.<ton-sous-domaine>.workers.dev`.
2. Vérifie : page d'accueil, `/auth`, `/admin/login`, un paiement test.
3. Seulement ensuite, rattache le domaine.

---

## 4. Rattacher le domaine (racine `netodash.com`)

Cloudflare nécessite que la **zone** soit dans ton compte. Une fois le DNS géré par Cloudflare :

**Dashboard → Workers & Pages → netodash → Settings → Domains & Routes → Add → Custom Domain** :
- `netodash.com`
- `www.netodash.com`
- `app.netodash.com` ← **à garder** (voir §5)

La racine peut être un Custom Domain sur Workers : Cloudflare crée l'enregistrement DNS et le certificat automatiquement.

**Version déclarative** (alternative, une fois la zone active) — dans `vite.config.ts`, bloc `cloudflare.wrangler` :
```ts
routes: [
  { pattern: "netodash.com", custom_domain: true },
  { pattern: "www.netodash.com", custom_domain: true },
  { pattern: "app.netodash.com", custom_domain: true },
],
```

---

## 5. ⚠️ Ne casse pas l'extension Chrome

L'extension **v1.5.2 est déjà publiée** avec :
- `manifest.json` → `host_permissions: ["https://app.netodash.com/*"]`
- `popup.js` → endpoint `https://app.netodash.com/api/public/extension-track`

**Tu ne peux pas la mettre à jour instantanément** (délai de validation du Chrome Web Store, et les anciennes versions restent installées).

**Conséquence : garde `app.netodash.com` servi en direct, PAS en redirection 301.**
Un `app.… → netodash.com` en 301 transformerait le `POST` de l'extension en `GET` et **casserait silencieusement le tracking**.

C'est pour ça que `src/lib/site-url.server.ts` conserve `app.netodash.com` dans l'allowlist. Pour la prochaine version de l'extension : change `TRACK_URL` et `host_permissions` vers `netodash.com`, puis attends ~2 mois avant de retirer l'alias.

---

## 6. Reconfigurer les services externes

Chaque ligne est une panne si elle est oubliée.

| Service | Où | Quoi |
|---|---|---|
| **Supabase Auth** | Authentication → URL Configuration | `Site URL` = `https://netodash.com` ; ajouter `https://netodash.com/**`, `https://app.netodash.com/**` et l'URL `*.workers.dev` dans **Redirect URLs**. **Sans ça le login casse.** |
| **Stripe** | Developers → Webhooks | Créer un endpoint `https://netodash.com/api/public/payments/webhook?env=live` (et `env=sandbox`). Récupérer les `whsec_…` → variables Cloudflare. |
| **Shopify** | Partner Dashboard → App → URLs | Ajouter `https://netodash.com/api/public/shopify/callback` dans **Allowed redirection URL(s)**. Sinon « Connecter Shopify » casse. |
| **Unitech** | Dashboard Unitech | Vérifier que les callbacks pointent vers le nouveau domaine. |
| **Google Search Console** | — | Re-vérifier la propriété, resoumettre `https://netodash.com/sitemap.xml`. |

---

## 7. Base de données : appliquer la migration de sécurité

La migration `20260618100000_harden_beta_claim_and_acl.sql` **n'est pas encore appliquée** (elle est dans le dépôt). Applique-la sur Supabase :

```bash
supabase link --project-ref kycehzweexbutkxygcpc
supabase db push
```

> ⚠️ **`supabase/config.toml` contient encore `project_id = "bkrvmrwlbofzurdnofyc"`**, qui ne
> correspond à rien dans ce dépôt. **Corrige-le avant tout `db push`**, sinon la migration
> part sur un projet inconnu.

Alternative sans CLI : copie le contenu du fichier dans **Supabase → SQL Editor** et exécute-le.

### Effet de cette migration
- Le drapeau `?beta=1` ne permet plus d'obtenir un plan Scale gratuit : il faut une place
  préexistante dans `beta_testers` (créée via le formulaire public plafonné, ou par un admin).
  **Le parcours « je m'inscris au programme puis je crée mon compte » est inchangé.**
- Les RPC bêta ne sont plus appelables en direct depuis PostgREST (l'app les appelle déjà
  en `service_role`).
- `profiles.legacy_dual_mode` n'est plus modifiable par l'utilisateur (déblocage gratuit du
  mode Dropshipping).

---

## 8. À vérifier après la bascule

- [ ] `netodash.com` sert bien le site, certificat OK
- [ ] **login / signup** fonctionnels (Supabase Redirect URLs)
- [ ] **e-mail** du domaine toujours reçu (MX recréés)
- [ ] paiement carte (Stripe) + mobile money (Unitech) de bout en bout
- [ ] webhook Stripe reçu (onglet Webhooks → événements)
- [ ] « Connecter Shopify » fonctionne
- [ ] extension Chrome : le tracking remonte toujours
- [ ] **Cron** : dans Cloudflare → Worker → Settings → Trigger Events, vérifier le cron `0 */2 * * *` ; lire les logs du premier déclenchement
- [ ] `/api/public/hooks/shopify-sync` renvoie **404** (l'endpoint non authentifié a bien disparu)
- [ ] `wrangler tail` pendant un parcours réel pour voir les erreurs runtime

---

## 9. Reste à faire plus tard (non bloquant)

1. **Zod 3 → 4.** La doc Cloudflare recommande `zod >= 4.5.0` sur Workers : les versions
   antérieures consomment « substantially more memory per schema », et l'isolat est limité à
   128 Mo. Chantier cassant (usage massif de Zod) — à planifier, pas urgent.
2. **CSP en enforce.** Elle est en `Report-Only` pour ne rien casser (l'hydratation TanStack
   utilise des scripts inline). Lis les rapports dans la console, puis bascule en
   `Content-Security-Policy`.
3. **Plan de secours Vercel.** `vercel.json` a été supprimé. Garde le projet Vercel en place
   quelques semaines, le temps de valider Cloudflare en production.
4. **Plan COD cassé côté serveur** (indépendant de cette migration) : `enforce_product_limit`
   n'a pas de branche `cod` → `ELSE 1`, donc un client du plan COD (10 $, censé illimité) est
   bloqué au 2ᵉ produit par une exception SQL. Voir `20260611074953_*.sql:20-27`.
5. **Suspension/bannissement inopérants** : `admin_status` n'est jamais lu au runtime, et le
   ban natif GoTrue n'est jamais posé → un utilisateur « banni » se reconnecte aussitôt
   (`src/lib/admin/users.functions.ts:429-510`).
6. **Révocation admin incomplète** : `public.user_roles` n'est pas nettoyé par
   `removeAdminAccount`, alors qu'il continue de valider des policies RLS.
7. **Audit admin lacunaire** : toutes les lectures PII et l'export complet d'`auth.users`
   ne sont pas journalisés ; `touchAdminLogin` est un no-op.
