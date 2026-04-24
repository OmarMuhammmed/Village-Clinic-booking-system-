import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, onClick, className = '' }) => {
  const interactiveClass = onClick ? styles.interactive : '';
  
  return (
    <div 
      className={`${styles.card} ${interactiveClass} ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};
