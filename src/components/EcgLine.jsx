// A single heartbeat trace that draws itself once on load (disabled for reduced-motion users in CSS).
export default function EcgLine({ className = '' }) {
  return (
    <svg className={`ecg ${className}`} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      <path
        pathLength="1"
        d="M0 70H260l14-6 12 6h40l10-8 8 8h48l12-12 6 12h40l18-58 20 100 20-64 14 22h60l12-8 12 8h90l12-7 12 7h120l14-6 12 6h334"
      />
    </svg>
  );
}
