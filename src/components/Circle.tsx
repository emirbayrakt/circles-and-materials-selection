import React, { useRef, useState } from "react";

interface Props {
  id: string;
  x: number;
  y: number;
  r: number;
  onDrag: (id: string, x: number, y: number) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  dragConstraints?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null;
  onDragStart?: (id: string, x: number, y: number) => void;
  onDragEnd?: () => void;
  onDragMove?: (x: number, y: number) => void;
  label?: string | number;
}

export default function Circle({
  id,
  x,
  y,
  r,
  onDrag,
  selected,
  onSelect,
  dragConstraints,
  onDragStart,
  onDragEnd,
  onDragMove,
  label,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragging(true);
    onDragStart?.(id, x, y);
    const pointerX = e.clientX;
    const pointerY = e.clientY;
    offset.current = {
      x: pointerX - x,
      y: pointerY - y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    if (dragConstraints) {
      newX = Math.max(
        dragConstraints.left + r,
        Math.min(newX, dragConstraints.right - r),
      );
      newY = Math.max(
        dragConstraints.top + r,
        Math.min(newY, dragConstraints.bottom - r),
      );
    }
    onDrag(id, newX, newY);
    onDragMove?.(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    onDragEnd?.();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      style={{
        width: r * 2,
        height: r * 2,
        position: "absolute",
        left: x - r,
        top: y - r,
        boxShadow: selected
          ? "0 0 0 6px #3b82f633, 0 8px 32px 0 #3b82f622"
          : "0 2px 12px 0 rgba(0,0,0,0.08)",
        borderWidth: selected ? 4 : 1,
        borderColor: selected ? "#3b82f6" : "#fff",
        zIndex: selected ? 10 : 1,
        background: "rgba(255,255,255,0.8)",
        borderRadius: "50%",
        backdropFilter: "blur(8px)",
        borderStyle: "solid",
        cursor: dragging ? "grabbing" : "grab",
        transition:
          "box-shadow 0.2s, border-width 0.2s, border-color 0.2s, z-index 0.2s",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 18,
        color: "#222",
        textShadow: "0 1px 4px #fff, 0 0px 2px #fff",
      }}
      className="transition-all duration-200"
    >
      {label}
    </div>
  );
}
