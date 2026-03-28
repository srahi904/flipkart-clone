const variants = {
  primary:
    'bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-dark)]',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  accent: 'bg-[var(--brand-orange)] text-white hover:bg-[#e85a19]',
};

function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-[2px] px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
