// One place for every brand / contact / environment setting.
export const SITE = {
  name: 'Medical Global Academy',
  short: 'MGA',
  url: (import.meta.env.VITE_SITE_URL || 'https://www.medicalglobalacademy.com').replace(/\/$/, ''),
  tagline: 'Postgraduate training that fits around your clinic',
  email: 'support@medicalglobalacademy.com',
  phone: '+91 92899 94218',
  phoneRaw: '919289994218',
  playStore: 'https://play.google.com/store/apps/details?id=com.medicalglobalacademy.mga.learning',
  social: {
    Instagram: 'https://www.instagram.com/medicalglobalacademy/',
    YouTube: 'https://www.youtube.com/@medicalglobalacademy',
    Facebook: 'https://www.facebook.com/medicalglobalacademy1/',
    X: 'https://x.com/MGA_Courses',
  },
};

// '/api' is proxied (see vite.config.js, vercel.json, public/_redirects).
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// The API returns only a file name for course images. The confirmed folder is /uploads/course/;
// the others are fallbacks, tried in order. A coloured placeholder is the final fallback.
const ORIGIN = 'https://24x7.medicalglobalacademy.com';
export const IMG_BASE = `${ORIGIN}/uploads/course/`;
export const IMAGE_BASES = [
  import.meta.env.VITE_IMAGE_BASE,
  IMG_BASE,
  `${ORIGIN}/storage/uploads/course/`,
  `${ORIGIN}/storage/courses/`,
  `${ORIGIN}/storage/`,
  `${ORIGIN}/uploads/`,
  `${ORIGIN}/images/`,
].filter(Boolean);

// Strip marketing / contact fragments that leak into some curriculum lists.
export const CLEAN_SESSIONS = true;

// The site shows only Medicine. A course is shown when the API category name is listed here;
// a doctor is shown when one of their (comma-separated) departments matches exactly.
// Courses with no category in the API are not shown. Add their slugs to EXTRA_COURSE_SLUGS to include them.
export const MEDICINE = {
  categories: ['Medicine'],
  departments: ['Medicine'],
  EXTRA_COURSE_SLUGS: [],
};
