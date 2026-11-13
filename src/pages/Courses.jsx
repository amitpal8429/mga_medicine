import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAsync from '../hooks/useAsync';
import useSeo from '../hooks/useSeo';
import useMediaQuery from '../hooks/useMediaQuery';
import { getCourses } from '../api/client';
import { specialtyOf } from '../utils/specialty';
import PageHero from '../components/PageHero';
import CourseRow from '../components/CourseRow';
import { Loading, ErrorState, Empty } from '../components/States';

const TYPES = ['Fellowship', 'Pg Diploma', 'Certificate'];
const SORTS = {
  popular: 'Most popular',
  name: 'Name (A–Z)',
  feeLow: 'Fee: low to high',
  feeHigh: 'Fee: high to low',
  short: 'Shortest first',
};
const PAGE = 15;

export default function Courses() {
  useSeo({
    title: 'Courses',
    description: 'Browse medicine fellowships, PG diplomas and certificate programs for doctors.',
    path: '/courses',
  });
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const desktop = useMediaQuery('(min-width: 861px)');
  const [openF, setOpenF] = useState(false);
  const { data, error, loading, retry } = useAsync(getCourses, []);

  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const sp = params.get('sp') || '';
  const sort = params.get('sort') || 'popular';
  const set = (k, v) => {
    const n = new URLSearchParams(params);
    v ? n.set(k, v) : n.delete(k);
    setParams(n, { replace: true });
    setShown(PAGE);
  };

  const withSp = useMemo(() => (data || []).map((c) => ({ ...c, _sp: specialtyOf(c.name) })), [data]);
  const spCounts = useMemo(() => {
    const m = {};
    withSp.forEach((c) => { m[c._sp] = (m[c._sp] || 0) + 1; });
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
  }, [withSp]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = withSp.filter((c) =>
      (!type || c.type === type) &&
      (!sp || c._sp === sp) &&
      (!needle || `${c.name} ${c._sp} ${c.type}`.toLowerCase().includes(needle)));
    const by = {
      popular: (a, b) => b.top_courses - a.top_courses || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
      feeLow: (a, b) => a.fee - b.fee,
      feeHigh: (a, b) => b.fee - a.fee,
      short: (a, b) => a.duration - b.duration,
    }[sort];
    return [...out].sort(by);
  }, [withSp, q, type, sp, sort]);

  const clear = () => { setParams({}, { replace: true }); setShown(PAGE); };
  const active = q || type || sp;

  return (
    <>
      <PageHero title="Find your program" lead="Medicine fellowships, PG diplomas and certificates for practising doctors." crumbs={[{ label: 'Courses' }]} />
      <div className="container browse">
        <details className="filters" open={desktop || openF} onToggle={(e) => !desktop && setOpenF(e.currentTarget.open)}>
          <summary>Filters{active ? ' (on)' : ''}</summary>
          <div className="field">
            <label htmlFor="q">Search</label>
            <input id="q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Name or speciality" />
          </div>
          <fieldset>
            <legend>Program type</legend>
            <label className="radio"><input type="radio" name="type" checked={!type} onChange={() => set('type', '')} /> All types</label>
            {TYPES.map((t) => (
              <label key={t} className="radio">
                <input type="radio" name="type" checked={type === t} onChange={() => set('type', t)} />
                {t.replace('Pg ', 'PG ')}
                <span>{withSp.filter((c) => c.type === t).length}</span>
              </label>
            ))}
          </fieldset>
          <div className="field">
            <label htmlFor="sp">Speciality</label>
            <select id="sp" value={sp} onChange={(e) => set('sp', e.target.value)}>
              <option value="">All specialities</option>
              {spCounts.map(([s, n]) => <option key={s} value={s}>{s} ({n})</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {active && <button className="link-btn" onClick={clear}>Clear all filters</button>}
        </details>

        <section aria-live="polite">
          {loading && <Loading rows={5} variant="rows" />}
          {error && <ErrorState error={error} retry={retry} />}
          {data && (
            <>
              <p className="count">{list.length} {list.length === 1 ? 'program' : 'programs'}{active ? ' match your filters' : ''}</p>
              {list.length === 0 ? (
                <Empty title="No programs match those filters"><button className="link-btn" onClick={clear}>Clear filters</button> to see everything.</Empty>
              ) : (
                <div className="rows">{list.slice(0, shown).map((c) => <CourseRow key={c.id} course={c} />)}</div>
              )}
              {list.length > shown && (
                <div className="more"><button className="btn btn--line" onClick={() => setShown(shown + PAGE)}>Show more ({list.length - shown} left)</button></div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
