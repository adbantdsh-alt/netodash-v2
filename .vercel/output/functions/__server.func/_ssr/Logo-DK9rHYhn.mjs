import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
const SRC = {
  dropshipping: "/netodash-logo-blue.png",
  cod: "/netodash-logo.png"
};
function readDocMode() {
  if (typeof document === "undefined") return "cod";
  const v = document.documentElement.getAttribute("data-mode");
  return v === "dropshipping" ? "dropshipping" : "cod";
}
function Logo({
  mode,
  className = "h-7 md:h-9 w-auto object-contain shrink-0",
  alt = "NETODASH",
  priority = false
}) {
  const [docMode, setDocMode] = reactExports.useState(() => mode ?? readDocMode());
  reactExports.useEffect(() => {
    if (mode) return;
    const update = () => setDocMode(readDocMode());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"]
    });
    return () => observer.disconnect();
  }, [mode]);
  const src = SRC[mode ?? docMode];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src,
      alt,
      width: 1650,
      height: 297,
      fetchPriority: priority ? "high" : "auto",
      decoding: "async",
      className
    }
  );
}
export {
  Logo as L
};
