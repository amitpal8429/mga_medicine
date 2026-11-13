import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import useScrollSpy from '../hooks/useScrollSpy';
import { getCourse } from '../api/client';
import { cleanModules } from '../utils/curriculum';
import { specialtyOf } from '../utils/specialty';
import { duration, inr, startLabel, splitNotice, truncate, courseTitle } from '../utils/format';
import { SITE } from '../config/site';
import CourseImage from '../components/CourseImage';
import ModuleList from '../components/ModuleList';
import EcgLine from '../components/EcgLine';
import Icon from '../components/Icon';
import EnquiryForm from '../components/EnquiryForm';
import { typeClass } from '../components/CourseCard';
import { Loading, ErrorState } from '../components/States';
import NotFound from './NotFound';

const SECTIONS = [
  ['overview', 'Overview'],
  ['highlights', 'Highlights'],
  ['learn', 'What you learn'],
  ['training', 'Training'],
  ['curriculum', 'Curriculum'],
  ['fees', 'Fees'],
];

export default function CourseDetail() {
  const { slug } = useParams();
  const { data: c, error, loading, retry } = useAsync(() => getCourse(slug), [slug]);

  const view = useMemo(() => {
    if (!c) return null;
    const { body, notice } = splitNotice(c.description);
    return {
      body,
      notice,
      modules: cleanModules(c.module),
      highlights: (c.highlight || []).map((h) => h.highlight).filter(Boolean),
      learn: c.what_you_learn || [],
      parts: c.workshop?.parts || [],
      fees: [
        ['Starting fee', c.fee],
        ['Total program fee', c.total_fee],
        ['Online + CPD', c.online_cpd],
        ['Hybrid + CPD', c.hybrid_cpd],
      ].filter(([, v]) => v > 0),
    };
  }, [c]);

  const ids = SECTIONS.map(([id]) => id);
  const active = useScrollSpy(ids);

  useSeo({
    title: c ? courseTitle(c.name) : 'Course',
    description: c ? truncate(view?.body || c.description, 155) : undefined,
    path: `/courses/${slug}`,
    noindex: !!error,
    jsonLd: c && {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: courseTitle(c.name),
      description: truncate(view.body, 300),
      provider: { '@type': 'EducationalOrganization', name: SITE.name, sameAs: SITE.url },
      ...(c.fee > 0 && { offers: { '@type': 'Offer', priceCurrency: 'INR', price: c.total_fee || c.fee, category: 'Paid' } }),
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: `P${c.duration || 12}M` },
    },
  });

  if (loading) return <div className="container pad"><Loading rows={4} variant="rows" /></div>;
  if (error) return /404/.test(error.message) ? <NotFound /> : <div className="container pad"><ErrorState error={error} retry={retry} /></div>;

  const name = courseTitle(c.name);
  const sp = specialtyOf(c.name);

  return (
    <>
      <section className="dhero">
        <div className="container dhero__grid">
          <div>
            <nav className="crumbs crumbs--light" aria-label="Breadcrumb">
              <Link to="/">Home</Link><Link to="/courses">Courses</Link><span>{sp}</span>
            </nav>
            <span className={`${typeClass(c.type)} tag--onDark`}>{c.type?.replace('Pg ', 'PG ')}</span>
            <h1>{name}</h1>
            <p className="dhero__lead">{truncate(view.body, 200)}</p>
            <ul className="facts">
              <li><Icon name="clock" /><span><b>{duration(c.duration)}</b>Duration</span></li>
              <li><Icon name="calendar" /><span><b>{startLabel(c.start_date)}</b>Next intake</span></li>
              <li><Icon name="globe" /><span><b>Online</b>Delivery</span></li>
              {inr(c.fee) && <li><Icon name="book" /><span><b>{inr(c.fee)}</b>Starting fee</span></li>}
            </ul>
          </div>
          <CourseImage course={c} className="dhero__img" />
        </div>
        <EcgLine className="dhero__ecg" />
      </section>

      <div className="container detail">
        <div className="detail__main">
          <nav className="tabs" aria-label="On this page">
            {SECTIONS.filter(([id]) => id !== 'highlights' || view.highlights.length).map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{label}</a>
            ))}
          </nav>

          <section id="overview" className="block">
            <h2>Overview</h2>
            <p className="prose">{view.body}</p>
            {view.notice && (
              <aside className="notice"><Icon name="shield" /><p><b>Please note.</b> {view.notice}</p></aside>
            )}
          </section>

          {view.highlights.length > 0 && (
            <section id="highlights" className="block">
              <h2>Highlights</h2>
              <ul className="ticks">{view.highlights.map((h) => <li key={h}><Icon name="check" size={18} />{h}</li>)}</ul>
            </section>
          )}

          {view.learn.length > 0 && (
            <section id="learn" className="block">
              <h2>What you learn</h2>
              <div className="learn">
                {view.learn.map((l) => (
                  <div key={l.id}><h3>{l.heading}</h3><p>{l.description}</p></div>
                ))}
              </div>
            </section>
          )}

          {(view.parts.length > 0 || c.workshop) && (
            <section id="training" className="block">
              <h2>{c.workshop?.title || 'Training'}</h2>
              {c.workshop?.subtitle && <p className="prose">{c.workshop.subtitle}</p>}
              {view.parts.map((p) => (
                <div key={p.id} className="part">
                  <h3>{p.title}</h3>
                  {p.subtitle && <p>{p.subtitle}</p>}
                  <ul className="ticks">{(p.key_points || []).map((k) => <li key={k.id}><Icon name="check" size={18} />{k.content}</li>)}</ul>
                </div>
              ))}
            </section>
          )}

          {view.modules.length > 0 && (
            <section id="curriculum" className="block">
              <h2>Curriculum</h2>
              <ModuleList modules={view.modules} />
            </section>
          )}

          <section id="fees" className="block">
            <h2>Fees</h2>
            {view.fees.length ? (
              <table className="fees">
                <tbody>{view.fees.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{inr(v)}</td></tr>)}</tbody>
              </table>
            ) : <p className="prose">Fee details are shared by an advisor.</p>}
            <p className="small">Fees shown are as published by the Academy. Confirm the latest amount and instalment options with an advisor before you enrol.</p>
          </section>
        </div>

        <aside className="enrol" aria-label="Enquire about this program">
          {inr(c.total_fee || c.fee) && (
            <p className="enrol__price"><small>Total program fee</small>{inr(c.total_fee || c.fee)}</p>
          )}
          <EnquiryForm course={c.name} />
          <a className="btn btn--line btn--block" href={`tel:+${SITE.phoneRaw}`}><Icon name="phone" size={18} /> Call {SITE.phone}</a>
        </aside>
      </div>
    </>
  );
}