import React from 'react';
import s from './StatsCard.module.css';

/**
 * StatsGrid wrapper
 */
export const StatsGrid = ({ children }) => (
  <div className={s.grid}>{children}</div>
);

/**
 * Individual stat card
 * @param {string} icon - emoji or icon character
 * @param {string} label
 * @param {string|number} value
 * @param {string} unit - currency or unit label
 * @param {string} accentColor - CSS color for bottom border
 * @param {boolean} full - span full width
 */
const StatsCard = ({ icon, label, value, unit, accentColor, full = false }) => (
  <div
    className={[s.stat, full && s.full].filter(Boolean).join(' ')}
    style={accentColor ? { '--accent-color': accentColor } : undefined}
  >
    {icon && <span className={s.icon}>{icon}</span>}
    <div className={s.label}>{label}</div>
    <div className={s.value}>
      {value}
      {unit && <span className={s.unit}>{unit}</span>}
    </div>
  </div>
);

export default StatsCard;
