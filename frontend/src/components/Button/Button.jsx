import React from 'react';
import styles from './Button.module.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  type = 'button',
  iconOnly = false,
  className = ''
}) => {
  const baseClass = styles.btn;
  const variantClass = styles[variant];
  const disabledClass = disabled ? styles.disabled : '';
  const iconClass = iconOnly ? styles.iconOnly : '';

  return (
    <button 
      type={type}
      className={`${baseClass} ${variantClass} ${disabledClass} ${iconClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
