import React from 'react';
import { useNavigate } from 'react-router-dom';
import s from './DoctorCard.module.css';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { id, name, specialty, available, prices, avatarInitials } = doctor;

  const handleBook = (e) => {
    e.stopPropagation();
    if (available) navigate(`/book/${id}`);
  };

  return (
    <div className={[s.card, !available && s['card-unavailable']].filter(Boolean).join(' ')}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.avatar}>{avatarInitials}</div>
        <div className={s.info}>
          <div className={s.name}>{name}</div>
          <div className={s.specialty}>{specialty}</div>
        </div>
        <span className={`badge ${available ? 'badge-success' : 'badge-danger'}`}>
          <span className={`status-dot ${available ? 'status-dot--green' : 'status-dot--red'}`} />
          {available ? 'متاح' : 'غير متاح'}
        </span>
      </div>

      {/* Prices */}
      <div className={s.prices}>
        <div className={s.priceItem}>
          <span className={s.priceLabel}>🩺 كشف</span>
          <span className={s.priceValue}>{prices.kashf} ج</span>
        </div>
        <div className={s.priceItem}>
          <span className={s.priceLabel}>💬 استشارة</span>
          <span className={s.priceValue}>{prices.istishara} ج</span>
        </div>
      </div>

      {/* Book button */}
      <div className={s.footer}>
        <button
          className={[s.bookBtn, !available && s['bookBtn-disabled']].filter(Boolean).join(' ')}
          onClick={handleBook}
          disabled={!available}
        >
          {available ? '📋 احجز دورك' : 'غير متاح الآن'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
