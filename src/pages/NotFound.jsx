import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import EcgLine from '../components/EcgLine';

export default function NotFound() {
  useSeo({ title: 'Page not found', path: '/404', noindex: true });
  return (
    <section className="nf">
      <div className="container">
        <p className="nf__code">404</p>
        <h1>That page has flatlined.</h1>
        <p>The link may be old or mistyped. Try our courses or head back home.</p>
        <div className="cta__btns">
          <Link className="btn btn--solid" to="/courses">Browse courses</Link>
          <Link className="btn btn--line" to="/">Go home</Link>
        </div>
      </div>
      <EcgLine className="nf__ecg" />
    </section>
  );
}
