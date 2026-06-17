/* Netodash — popup logic v1.5.2. No deps except html2canvas. MV3-safe. */
const EXT_VERSION = "1.5.2";
const TRACK_URL = "https://app.netodash.com/api/public/extension-track";

async function getClientId() {
  return new Promise((resolve) => {
    try {
      chrome.storage?.local.get("netodash_client_id", ({ netodash_client_id }) => {
        if (netodash_client_id) {
          resolve(netodash_client_id);
          return;
        }
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `nd-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        chrome.storage?.local.set({ netodash_client_id: id }, () => resolve(id));
      });
    } catch {
      resolve(`nd-${Date.now()}`);
    }
  });
}

function trackExtension(event) {
  void (async () => {
    try {
      const clientId = await getClientId();
      await fetch(TRACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, event, version: EXT_VERSION }),
        keepalive: true,
      });
    } catch {
      /* silencieux */
    }
  })();
}

const $ = (id) => document.getElementById(id);
const FIELDS = ["revenue","adSpend","adTax","sellUnit","cogsUnit","orders","refOrders","refAmount","giftCost","giftOrders","feePct","feeFixed"];
const SYMBOLS = { EUR:"€", USD:"$", GBP:"£", XOF:"F" };

const FX_TO_EUR = { EUR:1, USD:0.92, GBP:1.17, XOF:0.001524 };
const convert = (amount, from, to) => {
  if (from === to) return amount;
  const inEur = amount * FX_TO_EUR[from];
  return inEur / FX_TO_EUR[to];
};

let currency = "EUR";
let adCcy   = "EUR";
let cogsCcy = "EUR";

const fmt = (n, ccy) => {
  const c = ccy || currency;
  if (!isFinite(n)) n = 0;
  const sign = n < 0 ? "− " : "";
  const abs = Math.abs(n);
  const v = abs >= 1000 ? Math.round(abs).toLocaleString("fr-FR") : abs.toFixed(2);
  return sign + (c === "XOF" ? v + " F" : SYMBOLS[c] + v);
};
const num = (id) => {
  const v = parseFloat($(id).value);
  return isFinite(v) && v >= 0 ? v : 0;
};

function setActive(container, value) {
  container.querySelectorAll("button").forEach(b =>
    b.classList.toggle("on", b.dataset.c === value)
  );
}

function compute() {
  const revenue   = num("revenue");
  const adRaw     = num("adSpend");
  const adSpend   = convert(adRaw, adCcy, currency);
  const adTaxPct  = num("adTax");
  const sellUnit  = num("sellUnit");
  const cogsRaw   = num("cogsUnit");
  const cogsUnit  = convert(cogsRaw, cogsCcy, currency);
  const orders    = num("orders");
  const refOrders = num("refOrders");
  const refAmount = num("refAmount");
  const giftCost   = num("giftCost");
  const giftOrders = num("giftOrders");
  const auto      = $("autoFees").checked;
  const feePct    = auto ? 2.9  : num("feePct");
  const feeFixed  = auto ? 0.30 : num("feeFixed");

  const cogs        = cogsUnit * orders;
  const cogsPct     = revenue > 0 ? (cogs / revenue) * 100 : 0;
  const adTax       = (adSpend * adTaxPct) / 100;
  const adTotal     = adSpend + adTax;
  const shopifyFees = revenue * (feePct / 100) + orders * feeFixed;
  const giftTotal   = giftCost * giftOrders;

  // Profit net = CA − (Budget pub + Taxe pub) − COGS − Frais Shopify − Remboursements − Produits offerts
  const profit      = revenue - adTotal - cogs - shopifyFees - refAmount - giftTotal;

  // ROAS net = CA / (Budget pub + Taxe pub)
  const roasNet  = adTotal > 0 ? revenue / adTotal : 0;
  const margin   = revenue > 0 ? (profit / revenue) * 100 : 0;
  const cpa      = orders  > 0 ? adSpend / orders : 0;
  const aov      = orders  > 0 ? revenue / orders : 0;
  const refundRate = orders > 0 ? (refOrders / orders) * 100 : 0;
  const profitPerOrder = orders > 0 ? profit / orders : 0;

  // Break-even ROAS basé sur marge produit unitaire (taxe pub incluse)
  const perOrderFees  = feeFixed + (sellUnit * feePct / 100);
  const contribUnit   = sellUnit - cogsUnit - perOrderFees;
  const beRoas = contribUnit > 0
    ? (sellUnit / contribUnit) * (1 + adTaxPct / 100)
    : 0;

  const marginProd = sellUnit - cogsUnit;
  const marginProdPct = sellUnit > 0 ? (marginProd / sellUnit) * 100 : 0;

  $("adHint").textContent = adCcy === currency
    ? `Budget en ${adCcy}`
    : `${fmt(adRaw, adCcy)} ${adCcy} ≈ ${fmt(adSpend, currency)} ${currency}`;
  const cogsConvNote = cogsCcy !== currency && cogsRaw > 0
    ? ` · ${fmt(cogsRaw, cogsCcy)} → ${fmt(cogsUnit, currency)}/u`
    : "";
  $("cogsHint").textContent = orders > 0
    ? `= ${fmt(cogs)} total (${cogsPct.toFixed(1)}% du CA)${cogsConvNote}`
    : `Renseigne le nb de commandes${cogsConvNote}`;
  $("sellHint").textContent = sellUnit > 0 && cogsUnit > 0
    ? `Marge/produit : ${fmt(marginProd)} (${marginProdPct.toFixed(1)}%)`
    : `Prix client unitaire`;

  $("kProfit").textContent         = fmt(profit);
  $("kProfitPerOrder").textContent = orders > 0 ? fmt(profitPerOrder) : "—";
  $("kRoas").textContent           = adTotal > 0 ? roasNet.toFixed(2) + "x" : "—";
  $("kMargin").textContent         = margin.toFixed(1) + "%";
  $("kCpa").textContent            = orders > 0 ? fmt(cpa) : "—";
  $("kAov").textContent            = orders > 0 ? fmt(aov) : "—";
  $("kBe").textContent             = beRoas > 0 ? beRoas.toFixed(2) + "x" : "—";
  $("kRef").textContent            = refundRate.toFixed(1) + "%";

  $("bRev").textContent     = fmt(revenue);
  $("bRefund").textContent  = "− " + fmt(refAmount);
  $("bCogs").textContent    = "− " + fmt(cogs);
  $("bCogsPct").textContent = cogsPct.toFixed(1) + "%";
  $("bAd").textContent      = "− " + fmt(adTotal);
  $("bAdTax").textContent   = fmt(adTax);
  $("bFees").textContent    = "− " + fmt(shopifyFees);
  if (giftTotal > 0) {
    $("bGiftLine").style.display = "flex";
    $("bGift").textContent = "− " + fmt(giftTotal);
    $("bGiftQty").textContent = giftOrders + " × " + fmt(giftCost);
  } else {
    $("bGiftLine").style.display = "none";
  }
  $("bProfit").textContent  = fmt(profit);

  const v = $("verdict");
  const t = $("verdictText");
  v.classList.remove("win","even","loss");
  const seuil = Math.max(1, revenue * 0.005);
  if (profit > seuil) { v.classList.add("win");  t.textContent = "RENTABLE · +" + fmt(profit); }
  else if (Math.abs(profit) <= seuil) { v.classList.add("even"); t.textContent = "BREAK-EVEN"; }
  else { v.classList.add("loss"); t.textContent = "PERTE DE " + fmt(Math.abs(profit)); }

  save();
}

function pulse() {
  const v = $("verdict");
  v.classList.add("pulse");
  setTimeout(() => v.classList.remove("pulse"), 180);
}

function save() {
  const state = { currency, adCcy, cogsCcy, auto: $("autoFees").checked };
  FIELDS.forEach((f) => state[f] = $(f).value);
  try { chrome.storage?.local.set({ netodash: state }); } catch {}
}

function load() {
  try {
    chrome.storage?.local.get("netodash", ({ netodash }) => {
      if (!netodash) { compute(); return; }
      currency = netodash.currency || "EUR";
      adCcy    = netodash.adCcy    || currency;
      cogsCcy  = netodash.cogsCcy  || currency;
      setActive($("ccy"),     currency);
      setActive($("adCcy"),   adCcy);
      setActive($("cogsCcy"), cogsCcy);
      $("autoFees").checked = netodash.auto !== false;
      FIELDS.forEach((f) => { if (netodash[f] !== undefined) $(f).value = netodash[f]; });
      toggleFees();
      compute();
    });
  } catch { compute(); }
}

function toggleFees() {
  const auto = $("autoFees").checked;
  $("feePct").disabled = auto;
  $("feeFixed").disabled = auto;
  if (auto) { $("feePct").value = "2.9"; $("feeFixed").value = "0.30"; }
}

async function snapshot() {
  const btn = $("snap");
  const target = $("capture");
  const brand = $("shareBrand");
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "⏳ Capture…";
  brand.style.display = "block";
  try {
    const canvas = await html2canvas(target, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0,16).replace(/[:T]/g,"-");
    a.href = url;
    a.download = `netodash-profit-${stamp}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    btn.textContent = "✅ Téléchargé";
    trackExtension("capture");
  } catch (e) {
    console.error(e);
    btn.textContent = "❌ Erreur";
  } finally {
    brand.style.display = "none";
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  FIELDS.forEach((f) => $(f).addEventListener("input", compute));
  $("autoFees").addEventListener("change", () => { toggleFees(); compute(); });

  $("ccy").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      currency = b.dataset.c;
      setActive($("ccy"), currency);
      compute();
    });
  });
  $("adCcy").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      adCcy = b.dataset.c;
      setActive($("adCcy"), adCcy);
      compute();
    });
  });
  $("cogsCcy").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      cogsCcy = b.dataset.c;
      setActive($("cogsCcy"), cogsCcy);
      compute();
    });
  });

  $("recalc").addEventListener("click", () => { compute(); pulse(); trackExtension("recalc"); });
  $("snap").addEventListener("click", snapshot);
  $("cta")?.addEventListener("click", () => trackExtension("cta_click"));

  load();
  trackExtension("open");
});
