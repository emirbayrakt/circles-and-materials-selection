interface Material {
  name: string;
  image: string;
}

interface Props {
  materials: readonly Material[];
  selected: string;
  onSelect: (m: string) => void;
}

export default function MaterialsSelector({
  materials,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col gap-6   text-neutral-900">
      <div className="font-semibold mb-2 text-2xl 3xl:pr-10 ">
        <span className=" text-neutral-900">Material.</span>
        <span className="ml-2 text-[#86868b]">
          Which material do you think would look best?
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {materials.map((mat) => {
          const isSelected = mat.name === selected;
          return (
            <button
              key={mat.name}
              onClick={() => onSelect(mat.name)}
              className={
                `flex items-center gap-4 p-5 rounded-2xl bg-white/80 shadow-[0_0_12px_rgba(0,0,0,0.04)] backdrop-blur-md border-2 transition-all duration-200 will-change-transform ` +
                (isSelected
                  ? "scale-105 ring-2 ring-neutral-300 shadow-lg"
                  : "scale-100 ring-0 shadow-none hover:scale-105 hover:shadow-lg")
              }
              style={{ minHeight: 80 }}
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-200 flex items-center justify-center overflow-hidden">
                <img
                  src={mat.image}
                  alt={mat.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-lg font-medium flex-1 text-left">
                {mat.name}
              </span>
              {isSelected && (
                <span className="text-neutral-900 font-bold text-base">✓</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="text-sm text-neutral-500 caption mt-2">
        Aktuell: <strong>{selected}</strong>
      </div>
    </div>
  );
}
