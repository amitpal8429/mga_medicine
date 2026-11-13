// The API's category field is incomplete (many nulls) and sometimes wrong, so specialities are
// derived from the course name / faculty department with ordered keyword rules. First match wins.
const RULES = [
  ['Oncology & Haematology', /onco|hemat|haemat|hemto/i],
  ['Pathology', /path/i],
  ['Ophthalmology', /ophth|opthamal|opthamol|vitreo|retina/i],
  ['Psychiatry', /psychi|psychia/i],
  ['Rheumatology', /rheum/i],
  ['Paediatrics', /pedi|paed|child|neonat/i],
  ['Dental & Maxillofacial', /dent|maxillofacial|pedodont|\boral\b/i],
  ['Radiology & Imaging', /radiolog|ultraso|imaging|echocardio/i],
  ['Orthopedics', /ortho|arthro|spine|musculoskeletal/i],
  ['Anaesthesia & Critical Care', /pain|anes|anaes|critical/i],
  ['Obstetrics & Gynaecology', /gyn|gna|obst|reproduct|fertil|embryo|fetal|maternal/i],
  ['Dermatology & Aesthetics', /derm|cosmet/i],
  ['ENT', /otolog|otorhino|\bent\b|head (&|and) neck/i],
  ['Surgery', /surg|laparo|proct|anorectal|minimal|robotic|trauma/i],
  ['Nephrology', /nephro|renal/i],
  ['Urology', /urolog/i],
  ['Cardiology', /cardio/i],
  ['Neurology', /neuro/i],
  ['Endocrinology & Diabetes', /diabet|endocrin/i],
  ['Pulmonology', /pulmon|tubercul|respir|chest/i],
  ['Nutrition', /nutrition|dietetic/i],
  ['General Medicine', /medicine|geriat|general|family|addiction|palliative|internal/i],
];

export const specialtyOf = (text = '') => {
  const hit = RULES.find(([, re]) => re.test(text));
  return hit ? hit[0] : 'Other';
};

// "Pulmonary, Medicine,Geriatrics" -> ['Pulmonology', 'General Medicine']
export const departmentsOf = (dept = '') => {
  const out = new Set();
  String(dept)
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((d) => out.add(specialtyOf(d)));
  if (!out.size || (out.size === 1 && out.has('Other') && /^all$/i.test(String(dept).trim()))) out.clear(), out.add('General Medicine');
  return [...out];
};
