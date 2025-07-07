import { useRef, useState, useCallback, useEffect } from "react";
import ImageCanvas from "./components/ImageCanvas";
import Controls from "./components/Controls";
import MaterialsSelector from "./components/MaterialsSelector";
import wood from "./assets/wood.webp";
import metal from "./assets/metal.webp";
import brick from "./assets/brick.webp";
import { CircleT } from "./types";
import ConfettiModal from "./components/ConfettiModal";

const MATERIALS = [
  { name: "Brick", image: brick },
  { name: "Metal", image: metal },
  { name: "Wood", image: wood },
];
export type MaterialT = (typeof MATERIALS)[number]["name"];

export default function App() {
  useEffect(() => {
    document.title = "Circle & Material Selection";
  }, []);
  const imageRef = useRef<HTMLDivElement>(null);
  const [circles, setCircles] = useState<CircleT[]>([]);
  const [material, setMaterial] = useState<MaterialT>("Brick");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const MAX_CIRCLES = 4;

  const PADDING = 20;
  const RADIUS = 20; // px

  const [showConfettiModal, setShowConfettiModal] = useState(false);

  /* ---------- helpers ---------------------------------------------------- */
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);
  const collides = useCallback(
    (x: number, y: number, excludeId?: string) =>
      circles.some(({ id, xPx, yPx }) => {
        if (excludeId && id === excludeId) return false;
        return Math.hypot(x - xPx, y - yPx) < RADIUS * 2;
      }),
    [circles],
  );

  /* ---------- add circle ------------------------------------------------- */
  const addCircle = (xPx?: number, yPx?: number) => {
    if (circles.length >= MAX_CIRCLES) return;
    const box = imageRef.current?.getBoundingClientRect();
    if (!box) return;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const tryPositions = [
      [centerX, centerY],
      [centerX, centerY + RADIUS * 2 + 8], // below
      [centerX, centerY - RADIUS * 2 - 8], // above
      [centerX + RADIUS * 2 + 8, centerY], // right
    ];
    let found = false;
    let finalX = xPx;
    let finalY = yPx;
    if (typeof xPx !== "number" || typeof yPx !== "number") {
      for (const [tx, ty] of tryPositions) {
        const clamped = {
          x: clamp(tx, PADDING + RADIUS, box.width - PADDING - RADIUS),
          y: clamp(ty, PADDING + RADIUS, box.height - PADDING - RADIUS),
        };
        const doesCollide = collides(clamped.x, clamped.y);
        if (!doesCollide) {
          finalX = clamped.x;
          finalY = clamped.y;
          found = true;
          break;
        }
      }
      if (!found) {
        // Try random positions up to 20 times
        for (let i = 0; i < 20; ++i) {
          const rx =
            Math.random() * (box.width - 2 * (PADDING + RADIUS)) +
            (PADDING + RADIUS);
          const ry =
            Math.random() * (box.height - 2 * (PADDING + RADIUS)) +
            (PADDING + RADIUS);
          const doesCollide = collides(rx, ry);
          if (!doesCollide) {
            finalX = rx;
            finalY = ry;
            found = true;
            break;
          }
        }
      }
      if (!found) {
        // fallback: just use center (may overlap)
        finalX = centerX;
        finalY = centerY;
      }
    } else {
      finalX = clamp(xPx, PADDING + RADIUS, box.width - PADDING - RADIUS);
      finalY = clamp(yPx, PADDING + RADIUS, box.height - PADDING - RADIUS);
      if (collides(finalX, finalY)) {
        return;
      }
    }
    const newCircle = { id: crypto.randomUUID(), xPx: finalX!, yPx: finalY! };
    setCircles((c) => [...c, newCircle]);
  };

  /* ---------- drag update ------------------------------------------------ */
  const updateCircle = (id: string, xPx: number, yPx: number) => {
    const box = imageRef.current?.getBoundingClientRect();
    if (!box) return;
    xPx = clamp(xPx, PADDING + RADIUS, box.width - PADDING - RADIUS);
    yPx = clamp(yPx, PADDING + RADIUS, box.height - PADDING - RADIUS);
    if (collides(xPx, yPx, id)) return;
    setCircles((c) =>
      c.map((circle) => (circle.id === id ? { ...circle, xPx, yPx } : circle)),
    );
  };

  /* ---------- delete circle --------------------------------------------- */
  const deleteCircle = (id: string) => {
    setCircles((c) => c.filter((circle) => circle.id !== id));
    // Remove selectedCircleId and mode
  };

  /* ---------- submit ----------------------------------------------------- */
  const handleSubmit = () => {
    const box = imageRef.current?.getBoundingClientRect();
    if (!box) return;
    const payload = circles.map(({ id, xPx, yPx }) => ({
      id,
      px: { x: xPx, y: box.height - yPx }, // Convert to bottom-left coordinates
      pct: {
        x: +((xPx / box.width) * 100).toFixed(2),
        y: +(((box.height - yPx) / box.height) * 100).toFixed(2), // Convert to bottom-left percentages
      },
    }));
    console.clear();
    console.log("Selected material:", material);
    const readablePayload = payload
      .map(
        (c, i) =>
          `Circle ${i + 1}: (x: ${c.px.x.toFixed(1)} px, y: ${c.px.y.toFixed(1)} px from bottom-left) | (${c.pct.x}% from left, ${c.pct.y}% from bottom)`,
      )
      .join("\n");
    console.log("Circle Details:\n" + readablePayload);

    setShowConfettiModal(true);
  };

  const box = imageRef.current?.getBoundingClientRect();
  const canvasWidth = box?.width || 0;
  const canvasHeight = box?.height || 0;

  const selectedMaterial =
    MATERIALS.find((m) => m.name === material) || MATERIALS[0];

  return (
    <div className="lg:h-screen lg:overflow-y-hidden grid grid-cols-12 gap-6 xl:gap-14 px-2 sm:px-8 bg-neutral-50 text-neutral-900">
      <ImageCanvas
        ref={imageRef}
        materials={MATERIALS}
        selectedMaterial={material}
        onMaterialChange={setMaterial}
        circles={circles}
        radius={RADIUS}
        onDrag={updateCircle}
        padding={PADDING}
        draggedId={draggedId}
        setDraggedId={setDraggedId}
      />
      <div className="flex flex-col col-span-12 lg:col-span-4 2xl:col-span-3  gap-20 px-4 lg:px-2 3xl:px-8 py-4 lg:py-20 h-screen overflow-y-auto scrollbar-hide">
        <Controls
          radius={RADIUS}
          containerRef={imageRef}
          circles={circles}
          onAdd={addCircle}
          clampXY={(x, y) => {
            const box = imageRef.current?.getBoundingClientRect();
            if (!box) return { x, y };
            return {
              x: Math.min(Math.max(x, PADDING), box.width - PADDING),
              y: Math.min(Math.max(y, PADDING), box.height - PADDING),
            };
          }}
          onCircleUpdate={updateCircle}
          onCircleDelete={deleteCircle}
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          draggedId={draggedId}
          padding={PADDING}
        />
        <MaterialsSelector
          materials={MATERIALS}
          selected={material}
          onSelect={(m) => setMaterial(m as MaterialT)}
        />
        <button
          className="mt-auto py-3 rounded-xl text-xl  font-medium shadow-[0_0_20px_rgba(0,0,0,0.05)]
                     bg-neutral-900 text-white hover:bg-neutral-800
                     transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
                     hover:scale-105 active:scale-95 will-change-transform"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <ConfettiModal
          active={showConfettiModal}
          onClose={() => setShowConfettiModal(false)}
        />
      </div>
    </div>
  );
}
