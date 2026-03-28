import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import ROUTES from '@/constants/routes';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-4">
      <div className="max-w-xl rounded-[36px] bg-white p-10 text-center shadow-lift">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">404</p>
        <h1 className="mt-3 font-display text-5xl text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-500">The page you are looking for does not exist.</p>
        <Link to={ROUTES.home} className="mt-8 inline-block">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
