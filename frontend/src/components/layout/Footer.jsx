import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes';

import logo from '@/assets/images/flipkart-logo.svg';

const footerLinks = [
  {
    title: 'ABOUT',
    links: [
      { label: 'Contact Us', to: '#' },
      { label: 'About Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Flipkart Stories', to: '#' },
      { label: 'Press', to: '#' },
    ],
  },
  {
    title: 'HELP',
    links: [
      { label: 'Payments', to: '#' },
      { label: 'Shipping', to: '#' },
      { label: 'Cancellation & Returns', to: '#' },
      { label: 'FAQ', to: '#' },
      { label: 'Report Infringement', to: '#' },
    ],
  },
  {
    title: 'CONSUMER POLICY',
    links: [
      { label: 'Cancellation & Returns', to: '#' },
      { label: 'Terms of Use', to: '#' },
      { label: 'Security', to: '#' },
      { label: 'Privacy', to: '#' },
      { label: 'Sitemap', to: '#' },
    ],
  },
  {
    title: 'SOCIAL',
    links: [
      { label: 'Facebook', to: '#' },
      { label: 'Twitter', to: '#' },
      { label: 'YouTube', to: '#' },
      { label: 'Instagram', to: '#' },
    ],
  },
];

const bottomLinks = [
  'Become a Seller',
  'Advertise',
  'Gift Cards',
  'Help Center',
  '© 2026 Flipkart Clone',
];

function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-white">
      <div className="page-shell grid gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-slate-400">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-300 transition hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700">
        <div className="page-shell flex flex-wrap items-center justify-center gap-3 px-4 py-4 sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {bottomLinks.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-5 w-auto" />
            <span className="text-xs text-slate-400">Flipkart</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
