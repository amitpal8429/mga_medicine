import { Link } from 'react-router-dom';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import { getCourses } from '../api/client';
import { courseTitle } from '../utils/format';
import PageHero from '../components/PageHero';
import { Loading } from '../components/States';

const PAGES = [
  ['/', 'Home'], ['/courses', 'All courses'], ['/faculty', 'Faculty'], ['/about', 'About us'],
  ['/support', 'Support'], ['/app', 'Mobile app'],
];
const LEGAL = [
  ['/privacy-policy', 'Privacy policy'], ['/terms-and-conditions', 'Terms & conditions'],
  ['/refund-and-cancellation-policy', 'Refund & cancellation policy'],
];
const TYPES = [['Fellowship', 'Fellowships'], ['Pg Diploma', 'PG Diplomas'], ['Certificate', 'Certificates']];

export default function SitemapPage() {
  useSeo({ title: 'Sitemap', description: 'Every page on the Medical Global Academy website.', path: '/sitemap' });
  const { data, loading } = useAsync(getCourses, []);
  return (
    <>
      <PageHero title="Sitemap" lead="Every page on this website. Machines can read the same list at /sitemap.xml." crumbs={[{ label: 'Sitemap' }]} />
      <div className="container pad smap">
        <section><h2>Pages</h2><ul>{PAGES.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul></section>
        <section><h2>Legal</h2><ul>{LEGAL.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}<li><a href="/sitemap.xml">sitemap.xml</a></li></ul></section>
        {loading && <Loading rows={3} variant="cols" />}
        {data && TYPES.map(([t, label]) => (
          <section key={t}><h2>{label}</h2>
            <ul>{data.filter((c) => c.type === t).map((c) => <li key={c.id}><Link to={`/courses/${c.slug}`}>{courseTitle(c.name)}</Link></li>)}</ul>
          </section>
        ))}
      </div>
    </>
  );
}
