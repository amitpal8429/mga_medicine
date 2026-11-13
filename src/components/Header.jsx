import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import { SITE } from '../config/site';

const NAV = [
  { to: '/courses', label: 'Courses' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },

];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="container header__bar">
        <Logo />
        <nav className={`nav${open ? ' nav--open' : ''}`} aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={close} className={({ isActive }) => (isActive ? 'active' : '')}>
              {n.label}
            </NavLink>
          ))}
          <a className="btn btn--solid nav__cta" href={`https://wa.me/${SITE.phoneRaw}`} target="_blank" rel="noreferrer">
            <Icon name="chat" size={18} /> Talk to an advisor
          </a>
        </nav>
        <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </header>
  );
}

export { Link };
