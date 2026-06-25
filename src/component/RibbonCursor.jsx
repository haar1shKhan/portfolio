import { useRibbonCursor } from "../hooks/useRibbonCursor";

export function RibbonCursor({ isActive }) {
  const canvasRef = useRibbonCursor(isActive);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}