import Button from '@/components/common/Button';

function AddressForm({ values, onChange, onSubmit, submitting = false }) {
  return (
    <form onSubmit={onSubmit} className="market-card rounded-[2px] bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold uppercase tracking-[0.08em] text-slate-900">Delivery Address</h3>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {[
          ['name', 'Full Name'],
          ['phone', 'Phone Number'],
          ['line1', 'Address Line 1'],
          ['line2', 'Address Line 2'],
          ['city', 'City'],
          ['state', 'State'],
          ['pincode', 'Pincode'],
        ].map(([field, label]) => (
          <label key={field} className={field === 'line1' || field === 'line2' ? 'sm:col-span-2' : ''}>
            <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
            <input
              value={values[field] || ''}
              onChange={(event) => onChange(field, event.target.value)}
              className="w-full rounded-[2px] border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-blue)]"
            />
          </label>
        ))}
      </div>
      <div className="border-t border-slate-200 px-5 py-4">
        <Button type="submit" variant="accent" className="min-w-48" disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
}

export default AddressForm;
