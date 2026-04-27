import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import s from "./PatientTicket.module.css";

const TYPE_LABEL = { kashf: "🩺 كشف", istishara: "💬 استشارة" };

const AnimatedNumber = ({ value, className }) => {
  const [display, setDisplay] = useState(value);
  const [anim, setAnim] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setAnim(true);
      const t = setTimeout(() => {
        setDisplay(value);
        setAnim(false);
        prev.current = value;
      }, 200);
      return () => clearTimeout(t);
    }
    setDisplay(value);
  }, [value]);

  return (
    <span className={`${className} ${anim ? s.statBoxValueAnim : ""}`}>
      {display}
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
      <div className={s.loadingPage}>
        <div className={s.loadingRing} />
        <p className={s.loadingText}>جاري تحميل تذكرتك...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={s.loadingPage}>
        <p style={{ color: "#d9303e", fontWeight: 700 }}>التذكرة غير موجودة</p>
      </div>
    );
  }

  const { ticket, currentNumber, waitingAhead, estimatedWait } = data;
  const isMyTurn = currentNumber === ticket.number;
  const isPassed = currentNumber > ticket.number;
  const isDone = ticket.status === "done";
  const isCancelled = ticket.status === "cancelled";
  const isNoShow = ticket.status === "noshow";

  const statusConfig = (() => {
    if (isDone)
      return {
        bg: "#eafaf4",
        color: "var(--clr-success)",
        msg: "✅ تمت زيارتك بنجاح",
        sub: "شكراً لاستخدامك النظام",
      };
    if (isCancelled)
      return {
        bg: "#fdecea",
        color: "var(--clr-danger)",
        msg: "❌ تم إلغاء تذكرتك",
        sub: "",
      };
    if (isNoShow)
      return {
        bg: "#fff8e6",
        color: "var(--clr-warning)",
        msg: "⚠️ تم تسجيلك كغائب",
        sub: "يرجى مراجعة الاستقبال",
      };
    if (isMyTurn)
      return {
        bg: "#eafaf4",
        color: "var(--clr-success)",
        msg: "🟢 دورك الآن!",
        sub: "تفضل للدخول",
      };
    if (isPassed)
      return {
        bg: "#fff8e6",
        color: "var(--clr-warning)",
        msg: "⚠️ تم تجاوز رقمك",
        sub: "يرجى مراجعة الاستقبال",
      };
    return null;
  })();

  const heroGradient = isMyTurn
    ? "linear-gradient(135deg, var(--clr-success), #0b7d69)"
    : "linear-gradient(135deg, var(--clr-primary), var(--clr-secondary))";

  const heroShadow = isMyTurn
    ? "0 12px 40px rgba(34,160,107,0.35)"
    : "0 12px 40px rgba(26,110,181,0.28)";

  return (
    <div className={s.page} dir="rtl">
      <div className={s.inner}>
        {/* ── Status banner ── */}
        {statusConfig && (
          <div
            className={s.statusBanner}
            style={{ background: statusConfig.bg, color: statusConfig.color }}>
            {statusConfig.msg}
            {statusConfig.sub && (
              <div className={s.statusSub}>{statusConfig.sub}</div>
            )}
          </div>
        )}

        {/* ── Ticket hero ── */}
        <div
          className={s.ticketHero}
          style={{ background: heroGradient, boxShadow: heroShadow }}>
          <div className={s.ticketLabel}>رقمك في الطابور</div>
          <AnimatedNumber value={ticket.number} className={s.ticketNumber} />
          <div className={s.ticketMeta}>
            {ticket.name} &nbsp;·&nbsp; {TYPE_LABEL[ticket.type]}
          </div>
        </div>

        {/* ── Queue stats ── */}
        {!isDone && !isCancelled && !isNoShow && (
          <div className={s.statsRow}>
            <div className={s.statBox}>
              <div className={s.statBoxLabel}>يُخدَم الآن</div>
              <AnimatedNumber
                value={currentNumber}
                className={s.statBoxValue}
              />
            </div>
            <div className={s.statBox}>
              <div className={s.statBoxLabel}>أمامك</div>
              <AnimatedNumber value={waitingAhead} className={s.statBoxValue} />
              <div className={s.statBoxUnit}>شخص</div>
            </div>
            <div className={s.statBox}>
              <div className={s.statBoxLabel}>الانتظار</div>
              <AnimatedNumber
                value={estimatedWait}
                className={s.statBoxValue}
              />
              <div className={s.statBoxUnit}>دقيقة</div>
            </div>
          </div>
        )}

        {/* ── Refresh note ── */}
        {!isDone && !isCancelled && (
          <div className={s.refreshNote}>
            <span className={s.refreshDot} />
            يتحدث تلقائياً كل 5 ثوانٍ
            {lastUpdated && ` · ${lastUpdated.toLocaleTimeString("ar-EG")}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTicket;
