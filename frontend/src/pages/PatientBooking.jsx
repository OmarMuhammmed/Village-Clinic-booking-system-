import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import s from "./PatientBooking.module.css";

const VISIT_TYPES = [
  { key: "kashf", label: "كشف", icon: "🩺" },
  { key: "istishara", label: "استشارة", icon: "💬" },
];

const PatientBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("kashf");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.getDoctor(doctorId).then((doc) => {
      setDoctor(doc);
      setLoading(false);
    });
  }, [doctorId]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (phone.replace(/\D/g, "").length < 10)
      e.phone = "رقم الهاتف غير صحيح";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validErrors = validate();
    if (Object.keys(validErrors).length) {
      setErrors(validErrors);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const ticket = await api.bookTicket(doctorId, {
        name: name.trim(),
        phone: phone.trim(),
        type,
      });
      navigate(`/ticket/${ticket.id}`, { state: { ticket, doctor } });
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={s.loadingPage}>
        <div className={s.loadingRing} />
        <p
          style={{
            color: "#8e9eb5",
            fontFamily: "Cairo, sans-serif",
            fontWeight: 600,
          }}>
          جاري التحميل...
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={s.loadingPage}>
        <p
          style={{
            color: "#d9303e",
            fontFamily: "Cairo, sans-serif",
            fontWeight: 700,
          }}>
          الطبيب غير موجود
        </p>
        <button className={s.back} onClick={() => navigate("/")}>
          ← العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className={s.page} dir="rtl">
      <button className={s.back} onClick={() => navigate("/")}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5">
          <path d="M19 12H5M12 5l7 7-7 7" />
        </svg>
        العودة للرئيسية
      </button>

      <div className={s.card}>
        {/* ── Doctor header ── */}
        <div className={s.docHeader}>
          <div className={s.docAvatar}>{doctor.avatarInitials}</div>
          <div className={s.docInfo}>
            <div className={s.docName}>{doctor.name}</div>
            <div className={s.docSpec}>{doctor.specialty}</div>
          </div>
          <span className={s.docBadge}>
            <span className={s.docBadgeDot} />
            متاح
          </span>
        </div>

        {/* ── Form ── */}
        <div className={s.formBody}>
          <div className={s.formTitle}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--clr-primary)"
              strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
            بيانات الحجز
          </div>

          {error && (
            <div className={s.errorBanner}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className={s.field}>
              <label className={s.label} htmlFor="patient-name">
                اسم المريض
              </label>
              <input
                id="patient-name"
                className={`${s.input} ${errors.name ? s.inputError : ""}`}
                placeholder="أدخل الاسم الكامل"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: "" }));
                }}
              />
              {errors.name && (
                <span className={s.fieldError}>{errors.name}</span>
              )}
            </div>

            {/* Phone */}
            <div className={s.field}>
              <label className={s.label} htmlFor="patient-phone">
                رقم الهاتف
              </label>
              <input
                id="patient-phone"
                type="tel"
                inputMode="numeric"
                className={`${s.input} ${errors.phone ? s.inputError : ""}`}
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((p) => ({ ...p, phone: "" }));
                }}
              />
              {errors.phone && (
                <span className={s.fieldError}>{errors.phone}</span>
              )}
            </div>

            {/* Visit type */}
            <div className={s.field}>
              <label className={s.label}>نوع الزيارة</label>
              <div className={s.typeGrid}>
                {VISIT_TYPES.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`${s.typeBtn} ${type === opt.key ? s.typeBtnActive : ""}`}
                    onClick={() => setType(opt.key)}>
                    <span className={s.typeBtnIcon}>{opt.icon}</span>
                    <span className={s.typeBtnLabel}>{opt.label}</span>
                    <span className={s.typeBtnPrice}>
                      {doctor.prices[opt.key]} جنيه
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className={s.priceSummary}>
              <span className={s.priceLabel}>رسوم الزيارة</span>
              <span className={s.priceValue}>
                {doctor.prices[type]} <small>ج</small>
              </span>
            </div>

            <button type="submit" className={s.submitBtn} disabled={submitting}>
              {submitting ? (
                <span className={s.spinner} />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {submitting ? "جاري الحجز..." : "تأكيد الحجز واستلام التذكرة"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;
