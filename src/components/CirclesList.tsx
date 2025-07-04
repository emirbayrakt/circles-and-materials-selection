import React from "react";
import { CircleT } from "../types";
import { FiTrash } from "react-icons/fi";

interface CirclesListProps {
  circles: CircleT[];
  selectedId?: string | null;
  onUpdate: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  canvasHeight: number;
  draggedId?: string | null;
  padding: number;
  radius: number;
  canvasWidth: number;
}

export default function CirclesList({
  circles,
  selectedId,
  onUpdate,
  onDelete,
  canvasHeight,
  draggedId,
  padding,
  radius,
  canvasWidth,
}: CirclesListProps) {
  const min = padding;
  const maxX = canvasWidth - padding;
  const maxY = canvasHeight - padding;
  return (
    <div className="flex flex-col gap-4   text-neutral-900">
      <div className="font-semibold mb-2 text-2xl 3xl:pr-10 ">
        <span className=" text-neutral-900">Circles.</span>
        <span className="ml-2 text-[#86868b]">
          You can easily update all of your circles here.
        </span>
      </div>
      {circles.length === 0 && (
        <div className="text-sm text-neutral-400 caption">
          No circles added.
        </div>
      )}
      {circles.map((circle, idx) => (
        <div
          key={circle.id}
          className={`flex items-center gap-2 p-3 rounded-xl transition-shadow duration-200 shadow-[0_0_12px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-md will-change-transform ${
            draggedId === circle.id ? "ring-2 ring-neutral-300" : ""
          }`}
        >
          <span className="font-bold px-2 py-1 rounded-xl bg-neutral-100 text-neutral-700 text-base">
            Circle {idx + 1}
          </span>
          <label className="flex items-center gap-1 text-xs caption">
            X:
            <input
              type="number"
              className="w-16 px-2 py-1 rounded-xl border border-neutral-200 text-xs font-mono bg-neutral-50 focus:ring-2 focus:ring-neutral-300 outline-none transition-shadow"
              value={Math.round(circle.xPx)}
              min={min}
              max={maxX}
              onChange={(e) => {
                const val = Math.min(
                  Math.max(Number(e.target.value), min),
                  maxX,
                );
                onUpdate(circle.id, val, circle.yPx);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
          <label className="flex items-center gap-1 text-xs caption">
            Y:
            <input
              type="number"
              className="w-16 px-2 py-1 rounded-xl border border-neutral-200 text-xs font-mono bg-neutral-50 focus:ring-2 focus:ring-neutral-300 outline-none transition-shadow"
              value={canvasHeight ? Math.round(canvasHeight - circle.yPx) : 0}
              min={min}
              max={maxY}
              onChange={(e) => {
                const val = Math.min(
                  Math.max(Number(e.target.value), min),
                  maxY,
                );
                onUpdate(circle.id, circle.xPx, canvasHeight - val);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
          <button
            className="ml-auto text-red-500  text-xs font-medium transition-transform duration-200 hover:scale-105 active:scale-95 will-change-transform"
            onClick={() => onDelete(circle.id)}
            tabIndex={0}
            aria-label="Delete circle"
          >
            <FiTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
