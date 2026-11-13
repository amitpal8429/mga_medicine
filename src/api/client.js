import { API_BASE, MEDICINE } from '../config/site';

const cache = new Map();

async function getJson(path) {
  if (cache.has(path)) return cache.get(path);
  const p = fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return res.json();
    })
    .catch((err) => {
      cache.delete(path); // never cache failures
      throw err;
    });
  cache.set(path, p);
  return p;
}

const isTestFaculty = (f) => /^FACULTY\d+$/i.test(String(f.name || '').trim());
const norm = (x) => String(x || '').trim().toLowerCase();

export const isMedicineCourse = (c) =>
  MEDICINE.EXTRA_COURSE_SLUGS.includes(c.slug) ||
  MEDICINE.categories.some((n) => norm(n) === norm(c.category?.name));

export const isMedicineFaculty = (f) => {
  const wanted = MEDICINE.departments.map(norm);
  return String(f.department || '').split(',').some((d) => wanted.includes(norm(d)));
};

// Course detail has no category object, only `department` (a JSON string like '["Medicine"]') and category_id.
const isMedicineDetail = (c) => {
  if (MEDICINE.EXTRA_COURSE_SLUGS.includes(c.slug)) return true;
  let depts = [];
  try { depts = JSON.parse(c.department || '[]'); } catch { depts = String(c.department || '').split(','); }
  return depts.some((d) => MEDICINE.categories.map(norm).includes(norm(d)));
};

export const getCourses = () => getJson('/course-list').then((l) => l.filter(isMedicineCourse));
export const getCourse = (slug) =>
  getJson(`/course-details/${encodeURIComponent(slug)}`).then((c) => {
    if (!isMedicineDetail(c)) throw new Error('Request failed (404)');
    return c;
  });

// Test records and non-Medicine doctors are hidden. Phone and email are dropped: never shown on the site.
export const getFaculty = () =>
  getJson('/faculty-list').then((list) =>
    list
      .filter((f) => f.name && !isTestFaculty(f) && isMedicineFaculty(f))
      .map(({ email, phone, ...safe }) => safe),
  );
