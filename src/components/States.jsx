export function Loading({ rows = 6, variant = 'grid' }) {
  return (
    <div className={`skeleton skeleton--${variant}`} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton__item" />)}
    </div>
  );
}

export function ErrorState({ error, retry }) {
  return (
    <div className="state state--error" role="alert">
      <h3>We couldn’t load this right now</h3>
      <p>{error?.message || 'The server did not respond.'} Check your connection and try again.</p>
      {retry && <button className="btn btn--solid" onClick={retry}>Try again</button>}
    </div>
  );
}

export function Empty({ title = 'Nothing matches yet', children }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}
