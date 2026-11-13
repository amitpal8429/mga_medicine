import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import { getCourses, getFaculty } from '../api/client';
import { specialtyOf } from '../utils/specialty';
import { inr } from '../utils/format';
import { SITE } from '../config/site';
import EcgLine from '../components/EcgLine';
import Icon from '../components/Icon';
import SectionHead from '../components/SectionHead';
import CourseCard from '../components/CourseCard';
import FacultyCard from '../components/FacultyCard';
import EnquiryForm from '../components/EnquiryForm';
import { Loading, ErrorState } from '../components/States';

const TYPES = [
  { key: 'Fellowship', label: 'Fellowships', blurb: 'Advanced, speciality-deep programs for doctors who want to practise at a higher level.' },
  { key: 'Pg Diploma', label: 'PG Diplomas', blurb: 'Structured one-year programs that build a working command of a speciality.' },
  { key: 'Certificate', label: 'Certificates', blurb: 'Shorter programs to add focused clinical skills alongside your current work.' },
];

export default function Home() {
  useSeo({
    description: 'Online medicine fellowships, PG diplomas and certificates for doctors, taught by practising clinicians.',
    path: '/',
    jsonLd: { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, url: SITE.url, email: SITE.email, telephone: SITE.phone, sameAs: Object.values(SITE.social) },
  });
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const courses = useAsync(getCourses, []);
  const faculty = useAsync(getFaculty, []);

  const stats = useMemo(() => {
    const list = courses.data || [];
    const by = (t) => list.filter((c) => c.type === t);
    return {
      total: list.length,
      byType: TYPES.map((t) => {
        const items = by(t.key);
        const fees = items.map((c) => c.fee).filter(Boolean);
        const dur = items.map((c) => c.duration).filter(Boolean);
        return { ...t, count: items.length, minFee: fees.length ? Math.min(...fees) : 0, dur: dur.length ? `${Math.min(...dur)}${Math.min(...dur) === Math.max(...dur) ? '' : `–${Math.max(...dur)}`} months` : '' };
      }),
      featured: (list.filter((c) => c.top_courses === 1).concat(list.filter((c) => c.top_courses !== 1))).slice(0, 6),
      specialties: Object.entries(list.reduce((a, c) => { const s = specialtyOf(c.name); a[s] = (a[s] || 0) + 1; return a; }, {}))
        .filter(([s]) => s !== 'Other').sort((a, b) => b[1] - a[1]).slice(0, 14),
    };
  }, [courses.data]);

  const onSearch = (e) => {
    e.preventDefault();
    nav(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses');
  };

  return (
    <>
      <section className="hero">
        <div className="container hero__inner hero-split">
          <div>
            <h1>Advance your medicine practice without leaving your clinic.</h1>
            <p className="hero__lead">
              Online medicine fellowships, PG diplomas and certificates for practising doctors, taught by working clinicians through
              live sessions, case discussions and assessments.
            </p>
            <form className="hero__search" onSubmit={onSearch} role="search">
              <Icon name="search" />
              <label htmlFor="hq" className="sr">Search programs</label>
              <input id="hq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search medicine programs, e.g. Internal or Family Medicine" />
              <button className="btn btn--solid">Find a program</button>
            </form>
            <dl className="hero__stats">
              <div><dt>Programs</dt><dd>{courses.data ? stats.total : '…'}</dd></div>
              <div><dt>Faculty</dt><dd>{faculty.data ? faculty.data.length : '…'}</dd></div>
              <div><dt>Specialities</dt><dd>{courses.data ? stats.specialties.length : '…'}</dd></div>
            </dl>
          </div>
          <EnquiryForm />
        </div>
        <EcgLine className="hero__ecg" />
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Choose how deep you want to go" lead="Every program is delivered online and built around a practising doctor’s schedule." />
          {courses.loading ? <Loading rows={3} variant="cols" /> : (
            <div className="tracks">
              {stats.byType.map((t) => (
                <Link key={t.key} to={`/courses?type=${encodeURIComponent(t.key)}`} className="track">
                  <span className="track__n">{t.count}</span>
                  <h3>{t.label}</h3>
                  <p>{t.blurb}</p>
                  <ul>
                    {t.dur && <li>{t.dur}</li>}
                    {t.minFee > 0 && <li>from {inr(t.minFee)}</li>}
                  </ul>
                  <span className="link-arrow">Browse {t.label.toLowerCase()} <Icon name="arrow" size={18} /></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHead title="Popular right now" lead="Programs doctors enquire about most." to="/courses" action="All courses" />
          {courses.loading && <Loading />}
          {courses.error && <ErrorState error={courses.error} retry={courses.retry} />}
          {courses.data && <div className="grid grid--3">{stats.featured.map((c) => <CourseCard key={c.id} course={c} />)}</div>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Find your speciality" />
          <div className="chips">
            {stats.specialties.map(([s, n]) => (
              <Link key={s} to={`/courses?sp=${encodeURIComponent(s)}`} className="chip">{s} <b>{n}</b></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split">
          <div>
            <h2>How a program runs</h2>
            <p>Learning is built around clinical practice, not lecture halls.</p>
          </div>
          <ul className="steps">
            <li><strong>Expert-led sessions</strong> delivered by practising specialists.</li>
            <li><strong>Case-based learning</strong> with clinical scenarios and image interpretation.</li>
            <li><strong>Digital resources</strong> including recorded lectures and e-books you can revisit.</li>
            <li><strong>Assessments</strong> that test clinical reasoning before you are certified.</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Meet some of our faculty" lead="Clinicians who still see patients." to="/faculty" action="All faculty" />
          {faculty.loading && <Loading rows={6} variant="cols" />}
          {faculty.error && <ErrorState error={faculty.error} retry={faculty.retry} />}
          {faculty.data && <div className="grid grid--3">{faculty.data.slice(0, 6).map((f) => <FacultyCard key={f.id} person={f} />)}</div>}
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <h2>Not sure which program fits?</h2>
          <p>Tell an advisor your speciality and experience. They will point you to the right program and fee.</p>
          <div className="cta__btns">
            <a className="btn btn--light" href={`https://wa.me/${SITE.phoneRaw}`} target="_blank" rel="noreferrer"><Icon name="chat" size={18} /> WhatsApp an advisor</a>
            <Link className="btn btn--ghost-light" to="/support">Other ways to reach us</Link>
          </div>
        </div>
      </section>
    </>
  );
}