import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import s from "./PatientLanding.module.css";

const FeatureIcon = ({ path }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const FEATURES = [
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "آمن وموثوق",
    desc: "بياناتك محمية بالكامل",
  },
  {
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    title: "حجز فوري",
    desc: "احجز دورك في ثوانٍ",
  },
  {
    icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6v-4m0-4h.01",
    title: "تتبع مباشر",
    desc: "اعرف دورك في أي وقت",
  },
];

const PatientLanding = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDoctors().then((data) => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className={s.loadingPage}>
        <div className={s.spinnerRing} />
        <p className={s.loadingText}>جاري التحميل...</p>
      </div>
    );
  }

  const availableCount = doctors.filter((d) => d.available).length;

  return (
    <div className={s.page} dir="rtl">
      {/* ── Navbar ── */}
      <nav className={s.navbar}>
        <div className={s.navInner}>
          <div className={s.navBrand}>
            <div className={s.navLogo}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span>عيادتي</span>
          </div>
          <Link to="/login" className={s.navLogin}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            دخول الطاقم
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroBg} aria-hidden="true">
          <div className={s.orb1} />
          <div className={s.orb2} />
          <div className={s.grid} />
        </div>
        <div className={s.heroContent}>
          <div className={s.heroBadge}>
            <span className={s.badgeDot} />
            {availableCount} طبيب متاح الآن
          </div>
          <h1 className={s.heroTitle}>
            احجز دورك الطبي
            <br />
            <span className={s.heroAccent}>بدون انتظار</span>
          </h1>
          <p className={s.heroSub}>
            اختار طبيبك، سجّل بياناتك، واستلم رقمك في ثوانٍ. لا طوابير، لا ضياع
            وقت.
          </p>
          <div className={s.heroActions}>
            <a href="#doctors" className={s.ctaPrimary}>
              احجز الآن
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className={s.statsRow}>
        {[
          { value: doctors.length, label: "طبيب متخصص" },
          { value: availableCount, label: "متاح الآن" },
          { value: "24/7", label: "خدمة مستمرة" },
        ].map((s2, i) => (
          <div key={i} className={s.statCard}>
            <span className={s.statValue}>{s2.value}</span>
            <span className={s.statLabel}>{s2.label}</span>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section className={s.features}>
        {FEATURES.map((f) => (
          <div key={f.title} className={s.featureItem}>
            <div className={s.featureIcon}>
              <FeatureIcon path={f.icon} />
            </div>
            <div>
              <div className={s.featureTitle}>{f.title}</div>
              <div className={s.featureDesc}>{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Doctors ── */}
      <section id="doctors" className={s.doctorsSection}>
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>أطباؤنا</h2>
          <p className={s.sectionSub}>اختر طبيبك واحجز دورك مباشرة</p>
        </div>

        <div className={s.doctorsGrid}>
          {doctors.map((doc, i) => (
            <article
              key={doc.id}
              className={`${s.docCard} ${!doc.available ? s.docCardDisabled : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => doc.available && navigate(`/book/${doc.id}`)}>
              <div className={s.docCardTop}>
                <div className={s.docAvatar}>{doc.avatarInitials}</div>
                <div className={s.docMeta}>
                  <div className={s.docName}>{doc.name}</div>
                  <div className={s.docSpecialty}>{doc.specialty}</div>
                </div>
                <span
                  className={`${s.badge} ${doc.available ? s.badgeGreen : s.badgeRed}`}>
                  <span className={s.badgePulse} />
                  {doc.available ? "متاح" : "مشغول"}
                </span>
              </div>

              <div className={s.divider} />

              <div className={s.pricing}>
                <div className={s.priceBox}>
                  <span className={s.priceLabel}>كشف</span>
                  <span className={s.priceAmount}>
                    {doc.prices.kashf} <small>ج</small>
                  </span>
                </div>
                <div className={s.priceSep} />
                <div className={s.priceBox}>
                  <span className={s.priceLabel}>استشارة</span>
                  <span className={s.priceAmount}>
                    {doc.prices.istishara} <small>ج</small>
                  </span>
                </div>
              </div>

              <button
                className={`${s.bookBtn} ${doc.available ? s.bookBtnActive : s.bookBtnDisabled}`}
                disabled={!doc.available}
                onClick={(e) => {
                  e.stopPropagation();
                  if (doc.available) navigate(`/book/${doc.id}`);
                }}>
                {doc.available ? (
                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    احجز دورك الآن
                  </>
                ) : (
                  "غير متاح حالياً"
                )}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <p className={s.footerCopy}>
          © {new Date().getFullYear()} عيادتي — نظام إدارة الطوابير الطبية
        </p>
        <Link to="/login" className={s.footerStaff}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          دخول الطاقم الطبي
        </Link>
      </footer>
    </div>
  );
};

export default PatientLanding;
