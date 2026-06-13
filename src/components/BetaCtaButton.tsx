import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { registerBetaWaitlist } from "@/lib/beta.functions";
import { useBetaProgram, useInvalidateBetaProgram } from "@/lib/use-beta-program";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type BetaCtaVariant =
  | "header"
  | "headerMobile"
  | "hero"
  | "card"
  | "cardHighlight"
  | "final"
  | "inline";

const VARIANT_CLASSES: Record<BetaCtaVariant, string> = {
  header:
    "brutal-border bg-foreground text-background px-5 py-2.5 font-bold uppercase tracking-wider text-sm hover:bg-accent hover:border-accent",
  headerMobile:
    "brutal-border bg-foreground text-background px-3 py-2 font-bold uppercase tracking-wider text-xs",
  hero: "brutal-border bg-accent text-accent-foreground border-accent px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-wider text-sm md:text-base text-center hover:bg-foreground hover:text-background hover:border-foreground",
  card: "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-background text-foreground hover:bg-foreground hover:text-background",
  cardHighlight:
    "block w-full text-center brutal-border px-5 py-3 font-black uppercase tracking-wider bg-accent text-accent-foreground border-accent text-base hover:bg-foreground hover:text-background hover:border-foreground",
  final:
    "inline-block brutal-border border-background bg-background text-foreground px-10 py-5 font-black uppercase tracking-wider text-lg hover:bg-accent hover:text-accent-foreground hover:border-accent",
  inline:
    "inline underline text-foreground font-bold hover:text-accent bg-transparent border-0 p-0 normal-case tracking-normal text-inherit cursor-pointer",
};

type BetaCtaButtonProps = {
  variant?: BetaCtaVariant;
  className?: string;
};

export function BetaCtaButton({ variant = "hero", className }: BetaCtaButtonProps) {
  const navigate = useNavigate();
  const invalidateBeta = useInvalidateBetaProgram();
  const { data: status, isLoading } = useBetaProgram();

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const betaFull = status?.betaFull ?? false;
  const spotsLeft = status?.spotsLeft ?? null;
  const label = isLoading
    ? "Chargement…"
    : betaFull
      ? "Rejoindre la liste d'attente"
      : "Devenir bêta-testeur";

  const resetWaitlistForm = () => {
    setFullName("");
    setEmail("");
    setDone(false);
    setBusy(false);
  };

  const handleClick = () => {
    if (betaFull) {
      resetWaitlistForm();
      setWaitlistOpen(true);
      return;
    }
    navigate({
      to: "/auth",
      search: { mode: "signup", beta: "1" },
    });
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await registerBetaWaitlist({
        data: { email, fullName: fullName.trim() || undefined },
      });
      setDone(true);
      invalidateBeta();
      toast.success(
        result.alreadyRegistered
          ? "Tu es déjà sur la liste d'attente."
          : "Inscription à la liste d'attente confirmée.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setBusy(false);
    }
  };

  const isInline = variant === "inline";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(VARIANT_CLASSES[variant], className)}
      >
        {label}
        {!isInline && !isLoading && !betaFull && spotsLeft !== null && variant === "hero" && (
          <span className="block mt-1 text-[10px] font-mono normal-case tracking-normal opacity-80">
            {spotsLeft} place{spotsLeft > 1 ? "s" : ""} restante{spotsLeft > 1 ? "s" : ""}
          </span>
        )}
      </button>

      <Dialog
        open={waitlistOpen}
        onOpenChange={(next) => {
          setWaitlistOpen(next);
          if (!next) resetWaitlistForm();
        }}
      >
        <DialogContent className="brutal-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">Liste d'attente</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Les 10 places bêta sont prises. Laisse ton email pour être prévenu dès qu'une place se libère.
            </DialogDescription>
          </DialogHeader>

          {done ? (
            <p className="font-mono text-sm text-center py-4">
              Merci ! On te recontactera dès qu'une place se libère.
            </p>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <div>
                <label htmlFor="beta-waitlist-email" className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <Input
                  id="beta-waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                  maxLength={255}
                  className="brutal-border-thin rounded-none"
                />
              </div>
              <div>
                <label htmlFor="beta-waitlist-name" className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Nom <span className="font-normal normal-case text-muted-foreground">(optionnel)</span>
                </label>
                <Input
                  id="beta-waitlist-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prénom Nom"
                  maxLength={120}
                  className="brutal-border-thin rounded-none"
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full sm:w-auto brutal-border rounded-none font-black uppercase tracking-wider"
                >
                  {busy ? "Envoi…" : "Rejoindre la liste d'attente"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
