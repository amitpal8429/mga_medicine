import { Link } from 'react-router-dom';
import CourseImage from './CourseImage';
import Icon from './Icon';
import { duration, inr, startLabel, courseTitle } from '../utils/format';
import { specialtyOf } from '../utils/specialty';

export const typeClass = (t = '') => `tag tag--${t.toLowerCase().replace(/\s+/g, '-')}`;

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} className="ccard">
      <CourseImage course={course} />
      <div className="ccard__body">
        <span className={typeClass(course.type)}>{course.type?.replace('Pg ', 'PG ')}</span>
        <h3>{courseTitle(course.name)}</h3>
        <p className="ccard__sp">{specialtyOf(course.name)}</p>
        <div className="ccard__meta">
          <span><Icon name="clock" size={16} /> {duration(course.duration)}</span>
          <span><Icon name="calendar" size={16} /> {startLabel(course.start_date)}</span>
        </div>
        {inr(course.fee) && (
          <p className="ccard__fee">From <strong>{inr(course.fee)}</strong></p>
        )}
      </div>
    </Link>
  );
}
