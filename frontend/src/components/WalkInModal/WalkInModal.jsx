import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import Button from '../Button/Button';
import Input, { FormGroup, SegmentControl } from '../Input/Input';
import s from './WalkInModal.module.css';

const WalkInModal = ({ isOpen, onClose, onSubmit, loading, prices }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('kashf');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setName('');
      setPhone('');
      setType('kashf');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), phone: phone.trim(), type });
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.panel} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <div className={s.headerTitle}>
            <UserPlus size={20} />
            <span>إضافة مريض يدوياً</span>
          </div>
          <button className={s.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={s.body} onSubmit={handleSubmit}>
          <FormGroup label="اسم المريض" htmlFor="wi-name">
            <Input
              id="wi-name"
              placeholder="الاسم الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup label="رقم الهاتف (اختياري)" htmlFor="wi-phone">
            <Input
              id="wi-phone"
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="نوع الزيارة">
            <SegmentControl value={type} onChange={setType} prices={prices} />
          </FormGroup>

          <div className={s.actions}>
            <Button type="submit" loading={loading}>
              <UserPlus size={18} />
              إضافة للطابور
            </Button>
            <Button variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkInModal;
