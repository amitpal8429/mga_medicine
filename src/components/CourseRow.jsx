import { Link } from 'react-router-dom';
import CourseImage from './CourseImage';
import Icon from './Icon';
import { typeClass } from './CourseCard';
import { duration, inr, startLabel, courseTitle, truncate } from '../utils/format';
import { specialtyOf } from '../utils/specialty';

export default function CourseRow({ course }) {
  return (
    <Link to={`/courses/${course.slug}`} className="crow">
      <CourseImage course={course} className="crow__img" />
      <div className="crow__main">
        <div className="crow__top">
          <span className={typeClass(course.type)}>{course.type?.replace('Pg ', 'PG ')}</span>
          <span className="crow__sp">{specialtyOf(course.name)}</span>
        </div>
        <h3>{courseTitle(course.name)}</h3>
        <p>{truncate(course.description, 140)}</p>
      </div>
      <dl className="crow__facts">
        <div><dt><Icon name="clock" size={15} /> Duration</dt><dd>{duration(course.duration)}</dd></div>
        <div><dt><Icon name="calendar" size={15} /> Start</dt><dd>{startLabel(course.start_date)}</dd></div>
        <div><dt>Fee</dt><dd>{inr(course.fee) ? `from ${inr(course.fee)}` : 'On request'}</dd></div>
      </dl>
    </Link>
  );
}
