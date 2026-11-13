import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import { SITE } from '../config/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>
            Medicine fellowships, PG diplomas and certificates for practising doctors, taught online by working clinicians.
          </p>
          <ul className="footer__contact">
            <li><Icon name="mail" size={18} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><Icon name="phone" size={18} /><a href={`tel:+${SITE.phoneRaw}`}>{SITE.phone}</a></li>
          </ul>
        </div>
        <nav aria-label="Programs">
          <h3>Programs</h3>
          <Link to="/courses?type=Fellowship">Fellowships</Link>
          <Link to="/courses?type=Pg+Diploma">PG Diplomas</Link>
          <Link to="/courses?type=Certificate">Certificates</Link>
          <Link to="/courses">All courses</Link>
        </nav>
        <nav aria-label="Academy">
          <h3>Academy</h3>
          <Link to="/about">About us</Link>
          <Link to="/faculty">Faculty</Link>
          <Link to="/support">Support</Link>
         
        </nav>
        <nav aria-label="Legal">
          <h3>Legal</h3>
          <Link to="/privacy-policy">Privacy policy</Link>
          <Link to="/terms-and-conditions">Terms &amp; conditions</Link>
          <Link to="/refund-and-cancellation-policy">Refund &amp; cancellation</Link>
          <Link to="/sitemap">Sitemap</Link>
          <a href="/sitemap.xml">sitemap.xml</a>
        </nav>
      </div>
      <div className="container footer__base">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Our programs are professional skill-development courses and are not
          government postgraduate medical degrees or NEET-based PG residency seats.
        </p>
        <div className="footer__social">
          {Object.entries(SITE.social).map(([k, v]) => (
            <a key={k} href={v} target="_blank" rel="noreferrer">{k}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
