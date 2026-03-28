import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ROUTES from '@/constants/routes';
import authService from '@/services/authService';
import { setSession } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import { isStrongPassword, isValidEmail } from '@/utils/validators';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  if (token) {
    return <Navigate to={ROUTES.home} replace />;
  }

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !isValidEmail(form.email) || !isStrongPassword(form.password)) {
      dispatch(
        addToast({
          variant: 'error',
          message: 'Fill valid details. Password needs 8+ chars, upper/lowercase, and a number.',
        }),
      );
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        ...(form.phone ? {} : { phone: undefined }),
      };
      const session = await authService.register(payload);
      dispatch(setSession(session));
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      dispatch(addToast({ variant: 'error', message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fk-gray-bg)] px-4 py-10">
      <div className="w-full max-w-[780px] overflow-hidden rounded-sm bg-white shadow-lg md:flex">
        {/* Left Blue Panel */}
        <div className="flex flex-col justify-between bg-[var(--fk-blue)] px-8 py-10 text-white md:w-[40%]">
          <div>
            <h1 className="text-[28px] font-bold leading-tight">
              Looks like you&apos;re new here!
            </h1>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Sign up with your email to get started
            </p>
          </div>
          <div className="mt-10 hidden md:block">
            <svg viewBox="0 0 200 200" className="mx-auto h-40 w-40 opacity-20">
              <circle cx="100" cy="70" r="35" fill="white" />
              <path d="M60 120 Q100 160 140 120" stroke="white" fill="none" strokeWidth="4" />
              <rect x="75" y="145" width="50" height="8" rx="4" fill="white" />
              <rect x="85" y="162" width="30" height="6" rx="3" fill="white" />
            </svg>
          </div>
        </div>

        {/* Right White Panel */}
        <div className="flex flex-1 flex-col justify-center px-8 py-10 md:px-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter Full Name"
                  className="w-full border-b-2 border-slate-300 pb-2 text-sm outline-none transition focus:border-[var(--fk-blue)]"
                />
              </div>
              <div>
                <input
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter Email"
                  className="w-full border-b-2 border-slate-300 pb-2 text-sm outline-none transition focus:border-[var(--fk-blue)]"
                />
              </div>
              <div>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter Phone Number (optional)"
                  className="w-full border-b-2 border-slate-300 pb-2 text-sm outline-none transition focus:border-[var(--fk-blue)]"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Password"
                  className="w-full border-b-2 border-slate-300 pb-2 text-sm outline-none transition focus:border-[var(--fk-blue)]"
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Min 8 characters, with uppercase, lowercase and a number
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              By continuing, you agree to Flipkart&apos;s{' '}
              <span className="text-[var(--fk-blue)]">Terms of Use</span> and{' '}
              <span className="text-[var(--fk-blue)]">Privacy Policy</span>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-sm bg-[var(--fk-orange)] py-3.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'CONTINUE'}
            </button>

            <Link
              to={ROUTES.login}
              className="mt-5 block w-full rounded-sm border border-slate-300 py-3 text-center text-sm font-semibold text-[var(--fk-blue)] transition hover:bg-slate-50"
            >
              Existing User? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
