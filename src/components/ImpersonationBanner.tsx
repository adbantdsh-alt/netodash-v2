import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { stopImpersonation } from "@/lib/admin/users.functions";

export function ImpersonationBanner() {
  const [info, setInfo] = useState<{ admin: string; userId: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
      const admin = meta.impersonated_by as string | undefined;
      if (admin && data.user) setInfo({ admin, userId: data.user.id });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const stop = async () => {
    if (!info) return;
    setBusy(true);
    try {
      await stopImpersonation({ data: { userId: info.userId } });
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } finally {
      setBusy(false);
    }
  };

  if (!info) return null;
  return (
    <div
      style={{
        background: "#E05C1A",
        color: "#fff",
        padding: "10px 16px",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
    >
      Mode impersonation · {info.admin} agit sur ce compte ·{" "}
      <button
        disabled={busy}
        onClick={stop}
        style={{
          marginLeft: 12,
          background: "#000",
          color: "#fff",
          padding: "4px 10px",
          textTransform: "uppercase",
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: "0.08em",
        }}
      >
        Quitter
      </button>
    </div>
  );
}
