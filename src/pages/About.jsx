import { Link } from 'react-router-dom';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import { getCourses, getFaculty } from '../api/client';
import { specialtyOf } from '../utils/specialty';
import PageHero from '../components/PageHero';
import Icon from '../components/Icon';

const OFFERINGS = [
  ['Certificate Courses', 'Short, focused programmes for professional learning and skill development.', false],
  ['Fellowship Programmes', 'Speciality-focused learning with experienced faculty.', true],
  ['PG Diploma Programmes', 'In-depth postgraduate-level learning to strengthen your clinical knowledge in your chosen speciality.', false],
];

const STEPS = [
  ['Choose your programme', 'Browse Certificate, Fellowship and PG Diploma programmes by speciality.'],
  ['Enrol online', 'Pick the attending or non-attending format that suits your schedule.'],
  ['Learn your way', 'Online learning, live faculty-led sessions and recorded sessions where available.'],
  ['Get certified', 'Complete your programme and receive your certification.'],
];

const VALUES = [
  ['clock', 'Flexible', 'Learn around your professional schedule.'],
  ['shield', 'Accessible', 'Access online learning and available recorded sessions.'],
  ['users', 'Faculty-led', 'Learn from experienced medical professionals.'],
  ['award', 'Anywhere', 'Access the online learning component from anywhere.'],
];

export default function About() {
  useSeo({
    title: 'About us',
    description: 'Medical Global Academy provides flexible online Certificate, Fellowship and PG Diploma programmes for practising doctors.',
    path: '/about',
  });

  const courses = useAsync(getCourses, []);
  const faculty = useAsync(getFaculty, []);
  const n = courses.data?.length;
  const specs = courses.data
    ? new Set(courses.data.map((c) => specialtyOf(c.name)).filter((s) => s !== 'Other')).size
    : null;

  return (
    <>
      <PageHero
        title="About Medical Global Academy"
        lead="Flexible online medical education for practising doctors, without stepping away from patients."
        crumbs={[{ label: 'About us' }]}
      />

      <section className="container about">
        <div className="about__text">
          <h2>Learn without stepping away from clinical practice.</h2>
          <p className="prose">Medical Global Academy (MGA) is an online medical education platform for practising doctors who want to keep learning while managing their professional responsibilities. Since 2020, we have helped doctors upgrade their clinical knowledge and grow in their careers.</p>
          <p className="prose">We offer Certificate Courses, Fellowships and PG Diploma programmes. Programmes combine structured online learning, live faculty-led sessions and programme-specific training where applicable. Choose attending or non-attending options to study at your own convenience.</p>
          <p className="prose">We are clear about what these programmes are: professional skill-development courses that support continuing professional development. They are not a replacement for a government postgraduate degree or registration.</p>
        </div>
        <dl className="about__stats">
          <div><dd>{n ?? '…'}</dd><dt>programmes</dt></div>
          <div><dd>{specs ?? '…'}</dd><dt>specialities</dt></div>
          <div><dd>{faculty.data?.length ?? '…'}</dd><dt>faculty members</dt></div>
        </dl>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="center">Why we exist, and where we're headed.</h2>
          <div className="values">
            <div>
              <h3>Our Mission</h3>
              <p>To bridge the gap in healthcare education by providing accessible, flexible and high-quality learning opportunities, helping medical professionals gain new skills, advance their careers and improve patient care.</p>
            </div>
            <div>
              <h3>Our Vision</h3>
              <p>To be the most trusted destination for continuing medical education worldwide, empowering every healthcare professional to learn, grow and lead.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="center">Programmes for continuous medical learning.</h2>
          <div className="values">
            {OFFERINGS.map(([title, text, popular]) => (
              <div key={title}>
                {popular && <span className="badge">Most Popular</span>}
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <h2 className="center">From enrolment to certification in four simple steps.</h2>
          <div className="values">
            {STEPS.map(([title, text], i) => (
              <div key={title}>
                <span className="step-num">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="center">Flexible learning for working doctors.</h2>
          <div className="values">
            {VALUES.map(([ic, t, p]) => (
              <div key={t}><Icon name={ic} size={26} /><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta__inner">
          <h2>Ready to advance your medical career?</h2>
          <div className="cta__btns">
            <Link className="btn btn--light" to="/courses">Browse courses</Link>
            <Link className="btn btn--ghost-light" to="/faculty">Meet the faculty</Link>
          </div>
        </div>
      </section>
    </>
  );
}