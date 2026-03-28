function SpecTable({ specs = [] }) {
  // Group or just linear render where empty specValue or explicitly "__HEADER" marks a header.
  return (
    <div className="market-card overflow-hidden rounded-[2px] bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-[24px] font-semibold text-slate-900">Specifications</h3>
      </div>
      <div className="divide-y divide-slate-100 flex flex-col">
        {specs.map((spec) => {
          const isHeader =
            spec.specValue === '' || spec.specValue === '@@HEADER' || spec.specKey.endsWith('_HEADER');
            
          if (isHeader) {
            const headerText = spec.specKey.replace('_HEADER', '');
            return (
              <div key={spec.id || spec.specKey} className="px-6 py-4 pt-6">
                <h4 className="text-[17px] font-semibold text-slate-800">{headerText}</h4>
              </div>
            );
          }

          return (
            <div key={spec.id || spec.specKey} className="grid gap-2 px-6 py-4 sm:grid-cols-[220px_1fr]">
              <p className="text-[15px] font-normal text-slate-500">{spec.specKey}</p>
              <p className="text-[15px] text-slate-800 leading-relaxed">{spec.specValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpecTable;
