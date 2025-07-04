import React from "react";

interface DimensionArrowsProps {
  draggedPos: { x: number; y: number };
  canvasSize: { width: number; height: number };
}

const DimensionArrows: React.FC<DimensionArrowsProps> = ({
  draggedPos,
  canvasSize,
}) => {
  if (!draggedPos) return null;
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ zIndex: 100 }}
    >
      {/* Arrow to left edge */}
      <line
        x1={draggedPos.x}
        y1={draggedPos.y}
        x2={0}
        y2={draggedPos.y}
        stroke="#fff"
        strokeWidth={2.5}
        markerEnd="url(#arrowhead)"
      />
      {/* Arrow to bottom edge */}
      <line
        x1={draggedPos.x}
        y1={draggedPos.y}
        x2={draggedPos.x}
        y2={canvasSize.height}
        stroke="#fff"
        strokeWidth={2.5}
        markerEnd="url(#arrowhead)"
      />
      {/* Arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L8,4 L0,8"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          />
        </marker>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#000"
            floodOpacity="0.7"
          />
        </filter>
      </defs>
      {/* X label */}
      <text
        x={draggedPos.x / 2}
        y={draggedPos.y - 12}
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        textAnchor="middle"
        filter="url(#shadow)"
      >
        {Math.round(draggedPos.x)} px
      </text>
      {/* Y label */}
      <text
        x={draggedPos.x + 12}
        y={draggedPos.y + (canvasSize.height - draggedPos.y) / 2}
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        textAnchor="start"
        dominantBaseline="middle"
        filter="url(#shadow)"
      >
        {Math.round(canvasSize.height - draggedPos.y)} px
      </text>
    </svg>
  );
};

export default DimensionArrows;
