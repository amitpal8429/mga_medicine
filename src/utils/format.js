// Small, pure formatting helpers (unit-tested in utils.test.js).
export const inr = (n) =>
  typeof n === 'number' && n > 0
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
    : null;

export const duration = (months) => (months ? `${months} ${months === 1 ? 'month' : 'months'}` : 'Flexible');

// Past start dates read as "Rolling enrolment" instead of a date that has already gone by.
export function startLabel(iso, now = new Date()) {
  if (!iso) return 'Rolling enrolment';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime()) || d < new Date(now.getFullYear(), now.getMonth(), 1)) return 'Rolling enrolment';
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

// API text is hard-wrapped with \r\n; collapse it to normal prose.
export const tidy = (s = '') => String(s).replace(/\s+/g, ' ').trim();

export const truncate = (s = '', n = 150) => {
  const t = tidy(s);
  if (t.length <= n) return t;
  return `${t.slice(0, n).replace(/\s+\S*$/, '')}…`;
};

// Moves regulatory "this is not a government PG degree" sentences out of the body so they can
// be shown once, clearly, as a notice.
const NOTICE = /not a government postgraduate|should not be (represented|considered)|Any clinical exposure/i;
export function splitNotice(text = '') {
  const sentences = tidy(text).split(/(?<=[.!?])\s+/);
  const notice = sentences.filter((s) => NOTICE.test(s));
  const body = sentences.filter((s) => !NOTICE.test(s));
  // A lone lead-in such as "This is a professional skill-development course" belongs to the notice.
  const lead = body.findIndex((s) => /^This is a professional skill-development/i.test(s));
  if (lead !== -1) notice.unshift(...body.splice(lead, 1));
  return { body: body.join(' '), notice: notice.join(' ') };
}

export const slugify = (s = '') =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const courseTitle = (name = '') => tidy(name).replace(/\bPg\b/, 'PG');
