import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard/DoctorCard';

const PatientLanding = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDoctors().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-page animate-fade-in">
        <div className="spinner" />
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="page-header text-center">
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🏥</div>
        <h1 className="page-title">عيادة نظام الطابور</h1>
        <p className="page-subtitle">اختر طبيبك واحجز دورك في ثوانٍ</p>
      </div>

      {/* Doctor list */}
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>

      {/* Dashboard link */}
      <div className="text-center mt-8" style={{ paddingBottom: 'var(--space-8)' }}>
        <a
          href="/dashboard"
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--clr-text-muted)',
            textDecoration: 'underline',
            opacity: 0.7,
          }}
        >
          دخول لوحة التحكم (الطاقم الطبي)
        </a>
      </div>
    </div>
  );
};

export default PatientLanding;
