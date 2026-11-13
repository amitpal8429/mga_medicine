import { useState } from 'react';
import { departmentsOf } from '../utils/specialty';

const initials = (n = '') =>
  n.replace(/^Dr\.?\s*/i, '').split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

// Contact details are stripped in api/client.js, so only name, qualification and department appear here.
export default function FacultyCard({ person }) {
  const [broken, setBroken] = useState(false);
  const depts = departmentsOf(person.department);
  const quals = String(person.qualification || '').replace(/\s*[\/,]\s*/g, ', ');
  return (
    <article className="fcard">
      {person.image_url && !broken ? (
        <img className="fcard__ph" src={person.image_url} alt="" loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <div className="fcard__ph fcard__ph--init" aria-hidden="true">{initials(person.name)}</div>
      )}
      <div>
        <h3>{person.name}</h3>
        {quals && <p className="fcard__q">{quals}</p>}
        <p className="fcard__d">{depts.join(' · ')}</p>
      </div>
    </article>
  );
}
