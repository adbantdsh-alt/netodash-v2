import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Clock, Send } from "lucide-react";
import { submitContactMessage } from "@/lib/contact.functions";

const CONTACT_URL = "https://netodash.com/contact";
const CONTACT_TITLE = "Contact — NETODASH | Support Dropshipping & COD";
const CONTACT_DESC =
  "Une question, un retour, un partenariat ? Contacte l'équipe NETODASH par email, WhatsApp ou via le formulaire.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: CONTACT_TITLE },
      { name: "description", content: CONTACT_DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: CONTACT_TITLE },
      { property: "og:description", content: CONTACT_DESC },
      { property: "og:url", content: CONTACT_URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: CONTACT_TITLE },
      { name: "twitter:description", content: CONTACT_DESC },
    ],
    links: [{ rel: "canonical", href: CONTACT_URL }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "err">(null);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setErrMsg("");
    try {
      await submitContactMessage({ data: { name, email, subject, message } });
      setStatus("ok");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setStatus("err");
      setErrMsg(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background brutal-border-thin border-t-0 border-l-0 border-r-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <img src="/netodash-logo.png" alt="NETODASH" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
            <span className="font-black text-lg md:text-2xl tracking-tight">NETODASH</span>
          </Link>
          <Link to="/" className="brutal-border-thin px-4 py-2 font-bold uppercase tracking-wider text-xs md:text-sm">
            ← Accueil
          </Link>
        </div>
      </header>

      <section className="brutal-grid">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="inline-block brutal-border-thin px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest mb-4">
            Contact
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            PARLONS<span className="text-accent">.</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg max-w-2xl text-muted-foreground leading-relaxed">
            Une question sur ton COD, un bug, une suggestion, un partenariat affilié ? On répond sous 24 h ouvrées.
          </p>
        </div>
      </section>

      <section className="brutal-border-thin border-l-0 border-r-0 border-b-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16 grid lg:grid-cols-5 gap-8">
          {/* Coordonnées */}
          <div className="lg:col-span-2 space-y-5">
            <a
              href="mailto:support@netodash.com"
              className="block brutal-border-thin p-6 hover:bg-foreground hover:text-background transition-colors"
            >
              <Mail className="w-7 h-7 mb-3" strokeWidth={2.5} />
              <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Email</div>
              <div className="font-black text-lg break-all">support@netodash.com</div>
              <div className="text-xs mt-2 opacity-70">Réponse sous 24 h ouvrées</div>
            </a>

            <a
              href="https://wa.me/221000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="block brutal-border-thin p-6 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
            >
              <MessageCircle className="w-7 h-7 mb-3" strokeWidth={2.5} />
              <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">WhatsApp</div>
              <div className="font-black text-lg">Support direct</div>
              <div className="text-xs mt-2 opacity-70">Pour les urgences plan Pro</div>
            </a>

            <div className="brutal-border-thin p-6 bg-muted/30">
              <Clock className="w-7 h-7 mb-3" strokeWidth={2.5} />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Disponibilité</div>
              <div className="font-black text-lg">Lun – Ven · 9 h – 19 h GMT</div>
              <div className="text-xs mt-2 text-muted-foreground">Le week-end : email uniquement</div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="brutal-border p-6 md:p-8 space-y-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter">
                ENVOIE-NOUS UN MESSAGE
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-widest font-bold mb-2">
                    Nom complet *
                  </label>
                  <input
                    id="name" type="text" required maxLength={100}
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold mb-2">
                    Email *
                  </label>
                  <input
                    id="email" type="email" required maxLength={255}
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-[10px] uppercase tracking-widest font-bold mb-2">
                  Sujet *
                </label>
                <input
                  id="subject" type="text" required maxLength={200}
                  value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] uppercase tracking-widest font-bold mb-2">
                  Message * <span className="text-muted-foreground font-normal normal-case tracking-normal">(min. 10 caractères)</span>
                </label>
                <textarea
                  id="message" required maxLength={2000} rows={6}
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full brutal-border-thin bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-accent resize-y"
                />
                <div className="text-[10px] text-muted-foreground mt-1 text-right font-mono">
                  {message.length} / 2000
                </div>
              </div>

              {status === "ok" && (
                <div className="brutal-border-thin border-accent bg-accent/10 p-4 font-mono text-sm">
                  ✓ Message envoyé. On revient vers toi sous 24 h ouvrées.
                </div>
              )}
              {status === "err" && (
                <div className="brutal-border-thin border-destructive bg-destructive/10 p-4 font-mono text-sm">
                  ✕ {errMsg || "Une erreur est survenue. Réessaie."}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="brutal-border bg-accent text-accent-foreground border-accent px-6 py-3 font-black uppercase tracking-wider text-sm inline-flex items-center gap-2 hover:bg-foreground hover:border-foreground disabled:opacity-50"
              >
                {submitting ? "Envoi…" : (<>Envoyer <Send className="w-4 h-4" /></>)}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="brutal-border-thin border-l-0 border-r-0 border-b-0 mt-10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} NETODASH · Made for Africa.
          </div>
          <Link to="/" className="font-mono text-xs uppercase tracking-widest hover:text-accent">
            ← Retour à l'accueil
          </Link>
        </div>
      </footer>
    </div>
  );
}
