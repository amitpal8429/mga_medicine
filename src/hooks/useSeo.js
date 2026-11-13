import { useEffect } from 'react';
import { SITE } from '../config/site';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Sets title, description, canonical, Open Graph and optional JSON-LD for the current page.
export default function useSeo({ title, description, path = '/', jsonLd, noindex = false }) {
  useEffect(() => {
    const full = title ? `${title} | ${SITE.name}` : `${SITE.name} | Fellowships, PG Diplomas & Certificates for Doctors`;
    const url = `${SITE.url}${path}`;
    document.title = full;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;

    let script = document.getElementById('ld-json');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'ld-json';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, noindex, JSON.stringify(jsonLd || null)]);
}
