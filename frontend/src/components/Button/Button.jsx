import React from 'react';
import s from './Button.module.css';

/**
 * Button component
 * @param {'primary'|'secondary'|'success'|'danger'|'ghost'|'warning'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} fullWidth - if true, width: 100%
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={[
        s.btn,
        s[`btn-${variant}`],
        s[`btn-${size}`],
        !fullWidth && s['btn-auto'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      style={!fullWidth ? { width: 'auto' } : undefined}
      {...rest}
    >
      {loading && <span className={s['btn-spinner']} />}
      {children}
    </button>
  );
};

export default Button;
