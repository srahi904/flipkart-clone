import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-slate-900">
      <Navbar />
      <main className="page-shell min-h-[calc(100vh-220px)] px-0 py-3 md:py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
