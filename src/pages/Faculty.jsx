import { useMemo, useState } from 'react';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import { getFaculty } from '../api/client';
import { departmentsOf } from '../utils/specialty';
import PageHero from '../components/PageHero';
import FacultyCard from '../components/FacultyCard';
import { Loading, ErrorState, Empty } from '../components/States';

export default function Faculty() {
  useSeo({ title: 'Faculty', description: 'Meet the medicine doctors who teach Medical Global Academy programs.', path: '/faculty' });
  const { data, error, loading, retry } = useAsync(getFaculty, []);
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');

  const rich = useMemo(() => (data || []).map((f) => ({ ...f, _d: departmentsOf(f.department) })), [data]);
  const depts = useMemo(() => [...new Set(rich.flatMap((f) => f._d))].sort(), [rich]);
  const list = rich.filter((f) =>
    (!dept || f._d.includes(dept)) &&
    (!q || `${f.name} ${f.qualification} ${f._d.join(' ')}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <PageHero title="The people who teach" lead="Medicine doctors who teach alongside their clinical practice." crumbs={[{ label: 'Faculty' }]} />
      <div className="container pad">
        <div className="toolbar">
          <div className="field"><label htmlFor="fq">Search faculty</label><input id="fq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or qualification" /></div>
          <div className="field"><label htmlFor="fd">Department</label>
            <select id="fd" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="">All departments</option>
              {depts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {loading && <Loading rows={9} variant="cols" />}
        {error && <ErrorState error={error} retry={retry} />}
        {data && (list.length ? (
          <>
            <p className="count">{list.length} faculty</p>
            <div className="grid grid--3">{list.map((f) => <FacultyCard key={f.id} person={f} />)}</div>
          </>
        ) : <Empty title="No faculty match that search" />)}
      </div>
    </>
  );
}
