// FaceTrack AI — Avatar. Initials chip with a brand/per-entity color.

import { getInitials, colorFromString } from '../../utils/helpers';

export default function Avatar({ name = '', color, size = 'md' }) {
  const cls = size === 'sm' ? 'ft-avatar ft-avatar--sm' : size === 'lg' ? 'ft-avatar ft-avatar--lg' : 'ft-avatar';
  return (
    <span className={cls} style={{ background: color || colorFromString(name), color: '#04121a' }}>
      {getInitials(name) || '?'}
    </span>
  );
}
