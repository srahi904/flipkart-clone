function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-700"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-semibold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-9 w-9 rounded-full bg-slate-100 text-lg font-semibold text-slate-700"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
