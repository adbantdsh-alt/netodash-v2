import { createRouter, useRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full brutal-border p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">ERREUR</div>
        <h1 className="text-3xl font-black tracking-tight">Quelque chose s'est cassé.</h1>
        {import.meta.env.DEV && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto brutal-border-thin p-3 font-mono text-xs text-accent">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="brutal-border bg-foreground text-background px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent"
          >
            Réessayer
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
