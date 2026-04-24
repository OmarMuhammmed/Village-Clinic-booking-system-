import React from 'react';
import s from './Input.module.css';

export const FormGroup = ({ label, htmlFor, error, children }) => (
  <div className={s.formGroup}>
    {label && (
      <label className={s.label} htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
    {error && <span className={s.errorText}>{error}</span>}
  </div>
);

const Input = React.forwardRef(({ error, className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={[s.input, error && s.inputError, className].filter(Boolean).join(' ')}
    {...props}
  />
));
Input.displayName = 'Input';

export const Select = ({ children, error, className = '', ...props }) => (
  <select className={[s.select, error && s.inputError, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </select>
);

/**
 * SegmentControl
 * Renders a 2-option (kashf / istishara) selector with prices.
 */
export const SegmentControl = ({ value, onChange, prices = {} }) => {
  const options = [
    { key: 'kashf',     label: 'كشف',      emoji: '🩺' },
    { key: 'istishara', label: 'استشارة',  emoji: '💬' },
  ];

  return (
    <div className={s.segmentGroup}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          className={[s.segmentBtn, value === opt.key && s.segmentBtnActive]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(opt.key)}
        >
          <span className={s.segmentLabel}>{opt.emoji} {opt.label}</span>
          {prices[opt.key] != null && (
            <span className={s.segmentPrice}>{prices[opt.key]} جنيه</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Input;
