import React from 'react';
import s from './Card.module.css';

const Card = ({ children, interactive = false, padded = true, className = '', onClick, style }) => (
  <div
    className={[s.card, padded && s['card-padded'], interactive && s['card-interactive'], className]
      .filter(Boolean)
      .join(' ')}
    onClick={onClick}
    style={style}
  >
    {children}
  </div>
);

export default Card;
