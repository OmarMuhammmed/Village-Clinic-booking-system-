import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const TYPE_LABEL = { kashf: '🩺 كشف', istishara: '💬 استشارة' };

// Animated number with pop effect
const AnimatedNumber = ({ value, style = {} }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setAnimating(true);
      const t = setTimeout(() => {
        setDisplayValue(value);
        setAnimating(false);
        prevValueRef.current = value;
      }, 200);
      return () => clearTimeout(t);
    }
    setDisplayValue(value);
  }, [value]);

  return (
    <span
      style={{
        display: 'inline-block',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        transform: animating ? 'scale(1.25)' : 'scale(1)',
        opacity: animating ? 0.6 : 1,
        ...style,
      }}
    >
      {displayValue}
    </span>
  );
};

const PatientTicket = () => {
  const { ticketId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStatus = async () => {
    const result = await api.getTicket(ticketId);
    if (result) {
      setData(result);
      setLastUpdated(new Date());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [ticketId]);

  if (loading) {
    return (
      <div className="loading-page animate-fade-in">
        <div className="spinner" />
        <p>جاري تحميل تذكرتك...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state__icon">❓</div>
        <div className="empty-state__text">التذكرة غير موجودة</div>
      </div>
    );
  }

  const { ticket, currentNumber, waitingAhead, estimatedWait } = data;
  const isMyTurn  = currentNumber === ticket.number;
  const isPassed  = currentNumber > ticket.number;
  const isDone    = ticket.status === 'done';
  const isCancelled = ticket.status === 'cancelled';
  const isNoShow  = ticket.status === 'noshow';

  // ── Status configurations ─────────────────────────────────────
  const statusConfig = (() => {
    if (isDone)        return { bg: 'var(--clr-success-bg)', color: 'var(--clr-success)', msg: '✅ تمت زيارتك بنجاح', sub: 'شكراً لاستخدامك النظام' };
    if (isCancelled)   return { bg: 'var(--clr-danger-bg)',  color: 'var(--clr-danger)',  msg: '❌ تم إلغاء تذكرتك', sub: '' };
    if (isNoShow)      return { bg: 'var(--clr-warning-bg)', color: 'var(--clr-warning)', msg: '⚠️ تم تسجيلك كغائب', sub: 'يرجى مراجعة الاستقبال' };
    if (isMyTurn)      return { bg: '#e8fff5', color: 'var(--clr-success)', msg: '🟢 دورك الآن!', sub: 'تفضل للدخول' };
    if (isPassed)      return { bg: 'var(--clr-warning-bg)', color: 'var(--clr-warning)', msg: '⚠️ تم تجاوز رقمك', sub: 'يرجى مراجعة الاستقبال' };
    return null;
  })();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header text-center">
        <h1 className="page-title">تذكرتك</h1>
        <p className="page-subtitle">
          {lastUpdated && `آخر تحديث: ${lastUpdated.toLocaleTimeString('ar-EG')}`}
        </p>
      </div>

      {/* Status banner */}
      {statusConfig && (
        <div
          className="animate-fade-scale"
          style={{
            background: statusConfig.bg,
            color: statusConfig.color,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 'var(--font-size-md)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {statusConfig.msg}
          {statusConfig.sub && (
            <div style={{ fontWeight: 400, fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
              {statusConfig.sub}
            </div>
          )}
        </div>
      )}

      {/* Ticket number — hero */}
      <div
        style={{
          background: isMyTurn
            ? 'linear-gradient(135deg, var(--clr-success), var(--clr-secondary-dark))'
            : 'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-dark))',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-10) var(--space-8)',
          textAlign: 'center',
          color: 'white',
          marginBottom: 'var(--space-5)',
          boxShadow: isMyTurn ? '0 8px 30px rgba(34,160,107,0.35)' : '0 8px 30px rgba(26,110,181,0.25)',
          animation: isMyTurn ? 'glowPulse 2s ease infinite' : 'none',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8, marginBottom: 'var(--space-2)' }}>
          رقمك في الطابور
        </div>
        <AnimatedNumber
          value={ticket.number}
          style={{
            fontSize: 'var(--font-size-hero)',
            fontWeight: 900,
            lineHeight: 1,
          }}
        />
        <div style={{ marginTop: 'var(--space-3)', opacity: 0.85, fontSize: 'var(--font-size-sm)' }}>
          {ticket.name} &nbsp;·&nbsp; {TYPE_LABEL[ticket.type]}
        </div>
      </div>

      {/* Queue status cards */}
      {!isDone && !isCancelled && !isNoShow && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {/* Current serving */}
          <div
            style={{
              background: 'var(--clr-surface)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4) var(--space-3)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-1)' }}>
              يُخدَم الآن
            </div>
            <AnimatedNumber
              value={currentNumber}
              style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--clr-primary)' }}
            />
          </div>

          {/* Ahead */}
          <div
            style={{
              background: 'var(--clr-surface)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4) var(--space-3)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-1)' }}>
              أمامك
            </div>
            <AnimatedNumber
              value={waitingAhead}
              style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--clr-text)' }}
            />
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)' }}>شخص</div>
          </div>

          {/* Wait time */}
          <div
            style={{
              background: 'var(--clr-surface)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4) var(--space-3)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-1)' }}>
              الانتظار
            </div>
            <AnimatedNumber
              value={estimatedWait}
              style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--clr-text)' }}
            />
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)' }}>دقيقة</div>
          </div>
        </div>
      )}

      {/* Auto-refresh note */}
      {!isDone && !isCancelled && (
        <p className="text-center text-muted text-sm">
          🔄 يتحدث تلقائياً كل 5 ثوانٍ
        </p>
      )}

      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 8px 30px rgba(26,110,181,0.25); }
          50%       { box-shadow: 0 8px 40px rgba(26,110,181,0.45); }
        }
      `}</style>
    </div>
  );
};

export default PatientTicket;
