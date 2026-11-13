import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function SectionHead({ title, lead, to, action }) {
  return (
    <div className="shead">
      <div>
        <h2>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {to && (
        <Link to={to} className="link-arrow">
          {action} <Icon name="arrow" size={18} />
        </Link>
      )}
    </div>
  );
}
