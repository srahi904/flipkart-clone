function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="mt-5 h-10 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export default ProductSkeleton;
