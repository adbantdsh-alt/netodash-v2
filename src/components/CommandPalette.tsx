import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/lib/auth-context";
import { useProducts } from "@/lib/queries";
import { useActiveMode } from "@/lib/use-active-mode";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useActiveMode();
  const products = useProducts(user?.id);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const productItems = useMemo(() => (products.data ?? []).slice(0, 30), [products.data]);

  function go(path: string) {
    onOpenChange(false);
    navigate({ to: path as any });
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Rechercher une page, un produit, une action…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        <CommandGroup heading="Actions rapides">
          <CommandItem
            onSelect={() => go("/entries")}
            keywords={["nouvelle", "saisie", "ajouter", "vente"]}
          >
            <span className="mr-2">＋</span> Nouvelle saisie
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">N</span>
          </CommandItem>
          <CommandItem
            onSelect={() => go("/roas-calculator")}
            keywords={["roas", "calculateur", "pub"]}
          >
            <span className="mr-2">⚖</span> Calculateur ROAS
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setMode(mode === "cod" ? "dropshipping" : "cod");
              onOpenChange(false);
            }}
            keywords={["mode", "cod", "drop", "basculer"]}
          >
            <span className="mr-2">⇄</span> Basculer en mode {mode === "cod" ? "Dropshipping" : "COD"}
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/dashboard")} keywords={["dashboard", "accueil", "kpi"]}>
            <span className="mr-2">▤</span> Dashboard
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">G D</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/products")} keywords={["produit", "catalogue"]}>
            <span className="mr-2">◫</span> Produits
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">G P</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/entries")} keywords={["saisie", "ventes", "journal"]}>
            <span className="mr-2">≡</span> Saisies
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">G S</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/analytics")} keywords={["analytics", "stats"]}>
            <span className="mr-2">◴</span> Analytics
          </CommandItem>
          <CommandItem onSelect={() => go("/plan")} keywords={["plan", "abonnement", "facturation"]}>
            <span className="mr-2">💳</span> Mon plan
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")} keywords={["paramètres", "compte", "profil"]}>
            <span className="mr-2">⚙</span> Paramètres
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">G C</span>
          </CommandItem>
        </CommandGroup>

        {productItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`Produits (${productItems.length})`}>
              {productItems.map((p: any) => (
                <CommandItem
                  key={p.id}
                  value={`prod-${p.id}-${p.name}`}
                  onSelect={() => go("/products")}
                >
                  <span className="mr-2">◆</span> {p.name}
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">
                    {p.currency ?? ""}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Session">
          <CommandItem
            onSelect={async () => {
              onOpenChange(false);
              await signOut();
              navigate({ to: "/" });
            }}
          >
            <span className="mr-2">→</span> Déconnexion
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
