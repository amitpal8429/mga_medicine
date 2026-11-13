import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';
import PageHero from '../components/PageHero';
import Icon from '../components/Icon';
import { SITE } from '../config/site';

const ADDRESS = 'Plot No. 159, Pandav Nagar, Ghaziabad, Uttar Pradesh, 201005, IN';
const HOURS = 'Mon–Sat, 10:00 AM – 6:00 PM IST';

const WA_TEXT = 'Hi, I need help with the Medical Global Academy app.';
const DELETE_MAIL = `mailto:${SITE.email}?subject=${encodeURIComponent('Account Deletion Request')}&body=${encodeURIComponent(
  'Hello Medical Global Academy Support,\n\nI would like to request deletion of my account.\n\nRegistered name:\nRegistered email:\nRegistered phone number:\n\nThank you.'
)}`;

const HELP = [
  ['Login & Account Issues', 'Trouble signing in, wrong credentials or problems with your profile details.'],
  ['Password Reset', 'Forgot your password or unable to reset it? We will help you regain access.'],
  ['Course Enrollment', 'Questions about eligibility, enrolling in a program and batch start dates.'],
  ['Course Access Issues', 'Cannot see your course, modules are locked or content is not loading.'],
  ['Live Class & Video Issues', 'Problems joining live classes, video buffering or audio and playback errors.'],
  ['Payment & Refund Queries', 'Payment not reflected, failed transactions, invoices and refund requests.'],
  ['Certificate Issues', 'Certificate not received, name correction or verification questions.'],
  ['Technical Support', 'App crashes, slow performance, installation or update problems.'],
  ['General App Issues', 'Any other question or feedback about the Medical Global Academy app.'],
];

const FAQ = [
  ['How do I log in?', 'Open the app and sign in with the email address or phone number you registered with, along with your password. If you do not have an account yet, tap Sign up and create one.'],
  ['How do I enroll in a course?', 'Browse the programs in the app, open the one you want and follow the enrolment steps. For questions about eligibility, fees or the next batch, message us on WhatsApp or email support.'],
  ['How do I reset my password?', 'On the login screen, use the forgot password option. If you cannot reset it, contact support with your registered email or phone number and we will help you regain access.'],
  ['How do I contact support?', `Email ${SITE.email}, or message or call us on WhatsApp at ${SITE.phone}. Support hours are ${HOURS}.`],
  ['How do I request a refund?', <>Email us with your name, registered email and program. The full rules are in our <Link to="/refund-and-cancellation-policy">refund and cancellation policy</Link>.</>],
];

const DELETED = [
  'Your account and profile information (name, email address, phone number)',
  'Your login credentials and saved app preferences',
  'Your course progress and activity linked to your account',
];

const RETAINED = [
  'Payment and transaction records, which we may need to keep for accounting, tax and legal compliance',
  'Certificate issuance records, where required to verify certificates already issued',
];

export default function Support() {
  useSeo({
    title: 'Support',
    description: 'Get help with the Medical Global Academy app: account access, enrolment, live classes, payments, certificates and account deletion.',
    path: '/support',
  });

  return (
    <>
      <PageHero
        title="Medical Global Academy Support"
        lead="Need help with the Medical Global Academy app? You are in the right place."
        crumbs={[{ label: 'Support' }]}
      />

      <div className="sp">
        <section className="sp__section">
          <h2>About</h2>
          <p>Medical Global Academy is an online learning platform for doctors and healthcare professionals. Through our Android and iOS app, you can enrol in certificate, fellowship and PG diploma programs, access course content, attend live classes and earn certificates while continuing your clinical work.</p>
          <p>Our support team helps you with account access, enrolment, course and live class issues, payments, certificates and any technical problem you face in the app.</p>
        </section>

        <section className="sp__section" id="contact-information">
          <h2>Contact Information</h2>
          <div className="sp__grid sp__grid--3">
            <a className="sp__card sp__card--link" href={`https://api.whatsapp.com/send?phone=${SITE.phoneRaw}&text=${encodeURIComponent(WA_TEXT)}`} target="_blank" rel="noreferrer">
              <Icon name="chat" size={26} /><b>Chat on WhatsApp</b><span>{SITE.phone}</span>
            </a>
            <a className="sp__card sp__card--link" href={`tel:+${SITE.phoneRaw}`}>
              <Icon name="phone" size={26} /><b>Phone</b><span>{SITE.phone}</span>
            </a>
            <a className="sp__card sp__card--link" href={`mailto:${SITE.email}`}>
              <Icon name="mail" size={26} /><b>Email Support</b><span>{SITE.email}</span>
            </a>
          </div>
          <div className="sp__grid sp__grid--3">
            <div className="sp__card"><b>Office Address</b><span>{ADDRESS}</span></div>
            <div className="sp__card"><b>Support Hours</b><span>{HOURS}</span></div>
            <div className="sp__card"><b>Response Time</b><span>We usually respond within 24–48 business hours.</span></div>
          </div>
        </section>

        <section className="sp__section">
          <h2>How We Can Help</h2>
          <div className="sp__grid sp__grid--auto">
            {HELP.map(([t, p]) => (
              <div className="sp__card" key={t}><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </section>

        <section className="sp__section">
          <h2>Frequently Asked Questions (FAQs)</h2>
          <div className="faq sp__faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}<Icon name="chevron" size={20} /></summary><p>{a}</p></details>
            ))}
          </div>
        </section>

        <section className="sp__section" id="delete-account">
          <h2>Delete Account Request</h2>
          <p>You can request deletion of your Medical Global Academy account at any time by contacting our support team.</p>
          <div className="sp__grid sp__grid--2">
            <div className="sp__card">
              <h3>How to request deletion</h3>
              <ol>
                <li>Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject “Account Deletion Request”, or message us on WhatsApp.</li>
                <li>Include your registered name, email address and phone number so we can verify your account.</li>
                <li>We will confirm your request and complete the deletion within 30 days of verification.</li>
              </ol>
              <a className="btn btn--solid" href={DELETE_MAIL}>Request Account Deletion</a>
            </div>
            <div className="sp__card">
              <h3>Data that will be deleted</h3>
              <ul>{DELETED.map((d) => <li key={d}>{d}</li>)}</ul>
              <h3>Data that may be retained</h3>
              <ul>{RETAINED.map((d) => <li key={d}>{d}</li>)}</ul>
              <p>Retained records are kept only for as long as required by law and are not used for any other purpose.</p>
            </div>
          </div>
        </section>

        <section className="sp__section">
          <div className="sp__grid sp__grid--2">
            <div className="sp__card">
              <h3>Useful Links</h3>
              <ul>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                <li><a href="#contact-information">Contact Us</a></li>
              </ul>
            </div>
            <div className="sp__card">
              <h3>App Information</h3>
              <p><strong>App Name:</strong> Medical Global Academy</p>
              <p><strong>Platform:</strong> Android &amp; iOS</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}