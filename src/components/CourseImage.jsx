import { useState } from 'react';
import { IMAGE_BASES } from '../config/site';

// The API gives only a file name, so we walk through IMAGE_BASES until one loads, remember it,
// and fall back to a coloured placeholder if none do.
let workingBase = 0;
const HUES = [188, 205, 160, 22, 340, 255];

export default function CourseImage({ course, className = '' }) {
  const [idx, setIdx] = useState(workingBase);
  const failed = !course.image || idx >= IMAGE_BASES.length;
  const hue = HUES[course.id % HUES.length];

  if (failed) {
    return (
      <div
        className={`cimg cimg--fallback ${className}`}
        style={{ '--h': hue }}
        role="img"
        aria-label={course.name}
      >
        <span>{course.type?.replace('Pg ', 'PG ')}</span>
      </div>
    );
  }
  return (
    <img
      className={`cimg ${className}`}
      src={/^https?:\/\//i.test(course.image) ? course.image : `${IMAGE_BASES[idx]}${encodeURIComponent(course.image)}`}
      alt=""
      loading="lazy"
      onLoad={() => { workingBase = idx; }}
      onError={() => setIdx(idx + 1)}
    />
  );
}
