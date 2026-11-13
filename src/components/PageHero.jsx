import { Link } from 'react-router-dom';
import EcgLine from './EcgLine';

export default function PageHero({ title, lead, crumbs = [] }) {
  return (
    <section className="phero">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c) => (c.to ? <Link key={c.label} to={c.to}>{c.label}</Link> : <span key={c.label}>{c.label}</span>))}
        </nav>
        <h1>{title}</h1>
        {lead && <p className="phero__lead">{lead}</p>}
      </div>
      <EcgLine className="phero__ecg" />
    </section>
  );
}
