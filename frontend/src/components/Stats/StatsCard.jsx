import React from 'react';
import s from './StatsCard.module.css';

export const StatsGrid = ({ children }) => (
  <div className={s.grid}>{children}</div>
);

const StatsCard = ({ icon, label, value, unit, accentColor, full = false }) => {
  const isElement = React.isValidElement(icon);

  return (
    <div
      className={[s.stat, full && s.full].filter(Boolean).join(' ')}
      style={accentColor ? { '--accent-color': accentColor } : undefined}
    >
      {icon && (
        <div className={s.iconCircle}>
          {isElement ? icon : <span className={s.iconEmoji}>{icon}</span>}
        </div>
      )}
      <div className={s.info}>
        <div className={s.label}>{label}</div>
        <div className={s.value}>
          {value}
          {unit && <span className={s.unit}>{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
