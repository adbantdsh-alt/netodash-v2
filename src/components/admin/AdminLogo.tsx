export function AdminLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      className="flex items-baseline gap-0.5 select-none"
      style={{ fontWeight: 900, letterSpacing: "-0.04em", fontSize: "1.5rem" }}
    >
      <span style={{ color: inverted ? "#fff" : "#000" }}>NETODASH</span>
      <span style={{ color: "#E05C1A" }}>.</span>
    </div>
  );
}
