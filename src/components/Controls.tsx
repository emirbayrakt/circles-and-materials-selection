import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CircleT } from "../types";
import CirclesList from "./CirclesList";

interface Props {
  radius: number;
  containerRef: RefObject<HTMLDivElement | null>;
  circles: CircleT[];
  onAdd: (x?: number, y?: number) => void;
  clampXY: (x: number, y: number) => { x: number; y: number };
  onCircleUpdate: (id: string, x: number, y: number) => void;
  onCircleDelete: (id: string) => void;
  canvasHeight: number;
  canvasWidth: number;
  draggedId?: string | null;
  padding?: number;
}

export default function Controls({
  radius,
  containerRef,
  circles,
  onAdd,
  clampXY,
  onCircleUpdate,
  onCircleDelete,
  canvasHeight,
  canvasWidth,
  draggedId,
  padding = 40,
}: Props) {
  const [x, setX] = useState<string>("");
  const [y, setY] = useState<string>("");

  // Reset inputs when circles array changes (e.g., after adding)
  useEffect(() => {
    setX("");
    setY("");
  }, [circles.length]);

  const num = (v: string) => (v === "" ? NaN : Number(v));
  const min = padding;
  const maxX = canvasWidth - padding;
  const maxY = canvasHeight - padding;

  const handle =
    (setter: Dispatch<SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value.replace(/\D/g, ""));

  const add = () => {
    let px = num(x);
    let py = num(y);
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    // If either is empty, use center (within bounding box)
    if (!Number.isFinite(px)) px = box.width / 2;
    if (!Number.isFinite(py)) py = box.height / 2;
    // Clamp to allowed area
    const { x: clampedX, y: clampedY } = clampXY(px, py);
    onAdd(clampedX, clampedY);
  };

  return (
    <div className="flex flex-col gap-6   text-neutral-900">
      {circles.length === 0 ? (
        <>
          <div className="font-semibold mb-2 text-2xl 3xl:pr-10 ">
            <span className=" text-neutral-900">Circles.</span>
            <span className="ml-2 text-[#86868b]">
              How many circles do you need to have on your wall?
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm caption">X (px)</span>
              <input
                value={x}
                onChange={handle(setX)}
                min={min}
                max={maxX}
                type="number"
                className="px-3 py-2 bg-neutral-100 rounded-xl outline-none focus:ring-2 ring-neutral-300 font-mono text-base min-h-[44px]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm caption">Y (px)</span>
              <input
                value={y}
                onChange={handle(setY)}
                min={min}
                max={maxY}
                type="number"
                className="px-3 py-2 bg-neutral-100 rounded-xl outline-none focus:ring-2 ring-neutral-300 font-mono text-base min-h-[44px]"
              />
            </label>
          </div>
          <button
            onClick={add}
            className="w-full py-3 rounded-xl mt-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 will-change-transform font-medium text-base"
          >
            Add Circle
          </button>
        </>
      ) : (
        <>
          <CirclesList
            circles={circles}
            selectedId={undefined}
            onUpdate={(id, x, y) => {
              // Clamp before updating
              const clampedX = Math.min(Math.max(x, min), maxX);
              const clampedY = Math.min(Math.max(y, min), maxY);
              onCircleUpdate(id, clampedX, clampedY);
            }}
            onDelete={onCircleDelete}
            canvasHeight={canvasHeight}
            draggedId={draggedId}
            padding={padding}
            radius={radius}
            canvasWidth={canvasWidth}
          />
          <button
            onClick={() => onAdd()}
            className="w-full py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_0_20px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 will-change-transform font-medium text-base"
            disabled={circles.length >= 4}
          >
            Add New Circle
          </button>
          {circles.length >= 4 && (
            <div className="text-red-500 text-sm mt-1 text-center caption">
              Maximum of 4 circles allowed.
            </div>
          )}
        </>
      )}
    </div>
  );
}
