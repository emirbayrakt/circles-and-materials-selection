import { forwardRef, useEffect, useState } from "react";
import Circle from "./Circle";
import { CircleT } from "../types";
import useEmblaCarousel from "embla-carousel-react";
import { FaRegHandPointer } from "react-icons/fa";
import ForbiddenAreaOverlay from "./ForbiddenAreaOverlay";
import DimensionArrows from "./DimensionArrows";

interface Props {
  materials: { name: string; image: string }[];
  selectedMaterial: string;
  onMaterialChange: (name: string) => void;
  circles: CircleT[];
  radius: number;
  onDrag: (id: string, x: number, y: number) => void;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  padding?: number;
  draggedId?: string | null;
  setDraggedId?: (id: string | null) => void;
}

const ImageCanvas = forwardRef<HTMLDivElement, Props>(
  (
    {
      materials,
      selectedMaterial,
      onMaterialChange,
      circles,
      radius,
      onDrag,
      selectedId,
      onSelect,
      padding = 40,
      draggedId,
      setDraggedId,
    },
    ref,
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const indexByName = materials.findIndex((m) => m.name === selectedMaterial);
    // Sync carousel to selected material
    useEffect(() => {
      if (emblaApi && indexByName >= 0) {
        emblaApi.scrollTo(indexByName);
      }
    }, [emblaApi, indexByName]);
    // Sync selected material to carousel
    useEffect(() => {
      if (!emblaApi) return;
      const onSelect = () => {
        const idx = emblaApi.selectedScrollSnap();
        if (materials[idx] && materials[idx].name !== selectedMaterial) {
          onMaterialChange(materials[idx].name);
        }
      };
      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, materials, selectedMaterial, onMaterialChange]);

    const [bounds, setBounds] = useState<{
      left: number;
      top: number;
      right: number;
      bottom: number;
    } | null>(null);
    const [draggedPos, setDraggedPos] = useState<{
      x: number;
      y: number;
    } | null>(null);
    useEffect(() => {
      if (
        !ref ||
        typeof ref !== "object" ||
        !("current" in ref) ||
        !ref.current
      )
        return;
      const updateBounds = () => {
        const box = ref.current!.getBoundingClientRect();
        setBounds({
          left: padding,
          top: padding,
          right: box.width - padding,
          bottom: box.height - padding,
        });
      };
      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }, [ref, padding, radius]);

    // Get canvas size for arrows
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
      if (
        !ref ||
        typeof ref !== "object" ||
        !("current" in ref) ||
        !ref.current
      )
        return;
      const updateSize = () => {
        const box = ref.current!.getBoundingClientRect();
        setCanvasSize({ width: box.width, height: box.height });
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, [ref]);

    // Find the dragged circle's position for arrows
    const draggedCircle = draggedId
      ? circles.find((c) => c.id === draggedId)
      : null;
    useEffect(() => {
      if (draggedCircle)
        setDraggedPos({ x: draggedCircle.xPx, y: draggedCircle.yPx });
      else setDraggedPos(null);
    }, [draggedCircle?.xPx, draggedCircle?.yPx, draggedId]);

    return (
      <div className="mt-8 lg:mb-8 p-4 sm:p-8 flex flex-col col-span-12 lg:col-span-8 2xl:col-span-9  align-middle items-center justify-center bg-neutral-200 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div
          ref={ref}
          className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.05)] bg-neutral-200 h-[200px] sm:h-[300px] lg:h-[400px] select-none  "
          onClick={() => onSelect?.(null)}
          style={{ cursor: "pointer" }}
        >
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full overflow-hidden"
              ref={emblaRef}
              style={{ pointerEvents: draggedId ? "none" : "auto" }}
            >
              <div className="flex h-full">
                {materials.map((mat) => (
                  <div key={mat.name} className="flex-[0_0_100%] h-full">
                    <img
                      src={mat.image}
                      alt={mat.name}
                      className="w-full h-full object-cover transition-all duration-500"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bounding region overlay while dragging */}
          {draggedPos && bounds && (
            <ForbiddenAreaOverlay
              bounds={bounds}
              draggedPos={draggedPos}
              canvasSize={canvasSize}
            />
          )}

          {/* Dimension arrows while dragging */}
          {draggedPos && (
            <DimensionArrows draggedPos={draggedPos} canvasSize={canvasSize} />
          )}

          {circles.map((c, idx) => (
            <Circle
              key={c.id}
              id={c.id}
              x={c.xPx}
              y={c.yPx}
              r={radius}
              onDrag={onDrag}
              selected={selectedId === c.id}
              onSelect={onSelect}
              dragConstraints={bounds}
              onDragStart={(id, x, y) => setDraggedId?.(id)}
              onDragEnd={() => setDraggedId?.(null)}
              onDragMove={() => {
                // No need to update draggedPos here, handled by effect
              }}
              label={idx + 1}
            />
          ))}
        </div>
        {/* Swipe note below the image carousel */}
        <div className="hidden w-full lg:flex items-center justify-center mt-4">
          <div className="flex items-center gap-2 bg-neutral-100/80 text-neutral-500 rounded-xl px-4 mt-8 py-2 text-base shadow-sm">
            <FaRegHandPointer className="text-lg opacity-70" />
            <span>Swipe background to change material</span>
          </div>
        </div>
      </div>
    );
  },
);
export default ImageCanvas;
