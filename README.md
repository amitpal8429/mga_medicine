# Medical Global Academy: React website

React 18 + Vite + React Router. Uses all three Academy APIs:

| API | Used for |
| --- | --- |
| `/api/course-list` | Home, Courses, Sitemap page, `sitemap.xml` |
| `/api/course-details/:slug` | Course detail page |
| `/api/faculty-list` | Faculty page, Home preview, About stats |

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + page render tests
npm run build      # also regenerates public/sitemap.xml
```

## Structure

```
src/
  config/site.js        brand, contacts, API base, image folders
  api/client.js         fetch + cache; hides test faculty, drops phone/email
  hooks/                useAsync, useSeo (title/meta/canonical/JSON-LD), useScrollSpy
  utils/                format.js, specialty.js, curriculum.js (+ tests)
  components/           Header, Footer, Layout, cards, ModuleList, EcgLine, states
  pages/                Home, Courses, CourseDetail, Faculty, About, Support,
                        AppPage, LegalPage, SitemapPage, NotFound
  data/legal.js         Privacy, Terms, Refund text (DRAFT: edit before launch)
  styles/               base, layout, components, pages
scripts/generate-sitemap.mjs   builds public/sitemap.xml from the API
public/                 robots.txt, sitemap.xml, favicon.svg, _redirects
vercel.json             /api proxy + SPA fallback (Vercel)
```

## Routes

`/`, `/courses`, `/courses/:slug`, `/faculty`, `/about`, `/support`, `/app`,
`/privacy-policy`, `/terms-and-conditions`, `/refund-and-cancellation-policy`, `/sitemap`
and `/sitemap.xml` (static file).

## Before you deploy

1. **Site URL.** Set `VITE_SITE_URL` (see `.env.example`) and update the `Sitemap:` line in `public/robots.txt`.
2. **API and CORS.** The site calls `/api/...` and the host forwards it to the Academy server
   (Vite proxy in dev, `vercel.json` on Vercel, `public/_redirects` on Netlify/Cloudflare).
   On any other static host, add the same rewrite, or set `VITE_API_BASE` if the API allows your domain.
3. **Course images.** Loaded from `https://24x7.medicalglobalacademy.com/uploads/course/<file>` (`IMG_BASE` in `src/config/site.js`), with fallback folders and a coloured placeholder.
4. **Legal pages.** `src/data/legal.js` is draft text. Have it reviewed and match the refund terms to your real policy.
5. **SEO.** This is a client-rendered app. Meta tags and JSON-LD are set per page in the browser. For best
   indexing of course pages, add prerendering (for example `vite-plugin-ssr` or a prerender service).

## Notes on the data

- **Medicine only.** Courses are shown only when the API category is `Medicine`; doctors only when one of their
  comma-separated departments is exactly `Medicine`. Rules live in `MEDICINE` in `src/config/site.js`
  (also applied in `scripts/generate-sitemap.mjs`). A non-Medicine course URL shows the 404 page.
  Courses with no category in the API are excluded; add their slugs to `EXTRA_COURSE_SLUGS` to include them.

- Faculty records named like `FACULTY1102` are treated as test data and hidden.
- Faculty phone numbers and emails come back from the API but are never rendered.
- Specialities are derived from course names and faculty departments (`src/utils/specialty.js`), because the API
  category is missing on many courses and wrong on some (for example paediatric fellowships filed under Orthopedic).
- Some curriculum lists end with stray text (contact details, accreditation fragments). It is removed;
  set `CLEAN_SESSIONS = false` in `src/config/site.js` to turn that off.
- The "not a government degree" sentences in course descriptions are shown once as a notice box.
- Fee labels are inferred: `fee` = Starting fee, `total_fee` = Total program fee, `online_cpd` / `hybrid_cpd` = Online / Hybrid + CPD.
  Change them in `src/pages/CourseDetail.jsx` if they mean something else.
- Past start dates display as "Rolling enrolment".
