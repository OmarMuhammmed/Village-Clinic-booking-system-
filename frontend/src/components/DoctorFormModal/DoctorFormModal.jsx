import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Pencil } from 'lucide-react';
import Button from '../Button/Button';
import Input, { FormGroup } from '../Input/Input';
import s from './DoctorFormModal.module.css';

const DoctorFormModal = ({ isOpen, onClose, onSubmit, loading, doctor }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [kashfPrice, setKashfPrice] = useState('');
  const [ishtisharaPrice, setIshtisharaPrice] = useState('');
  const [avatarInitials, setAvatarInitials] = useState('');
  const [available, setAvailable] = useState(true);
  const [errors, setErrors] = useState({});

  const isEdit = !!doctor;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (doctor) {
        setName(doctor.name);
        setSpecialty(doctor.specialty);
        setKashfPrice(String(doctor.prices.kashf));
        setIshtisharaPrice(String(doctor.prices.istishara));
        setAvatarInitials(doctor.avatarInitials);
        setAvailable(doctor.available);
      }
    } else {
      document.body.style.overflow = '';
      setName('');
      setSpecialty('');
      setKashfPrice('');
      setIshtisharaPrice('');
      setAvatarInitials('');
      setAvailable(true);
      setErrors({});
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, doctor]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'اسم الطبيب مطلوب';
    if (!specialty.trim()) e.specialty = 'التخصص مطلوب';
    if (!kashfPrice || Number(kashfPrice) <= 0) e.kashfPrice = 'سعر الكشف مطلوب';
    if (!ishtisharaPrice || Number(ishtisharaPrice) <= 0) e.ishtisharaPrice = 'سعر الاستشارة مطلوب';
    if (!avatarInitials.trim()) e.avatarInitials = 'الأحرف الأولى مطلوبة';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validErrors = validate();
    if (Object.keys(validErrors).length) {
      setErrors(validErrors);
      return;
    }
    setErrors({});
    onSubmit({
      name: name.trim(),
      specialty: specialty.trim(),
      prices: { kashf: Number(kashfPrice), istishara: Number(ishtisharaPrice) },
      avatarInitials: avatarInitials.trim(),
      available,
    });
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.panel} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <div className={s.headerTitle}>
            {isEdit ? <Pencil size={20} /> : <Stethoscope size={20} />}
            <span>{isEdit ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}</span>
          </div>
          <button className={s.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={s.body} onSubmit={handleSubmit}>
          <FormGroup label="اسم الطبيب" htmlFor="doc-name" error={errors.name}>
            <Input
              id="doc-name"
              placeholder="د. أحمد محمود"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="التخصص" htmlFor="doc-specialty" error={errors.specialty}>
            <Input
              id="doc-specialty"
              placeholder="باطنة وجهاز هضمي"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </FormGroup>

          <div className={s.row}>
            <FormGroup label="سعر الكشف (ج)" htmlFor="doc-kashf" error={errors.kashfPrice}>
              <Input
                id="doc-kashf"
                type="number"
                inputMode="numeric"
                placeholder="80"
                value={kashfPrice}
                onChange={(e) => setKashfPrice(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="سعر الاستشارة (ج)" htmlFor="doc-istishara" error={errors.ishtisharaPrice}>
              <Input
                id="doc-istishara"
                type="number"
                inputMode="numeric"
                placeholder="40"
                value={ishtisharaPrice}
                onChange={(e) => setIshtisharaPrice(e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup label="الأحرف الأولى (للصورة الرمزية)" htmlFor="doc-initials" error={errors.avatarInitials}>
            <Input
              id="doc-initials"
              placeholder="أم"
              value={avatarInitials}
              onChange={(e) => setAvatarInitials(e.target.value)}
              maxLength={3}
            />
          </FormGroup>

          <FormGroup label="الحالة">
            <div className={s.toggleGroup}>
              <button
                type="button"
                className={`${s.toggleBtn} ${available ? s.toggleBtnActive : ''}`}
                onClick={() => setAvailable(true)}
              >
                متاح
              </button>
              <button
                type="button"
                className={`${s.toggleBtn} ${!available ? s.toggleBtnActive : ''}`}
                onClick={() => setAvailable(false)}
              >
                غير متاح
              </button>
            </div>
          </FormGroup>

          <div className={s.actions}>
            <Button type="submit" loading={loading}>
              {isEdit ? <Pencil size={18} /> : <Stethoscope size={18} />}
              {isEdit ? 'حفظ التعديلات' : 'إضافة الطبيب'}
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal;
