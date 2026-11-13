import { useState } from 'react';
import Icon from './Icon';

export default function ModuleList({ modules }) {
  const [open, setOpen] = useState(() => new Set([0]));
  const toggle = (i) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  const all = open.size === modules.length;
  const total = modules.reduce((a, m) => a + m.sessions.length, 0);

  return (
    <div className="modules">
      <div className="modules__bar">
        <p>{modules.length} modules · {total} sessions</p>
        <button className="link-btn" onClick={() => setOpen(all ? new Set() : new Set(modules.map((_, i) => i)))}>
          {all ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <ol>
        {modules.map((m, i) => {
          const isOpen = open.has(i);
          return (
            <li key={m.id} className={isOpen ? 'is-open' : ''}>
              <button aria-expanded={isOpen} aria-controls={`mod-${m.id}`} onClick={() => toggle(i)}>
                <span className="modules__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="modules__t">{m.title}</span>
                <span className="modules__c">{m.sessions.length}</span>
                <Icon name="chevron" size={20} className="modules__chev" />
              </button>
              {isOpen && (
                <ul id={`mod-${m.id}`}>
                  {m.sessions.map((s, j) => <li key={j}>{s}</li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
