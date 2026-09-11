import { createRouter, useRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

/**
 * Récupération automatique après un déploiement.
 *
 * Chaque déploiement remplace les fichiers JS (noms hachés). Si un utilisateur
 * garde un onglet ouvert, son navigateur tente de charger des morceaux de code
 * qui n'existent plus : la coquille de la page reste affichée mais les écrans
 * suivants (admin, Analytics, etc.) ne se chargent plus — ça ressemble à un
 * problème de droits alors que c'est un cache périmé.
 *
 * Vite émet `vite:preloadError` dans ce cas : on recharge la page une seule
 * fois pour récupérer la nouvelle version (garde-fou de 10 s pour éviter une
 * boucle de rechargement si l'erreur a une autre origine).
 */
if (typeof window !== "undefined") {
  const RELOAD_KEY = "netodash:chunk-reload-at";
  window.addEventListener("vite:preloadError", () => {
    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
      if (Date.now() - last < 10_000) return;
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      // sessionStorage indisponible (navigation privée stricte) : on recharge quand même
    }
    window.location.reload();
  });
}

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  // Après un déploiement, un onglet resté ouvert ne retrouve plus ses fichiers
  // JS : le seul correctif est un rechargement complet.
  const staleBundle = /dynamically imported module|Loading chunk|preloadError|Importing a module script failed/i.test(
    error?.message ?? "",
  );
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full brutal-border p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">ERREUR</div>
        <h1 className="text-3xl font-black tracking-tight">
          {staleBundle ? "Nouvelle version disponible." : "Quelque chose s'est cassé."}
        </h1>
        {staleBundle && (
          <p className="mt-3 text-sm text-muted-foreground">
            Une mise à jour du site a eu lieu pendant que cette page était ouverte.
            Recharge pour continuer.
          </p>
        )}
        {import.meta.env.DEV && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto brutal-border-thin p-3 font-mono text-xs text-accent">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              if (staleBundle) {
                window.location.reload();
                return;
              }
              router.invalidate();
              reset();
            }}
            className="brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
          >
            {staleBundle ? "Recharger" : "Réessayer"}
          </button>
          <a
            href="/"
            className="brutal-border px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Cache "frais" 5 min : pas de refetch entre re-renders ni navigations
        // tant que la donnée a moins de 5 min. Au-delà, refetch en arrière-plan.
        staleTime: 5 * 60_000,
        // Garde la donnée 30 min en mémoire après démontage du dernier consommateur.
        gcTime: 30 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    // Laisse TanStack Query décider de la fraîcheur (sinon le cache Router court-circuite Query).
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
