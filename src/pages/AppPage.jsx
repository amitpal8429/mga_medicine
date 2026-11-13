import useSeo from '../hooks/useSeo';
import PageHero from '../components/PageHero';
import Icon from '../components/Icon';
import { SITE } from '../config/site';

export default function AppPage() {
  useSeo({ title: 'Mobile app', description: 'Get the Medical Global Academy learning app for Android and study on your phone.', path: '/app' });
  return (
    <>
      <PageHero title="Study on your phone" lead="The MGA learning app keeps your program with you between clinics and shifts." crumbs={[{ label: 'App' }]} />
      <section className="container appp">
        <div>
          <h2>Get the Android app</h2>
          <p className="prose">Install the MGA learning app from Google Play and sign in with the account you use for your program.</p>
          <a className="btn btn--solid" href={SITE.playStore} target="_blank" rel="noreferrer"><Icon name="phoneapp" size={18} /> Get it on Google Play <Icon name="external" size={16} /></a>
          <p className="small">Need help signing in? <a href={`mailto:${SITE.email}`}>Email support</a>.</p>
        </div>
        <div className="phone" aria-hidden="true">
          <div className="phone__screen">
            <span />
            <b>Today</b>
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
    </>
  );
}
