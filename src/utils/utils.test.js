import { describe, it, expect } from 'vitest';
import { inr, duration, startLabel, splitNotice, truncate, tidy } from './format';
import { specialtyOf, departmentsOf } from './specialty';
import { cleanSessions } from './curriculum';

describe('format', () => {
  it('formats rupees in Indian grouping and hides zero', () => {
    expect(inr(150000)).toMatch(/1,50,000/);
    expect(inr(0)).toBeNull();
  });
  it('labels duration', () => {
    expect(duration(12)).toBe('12 months');
    expect(duration(1)).toBe('1 month');
    expect(duration(0)).toBe('Flexible');
  });
  it('shows rolling enrolment for past dates and a month for future ones', () => {
    const now = new Date('2026-10-29');
    expect(startLabel('2026-07-01', now)).toBe('Rolling enrolment');
    expect(startLabel('2026-12-01', now)).toMatch(/Dec/);
  });
  it('collapses hard-wrapped API text', () => {
    expect(tidy('a\r\nb   c')).toBe('a b c');
    expect(truncate('word '.repeat(100), 30).endsWith('…')).toBe(true);
  });
  it('moves the not-a-government-degree notice out of the body', () => {
    const t = 'Great program. This is a professional skill-development course and is not a government postgraduate medical degree, NEET-based PG residency, or regular 2-year medical college seat. Learn more.';
    const { body, notice } = splitNotice(t);
    expect(body).toBe('Great program. Learn more.');
    expect(notice).toMatch(/not a government postgraduate/);
  });
});

describe('specialty', () => {
  it('maps course names to specialities', () => {
    expect(specialtyOf('Fellowship in Interventional Radiology')).toBe('Radiology & Imaging');
    expect(specialtyOf('Fellowship in Pediatric Neurology')).toBe('Paediatrics');
    expect(specialtyOf('Pg Diploma in Embryology')).toBe('Obstetrics & Gynaecology');
    expect(specialtyOf('Certificate In Family Medicine')).toBe('General Medicine');
  });
  it('merges messy faculty departments', () => {
    expect(departmentsOf('PATHOLOGY')).toEqual(['Pathology']);
    expect(departmentsOf('Opthamalogy')).toEqual(['Ophthalmology']);
    expect(departmentsOf('Pulmonary, Medicine,Geriatrics')).toEqual(['Pulmonology', 'General Medicine']);
    expect(departmentsOf('All')).toEqual(['General Medicine']);
  });
});

describe('curriculum cleanup', () => {
  const s = (...t) => t.map((title, id) => ({ id, title }));
  it('drops stray marketing fragments but keeps real sessions', () => {
    const out = cleanSessions(s('Final integrated case assessment', 'Textbook of Family Medicine, 10th Edition', 'levels.', 'support@medicalglobalacademy.com'));
    expect(out).toEqual(['Final integrated case assessment']);
  });
  it('removes contact text even without a textbook marker', () => {
    expect(cleanSessions(s('Wound care', 'Contact Us www.example.com', 'plans.'))).toEqual(['Wound care']);
  });
});
