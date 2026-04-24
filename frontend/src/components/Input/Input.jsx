import React from 'react';
import styles from './Input.module.css';

export const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  ...props 
}) => {
  if (type === 'checkbox') {
    return (
      <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
        <input 
          type="checkbox" 
          id={id} 
          className={styles.checkboxInput}
          {...props} 
        />
        <label htmlFor={id} className={`${styles.label} ${styles.checkboxLabel}`}>
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input 
        type={type} 
        id={id} 
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
