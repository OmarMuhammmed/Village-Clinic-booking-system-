import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatsCard, { StatsGrid } from '../components/Stats/StatsCard';
import QueueList from '../components/QueueList/QueueList';
import Button from '../components/Button/Button';
import Input, { FormGroup, SegmentControl } from '../components/Input/Input';
import Card from '../components/Card/Card';

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState(false);

  // Walk-in form
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [wiName, setWiName] = useState('');
  const [wiPhone, setWiPhone] = useState('');
  const [wiType, setWiType] = useState('kashf');
  const [wiLoading, setWiLoading] = useState(false);

  const refreshAll = async (id = selectedId) => {
    if (!id) return;
    const [q, s, d] = await Promise.all([
      api.getQueue(id),
      api.getStats(id),
      api.getDoctor(id),
    ]);
    setQueue(q);
    setStats(s);
    setDoctor(d);
  };

  useEffect(() => {
    api.getDoctors().then((data) => {
      setDoctors(data);
      if (data.length) {
        setSelectedId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    refreshAll(selectedId).finally(() => setLoading(false));

    const interval = setInterval(() => refreshAll(selectedId), 10000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const handleNext = async () => {
    if (!selectedId || !doctor?.sessionActive) return;
    setCalling(true);
    try {
      await api.nextPatient(selectedId);
      await refreshAll();
    } finally {
      setCalling(false);
    }
  };

  const handleTicketAction = async (ticketId, status) => {
    await api.updateTicketStatus(selectedId, ticketId, status);
    await refreshAll();
  };

  const handleToggleAvailable = async () => {
    await api.toggleDoctorStatus(selectedId);
    await refreshAll();
  };

  const handleToggleSession = async () => {
    await api.toggleSession(selectedId, !doctor?.sessionActive);
    await refreshAll();
  };

  const handleWalkIn = async (e) => {
    e.preventDefault();
    if (!wiName.trim()) return;
    setWiLoading(true);
    try {
      await api.addWalkIn(selectedId, { name: wiName.trim(), phone: wiPhone.trim(), type: wiType });
      setWiName('');
      setWiPhone('');
      setWiType('kashf');
      setShowWalkIn(false);
      await refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setWiLoading(false);
    }
  };

  return (
    <div className="page-container page-container--wide animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-6)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h1 className="page-title">🏥 لوحة التحكم</h1>
          <p className="page-subtitle">إدارة الطابور والجلسة</p>
        </div>
        <a href="/" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--clr-text-muted)' }}>
          ← الواجهة العامة
        </a>
      </div>

      {/* Doctor selector */}
      <Card style={{ marginBottom: 'var(--space-5)' }}>
        <FormGroup label="الطبيب / العيادة">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--clr-border)',
              fontSize: 'var(--font-size-md)',
              background: 'var(--clr-surface)',
              fontFamily: 'var(--font-family)',
              color: 'var(--clr-text)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </FormGroup>
      </Card>

      {loading && (
        <div className="loading-page">
          <div className="spinner" />
        </div>
      )}

      {!loading && doctor && (
        <>
          {/* ── Controls ──────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            {/* Session control */}
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-2)' }}>الجلسة</div>
              <div
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: doctor.sessionActive ? 'var(--clr-success)' : 'var(--clr-danger)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {doctor.sessionActive ? '🟢 جارية' : '🔴 مغلقة'}
              </div>
              <Button
                variant={doctor.sessionActive ? 'danger' : 'success'}
                size="sm"
                onClick={handleToggleSession}
              >
                {doctor.sessionActive ? 'إنهاء الجلسة' : 'بدء الجلسة'}
              </Button>
            </Card>

            {/* Availability control */}
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--clr-text-muted)', marginBottom: 'var(--space-2)' }}>حالة الطبيب</div>
              <div
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 700,
                  color: doctor.available ? 'var(--clr-success)' : 'var(--clr-danger)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {doctor.available ? '✅ متاح' : '❌ غير متاح'}
              </div>
              <Button
                variant={doctor.available ? 'warning' : 'success'}
                size="sm"
                onClick={handleToggleAvailable}
              >
                {doctor.available ? 'تعيين: غير متاح' : 'تعيين: متاح'}
              </Button>
            </Card>
          </div>

          {/* ── Next patient button ───────────────────────────── */}
          <Card style={{ marginBottom: 'var(--space-5)', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--clr-text-muted)' }}>
                يُخدَم الآن
              </span>
              <div style={{ fontSize: 'var(--font-size-hero)', fontWeight: 900, color: 'var(--clr-primary)', lineHeight: 1 }}>
                {queue?.currentNumber ?? 0}
              </div>
              {queue?.waitingCount > 0 && (
                <div style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
                  {queue.waitingCount} في الانتظار
                </div>
              )}
            </div>
            <Button
              size="lg"
              loading={calling}
              disabled={!doctor.sessionActive}
              onClick={handleNext}
              variant="primary"
            >
              📣 استدعاء التالي
            </Button>
            {!doctor.sessionActive && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--clr-text-muted)', marginTop: 'var(--space-2)' }}>
                ابدأ الجلسة أولاً
              </p>
            )}
          </Card>

          {/* ── Stats ────────────────────────────────────────── */}
          {stats && (
            <>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                📊 الإحصائيات
              </h2>
              <StatsGrid>
                <StatsCard
                  icon="💰"
                  label="إيراد اليوم الكلي"
                  value={stats.daily.total}
                  unit="ج"
                  accentColor="var(--clr-primary)"
                  full
                />
                <StatsCard
                  icon="🩺"
                  label="كشف اليوم"
                  value={stats.daily.kashf}
                  unit="ج"
                  accentColor="var(--clr-secondary)"
                />
                <StatsCard
                  icon="💬"
                  label="استشارة اليوم"
                  value={stats.daily.istishara}
                  unit="ج"
                  accentColor="var(--clr-warning)"
                />
                <StatsCard
                  icon="📅"
                  label="إيراد الشهر"
                  value={stats.monthly.total}
                  unit="ج"
                  accentColor="var(--clr-success)"
                  full
                />
                <StatsCard
                  icon="👥"
                  label="مرضى اليوم"
                  value={stats.patients.totalToday}
                  accentColor="var(--clr-info)"
                />
                <StatsCard
                  icon="✅"
                  label="تمّت خدمتهم"
                  value={stats.patients.doneToday}
                  accentColor="var(--clr-success)"
                />
              </StatsGrid>
            </>
          )}

          {/* ── Queue list ───────────────────────────────────── */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                📋 قائمة الانتظار
              </h2>
              <button
                onClick={() => setShowWalkIn((v) => !v)}
                style={{
                  background: 'var(--clr-primary-light)',
                  color: 'var(--clr-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-4)',
                  fontFamily: 'var(--font-family)',
                  fontWeight: 700,
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                + إضافة يدوياً
              </button>
            </div>

            {/* Walk-in form */}
            {showWalkIn && (
              <Card style={{ marginBottom: 'var(--space-4)', border: '1.5px solid var(--clr-primary)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--clr-primary)' }}>
                  إضافة مريض من العيادة
                </h3>
                <form onSubmit={handleWalkIn}>
                  <FormGroup label="اسم المريض" htmlFor="wi-name">
                    <Input
                      id="wi-name"
                      placeholder="الاسم الكامل"
                      value={wiName}
                      onChange={(e) => setWiName(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup label="رقم الهاتف (اختياري)" htmlFor="wi-phone">
                    <Input
                      id="wi-phone"
                      placeholder="01xxxxxxxxx"
                      value={wiPhone}
                      onChange={(e) => setWiPhone(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup label="نوع الزيارة">
                    <SegmentControl value={wiType} onChange={setWiType} prices={doctor.prices} />
                  </FormGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <Button type="submit" loading={wiLoading}>
                      إضافة للطابور
                    </Button>
                    <Button variant="ghost" onClick={() => setShowWalkIn(false)} fullWidth>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <QueueList
              tickets={queue?.tickets ?? []}
              currentNumber={queue?.currentNumber ?? 0}
              onAction={handleTicketAction}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
