import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import PageHero from '../components/PageHero';
import { LEGAL, UPDATED } from '../data/legal';
import { SITE } from '../config/site';

export default function LegalPage({ doc }) {
  const d = LEGAL[doc];
  useSeo({ title: d.title, description: d.description, path: `/${doc}` });
  return (
    <>
      <PageHero title={d.title} lead={d.intro} crumbs={[{ label: d.title }]} />
      <div className="container legal">
        <nav className="legal__toc" aria-label="In this policy">
          <p>In this page</p>
          {d.sections.map(([h], i) => <a key={h} href={`#s${i}`}>{h}</a>)}
        </nav>
        <article>
          <p className="small">Last updated {UPDATED}</p>
          {d.sections.map(([h, paras], i) => (
            <section key={h} id={`s${i}`} className="block">
              <h2>{h}</h2>
              {paras.map((p) => <p key={p} className="prose">{p}</p>)}
            </section>
          ))}
          <p className="prose">Questions? Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit <Link to="/support">Support</Link>.</p>
        </article>
      </div>
    </>
  );
}
