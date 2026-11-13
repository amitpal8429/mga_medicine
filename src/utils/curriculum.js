import { CLEAN_SESSIONS } from '../config/site';
import { tidy } from './format';

// Some modules end with a marketing blurb split into fragments (contact details, accreditation text,
// book subtitles). These rules remove it without touching real session titles.
const JUNK = /(@|https?:|www\.|\+91|CPDCPD|ACTD|Contact Us|ACCRIDIATION|playgoogle|page-posts|^MEDICAL GLOBAL$|^ACADEMY$)/i;
const TAIL_START = /(Textbook of|Edition$|International Accreditation|Pan-India Clinical Attachment)/i;

export function cleanSessions(sessions = []) {
  const titles = sessions.map((s) => tidy(s.title)).filter(Boolean);
  if (!CLEAN_SESSIONS) return titles;
  const tail = titles.findIndex((t) => TAIL_START.test(t));
  return (tail === -1 ? titles : titles.slice(0, tail)).filter(
    (t) => t.length > 3 && !JUNK.test(t) && !/^[a-z]/.test(t),
  );
}

export function cleanModules(modules = []) {
  return modules
    .map((m) => ({ id: m.id, title: tidy(m.module), sessions: cleanSessions(m.sessions) }))
    .filter((m) => m.title);
}
