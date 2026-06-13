import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { createUnitechCheckout, getPaymentStatus } from "@/lib/payments.functions";
import { supabase } from "@/integrations/supabase/client";
import waveLogo from "@/assets/pay-wave.png";
import orangeMoneyLogo from "@/assets/pay-orange-money.png";
import maxitLogo from "@/assets/pay-maxit.png";
import orangeQrLogo from "@/assets/pay-orange-qr.png";

type Plan = "basic" | "starter" | "pro";
type Method = "wave" | "orange_qr" | "orange_maxit" | "orange_om";

const PRICES: Record<Plan, { usd: string; label: string }> = {
  basic: { usd: "5", label: "Basic" },
  starter: { usd: "17", label: "Pro" },
  pro: { usd: "27", label: "Premium" },
};

const METHODS: { id: Method; label: string; needsPhone: boolean; logo: string }[] = [
  { id: "wave", label: "Wave", needsPhone: true, logo: waveLogo },
  { id: "orange_om", label: "Orange Money", needsPhone: true, logo: orangeMoneyLogo },
  { id: "orange_maxit", label: "Max it", needsPhone: true, logo: maxitLogo },
  { id: "orange_qr", label: "Orange QR", needsPhone: false, logo: orangeQrLogo },
];

export function MobileMoneyCheckout({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const checkout = useServerFn(createUnitechCheckout);
  const checkStatus = useServerFn(getPaymentStatus);
  const [method, setMethod] = useState<Method>("wave");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "paid" | "failed">("idle");

  const price = PRICES[plan];
  const selectedMethod = METHODS.find((m) => m.id === method)!;

  // Polling du statut tant que le paiement est pending — confirmation auto.
  useEffect(() => {
    if (!reference || paymentStatus !== "pending") return;
    let alive = true;
    const tick = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const result = (await checkStatus({
          data: { reference },
          headers: { Authorization: `Bearer ${session.access_token}` },
        })) as { status?: string };
        if (!alive) return;
        if (result?.status === "paid") {
          setPaymentStatus("paid");
          toast.success("Paiement confirmé ! Ton accès est activé.");
          setTimeout(() => onClose(), 1500);
        } else if (result?.status === "failed") {
          setPaymentStatus("failed");
          toast.error("Le paiement a échoué. Réessaie ou choisis une autre méthode.");
        }
      } catch {
        // ignore transient errors during polling
      }
    };
    const id = setInterval(tick, 4000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [reference, paymentStatus, checkStatus, onClose]);

  const handlePay = async () => {
    if (selectedMethod.needsPhone) {
      const cleaned = phone.replace(/\s+/g, "");
      if (!/^[0-9]{9,15}$/.test(cleaned)) {
        toast.error("Numéro invalide. Format: 771234567");
        return;
      }
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Session expirée. Reconnecte-toi.");
        setLoading(false);
        return;
      }
      const result = await checkout({
        data: {
          plan,
          method,
          customerNumber: selectedMethod.needsPhone ? phone.replace(/\s+/g, "") : undefined,
          origin: window.location.origin,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      setReference(result.reference);
      setPaymentStatus("pending");
      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        // Open Wave / Orange Money payment page in new tab
        window.open(result.paymentUrl, "_blank");
        toast.success("Page de paiement ouverte. Termine l'opération sur Wave/Orange Money.");
      } else if (result.qrCode) {
        setQrCode(result.qrCode);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erreur lors de la création du paiement.");
    } finally {
      setLoading(false);
    }
  };

  // Badge de statut réutilisable
  const StatusBadge = () => {
    if (paymentStatus === "paid") {
      return (
        <div className="brutal-border-thin bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-2 text-xs font-bold uppercase tracking-wider mb-3">
          ✓ Paiement confirmé — accès activé
        </div>
      );
    }
    if (paymentStatus === "failed") {
      return (
        <div className="brutal-border-thin bg-destructive/10 text-destructive px-3 py-2 text-xs font-bold uppercase tracking-wider mb-3">
          ✗ Paiement échoué — réessaie
        </div>
      );
    }
    return (
      <div className="brutal-border-thin bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-2 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        En attente du paiement…
      </div>
    );
  };

  if (qrCode) {
    return (
      <div className="brutal-border bg-background p-6 max-w-md w-full">
        <h3 className="text-2xl font-black mb-2">Scanne le QR Code</h3>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          Référence : {reference}
        </p>
        <StatusBadge />
        <img src={qrCode} alt="QR Code Orange Money" className="w-full brutal-border-thin" />
        <p className="font-mono text-xs text-muted-foreground mt-4">
          Ouvre Orange Money, scanne ce QR et valide. Ton accès s'activera
          automatiquement à la confirmation. Cette page se met à jour toute seule.
        </p>
        <button
          onClick={onClose}
          disabled={paymentStatus === "pending"}
          className="mt-4 w-full brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentStatus === "pending" ? "Paiement en cours…" : "Fermer"}
        </button>
      </div>
    );
  }

  // Écran "pending" pour Wave / Orange Money via URL — bloque tant que pas payé.
  if (paymentStatus === "pending" && paymentUrl) {
    return (
      <div className="brutal-border bg-background p-6 max-w-md w-full">
        <h3 className="text-2xl font-black mb-2">Paiement en cours</h3>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          Référence : {reference}
        </p>
        <StatusBadge />
        <p className="text-sm mb-4">
          Termine ton paiement de{" "}
          <strong>${price.usd}</strong> sur{" "}
          <strong>{selectedMethod.label}</strong>. Ton accès <strong>{price.label}</strong>{" "}
          s'activera automatiquement dès la confirmation.
        </p>
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full brutal-border bg-accent text-accent-foreground border-accent px-5 py-3 font-bold uppercase tracking-wider text-center hover:opacity-90 mb-2"
        >
          Rouvrir la page de paiement
        </a>
        <p className="font-mono text-[11px] text-muted-foreground mt-3 leading-relaxed">
          ⏳ Cette fenêtre se met à jour toute seule. Tu dois finir ce paiement
          avant de pouvoir en lancer un autre.
        </p>
        <button
          onClick={onClose}
          disabled={paymentStatus === "pending"}
          className="mt-3 w-full brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-sm hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Paiement en cours…
        </button>
      </div>
    );
  }

  if (paymentStatus === "paid") {
    return (
      <div className="brutal-border bg-background p-6 max-w-md w-full text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-2xl font-black mb-2">Paiement confirmé</h3>
        <p className="text-sm text-muted-foreground">
          Ton accès <strong>{price.label}</strong> est activé.
        </p>
      </div>
    );
  }

  return (
    <div className="brutal-border bg-background p-6 max-w-md w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            PAIEMENT MOBILE MONEY
          </div>
          <h3 className="text-2xl font-black tracking-tight">Plan {price.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xl font-black"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <div className="brutal-border-thin p-4 mb-5 bg-accent/5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
          MONTANT
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black tracking-tighter">
            ${price.usd}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/ 30 jours</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest font-bold mb-2">
          MÉTHODE DE PAIEMENT
        </div>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`brutal-border-thin p-3 flex flex-col items-center justify-center gap-2 transition-all ${
                method === m.id
                  ? "bg-foreground border-foreground ring-2 ring-accent"
                  : "bg-background hover:bg-muted"
              }`}
            >
              <img
                src={m.logo}
                alt={m.label}
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12 object-contain rounded-lg"
              />
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  method === m.id ? "text-background" : "text-foreground"
                }`}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedMethod.needsPhone && (
        <div className="mb-4">
          <label className="text-xs uppercase tracking-widest font-bold block mb-2">
            NUMÉRO {selectedMethod.label}
          </label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="771234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full brutal-border-thin px-3 py-2 font-mono text-sm bg-background"
          />
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full brutal-border bg-accent text-accent-foreground border-accent px-5 py-3 font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Création..." : `Payer $${price.usd}`}
      </button>

      <p className="font-mono text-[11px] text-muted-foreground mt-3 leading-relaxed">
        🔒 Paiement sécurisé. Ton abonnement sera activé automatiquement dès que
        le paiement est confirmé.
      </p>
    </div>
  );
}
