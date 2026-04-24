import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/Button/Button';
import Input, { FormGroup, SegmentControl } from '../components/Input/Input';
import Card from '../components/Card/Card';

const PatientBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('kashf');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.getDoctor(doctorId).then((doc) => {
      setDoctor(doc);
      setLoading(false);
    });
  }, [doctorId]);

  const validate = () => {
    const e = {};
    if (!name.trim())             e.name  = 'الاسم مطلوب';
    if (!phone.trim())            e.phone = 'رقم الهاتف مطلوب';
    else if (phone.replace(/\D/g,'').length < 10) e.phone = 'رقم الهاتف غير صحيح';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validErrors = validate();
    if (Object.keys(validErrors).length) { setErrors(validErrors); return; }

    setSubmitting(true);
    setError('');
    try {
      const ticket = await api.bookTicket(doctorId, { name: name.trim(), phone: phone.trim(), type });
      navigate(`/ticket/${ticket.id}`, { state: { ticket, doctor } });
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء الحجز');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page animate-fade-in">
        <div className="spinner" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state__icon">❌</div>
        <div className="empty-state__text">الطبيب غير موجود</div>
        <Button onClick={() => navigate('/')} fullWidth={false} size="sm" variant="secondary">
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--clr-text-secondary)',
          padding: 'var(--space-4) 0',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontSize: 'var(--font-size-base)',
        }}
      >
        ← رجوع
      </button>

      {/* Doctor summary */}
      <Card style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--clr-primary-light), var(--clr-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 'var(--font-size-base)',
              flexShrink: 0,
            }}
          >
            {doctor.avatarInitials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{doctor.name}</div>
            <div style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {doctor.specialty}
            </div>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card>
        <h2
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 700,
            marginBottom: 'var(--space-5)',
            color: 'var(--clr-text)',
          }}
        >
          📋 بيانات الحجز
        </h2>

        {error && (
          <div
            style={{
              background: 'var(--clr-danger-bg)',
              color: 'var(--clr-danger)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-4)',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup label="اسم المريض" htmlFor="patient-name" error={errors.name}>
            <Input
              id="patient-name"
              placeholder="أدخل الاسم الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          </FormGroup>

          <FormGroup label="رقم الهاتف" htmlFor="patient-phone" error={errors.phone}>
            <Input
              id="patient-phone"
              type="tel"
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              inputMode="numeric"
            />
          </FormGroup>

          <FormGroup label="نوع الزيارة">
            <SegmentControl value={type} onChange={setType} prices={doctor.prices} />
          </FormGroup>

          {/* Price preview */}
          <div
            style={{
              background: 'var(--clr-primary-light)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              رسوم الزيارة
            </span>
            <span style={{ fontWeight: 900, fontSize: 'var(--font-size-xl)', color: 'var(--clr-primary)' }}>
              {doctor.prices[type]} ج
            </span>
          </div>

          <Button type="submit" size="lg" loading={submitting}>
            تأكيد الحجز واستلام التذكرة
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PatientBooking;
