// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const course = (o) => ({ id: 1, name: 'Certificate In Family Medicine', slug: 'certificate-in-family-medicine', type: 'Certificate', image: '1.jpg', description: 'A program for doctors. This is a professional skill-development course and is not a government postgraduate medical degree, NEET-based PG residency, or regular 2-year medical college seat.', fee: 20000, total_fee: 80000, online_cpd: 0, hybrid_cpd: 0, start_date: '2026-06-01', duration: 6, top_courses: 1, category: { id: 2, name: 'Medicine' }, ...o });
const LIST = [course({}), course({ id: 2, name: 'Fellowship in Internal Medicine', slug: 'fellowship-in-internal-medicine', type: 'Fellowship', fee: 50000, total_fee: 150000, online_cpd: 150000, hybrid_cpd: 180000, duration: 12, top_courses: 0 }), course({ id: 3, name: 'Fellowship in Urology', slug: 'fellowship-in-urology', type: 'Fellowship', category: { id: 31, name: 'Urology' } }), course({ id: 4, name: 'Pg Diploma in Tuberculosis', slug: 'pg-diploma-in-tuberculosis', type: 'Pg Diploma', category: null })];
const FAC = [
  { id: 3, name: 'Dr. Poonam Pawadi', qualification: 'MBBS/MD DGO', department: 'Medicine', email: null, phone: null },
  { id: 9, name: 'Dr. Arya', qualification: 'MBBS', department: 'Pulmonary, Medicine,Geriatrics', phone: '999' },
  { id: 10, name: 'Dr. Surgeon', qualification: 'MS', department: 'Surgery' },
  { id: 30, name: 'FACULTY1102', qualification: 'MBBS', department: 'Medicine', email: 'x@y.z', phone: '1' },
];
const DETAIL = { ...LIST[0], department: '["Medicine"]', what_you_learn: [{ id: 1, heading: 'Learning from Industry Leaders', description: 'Learn from seasoned practitioners.' }], highlight: [{ id: 1, highlight: 'Comprehensive 6-Month Program.' }], workshop: { id: 1, title: 'Workshops', subtitle: 'Foundations.', parts: [{ id: 7, title: 'Online Training', subtitle: 'Core concepts.', key_points: [{ id: 46, content: 'Learn from experienced doctors.' }] }] },
  module: [{ id: 5848, module: 'Advanced Foundations of Family Medicine', sessions: [{ id: 1, title: 'Principles and scope of family medicine' }, { id: 2, title: 'Textbook of Family Medicine, 10th Edition' }, { id: 3, title: 'levels.' }, { id: 4, title: 'support@medicalglobalacademy.com' }] }] };

const route = (p) => render(<MemoryRouter initialEntries={[p]}><App /></MemoryRouter>);

beforeEach(() => {
  cleanup();
  window.scrollTo = () => {};
  globalThis.fetch = vi.fn(async (url) => {
    const body = String(url).includes('faculty-list') ? FAC : String(url).includes('course-details') ? DETAIL : LIST;
    return { ok: true, status: 200, json: async () => body };
  });
});

describe('pages render with API-shaped data', () => {
  it('home shows live counts and featured course', async () => {
    route('/');
    expect(await screen.findByText(/Advance your medicine practice without leaving your clinic/)).toBeTruthy();
    await waitFor(() => expect(screen.getAllByText('Certificate In Family Medicine').length).toBeGreaterThan(0));
  });
  it('courses filters by type from the URL', async () => {
    route('/courses?type=Fellowship');
    await screen.findByText('Fellowship in Internal Medicine');
    expect(screen.queryByText('Certificate In Family Medicine')).toBeNull();
    expect(screen.getByText(/1 program/)).toBeTruthy();
  });
  it('shows only Medicine courses and 404s a non-Medicine slug', async () => {
    route('/courses');
    await screen.findByText('Certificate In Family Medicine');
    expect(screen.getByText(/2 programs/)).toBeTruthy();
    expect(screen.queryByText('Fellowship in Urology')).toBeNull();
    expect(screen.queryByText('Pg Diploma in Tuberculosis')).toBeNull();
    cleanup();
    globalThis.fetch = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ ...DETAIL, department: '["Urology"]' }) }));
    route('/courses/fellowship-in-urology');
    expect(await screen.findByText(/flatlined/)).toBeTruthy();
  });
  it('course detail shows notice, fees, and a cleaned curriculum', async () => {
    const { container } = route('/courses/certificate-in-family-medicine');
    await screen.findByRole('heading', { level: 1, name: 'Certificate In Family Medicine' });
    expect(screen.getByText(/Please note/)).toBeTruthy();
    expect(screen.getByText('Comprehensive 6-Month Program.')).toBeTruthy();
    expect(screen.getByText('Advanced Foundations of Family Medicine')).toBeTruthy();
    expect(screen.getByText('Principles and scope of family medicine')).toBeTruthy();
    expect(screen.queryByText('levels.')).toBeNull();
    expect(container.querySelector('.modules').textContent).not.toMatch(/support@medicalglobalacademy|Textbook of/);
    expect(screen.getAllByText('Total program fee').length).toBe(2);
  });
  it('faculty hides test records and never shows phone or email', async () => {
    const { container } = route('/faculty');
    await screen.findByText('Dr. Arya');
    expect(screen.getByText('Dr. Poonam Pawadi')).toBeTruthy();
    expect(screen.queryByText('Dr. Surgeon')).toBeNull();
    expect(screen.queryByText('FACULTY1102')).toBeNull();
    expect(container.textContent).not.toMatch(/999|x@y\.z/);
  });
  it('static, legal and 404 pages render', async () => {
    for (const [p, t] of [['/about', /About Medical Global Academy/], ['/support', /How can we help/], ['/app', /Study on your phone/], ['/privacy-policy', /Privacy policy/], ['/terms-and-conditions', /Terms & conditions/], ['/refund-and-cancellation-policy', /Refund & cancellation policy/], ['/sitemap', /Every page on this website/], ['/nope', /flatlined/]]) {
      cleanup();
      route(p);
      expect((await screen.findAllByText(t)).length).toBeGreaterThan(0);
    }
  });
});
