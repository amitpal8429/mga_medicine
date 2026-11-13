import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo${light ? ' logo--light' : ''}`} aria-label={`${SITE.name} home`}>
      <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="currentColor" className="logo__tile" />
        <path d="M6 34h14l5-14 8 28 6-20 4 6h15" fill="none" stroke="#5FD3C6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo__text">
        <strong>Medical Global</strong>
        <span>Academy</span>
      </span>
    </Link>
  );
}
