
export default function FilterHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex justify-between items-center border-b border-[#D9D9D9] pb-4">
      <h3 className="text-black md:text-[32px] text-xl font-medium">Filter</h3>
      <button
        onClick={onReset}
        className="text-[#008CFF] md:text-[24px] text-lg font-medium hover:underline"
      >
        Reset Filter
      </button>
    </div>
  );
}
