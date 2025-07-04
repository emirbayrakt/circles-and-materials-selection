import React from "react";

interface ForbiddenAreaOverlayProps {
  bounds: { left: number; top: number; right: number; bottom: number };
  draggedPos: { x: number; y: number } | null;
  canvasSize: { width: number; height: number };
}

const ForbiddenAreaOverlay: React.FC<ForbiddenAreaOverlayProps> = ({
  bounds,
  draggedPos,
  canvasSize,
}) => {
  if (!draggedPos) return null;
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none transition-opacity duration-200"
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ zIndex: 99, opacity: draggedPos ? 1 : 0 }}
    >
      {/* Top forbidden area */}
      <rect
        x={0}
        y={0}
        width={canvasSize.width}
        height={bounds.top}
        fill="#fff"
        fillOpacity={0.32}
        style={{ transition: "fill-opacity 0.2s" }}
      />
      {/* Bottom forbidden area */}
      <rect
        x={0}
        y={bounds.bottom}
        width={canvasSize.width}
        height={canvasSize.height - bounds.bottom}
        fill="#fff"
        fillOpacity={0.32}
        style={{ transition: "fill-opacity 0.2s" }}
      />
      {/* Left forbidden area */}
      <rect
        x={0}
        y={bounds.top}
        width={bounds.left}
        height={bounds.bottom - bounds.top}
        fill="#fff"
        fillOpacity={0.32}
        style={{ transition: "fill-opacity 0.2s" }}
      />
      {/* Right forbidden area */}
      <rect
        x={bounds.right}
        y={bounds.top}
        width={canvasSize.width - bounds.right}
        height={bounds.bottom - bounds.top}
        fill="#fff"
        fillOpacity={0.32}
        style={{ transition: "fill-opacity 0.2s" }}
      />
    </svg>
  );
};

export default ForbiddenAreaOverlay;
