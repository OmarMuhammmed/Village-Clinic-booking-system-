import React from "react";
import { Play, Square, CheckCircle, XCircle } from "lucide-react";
import s from "./SessionControls.module.css";

const SessionControls = ({ doctor, onToggleSession, onToggleAvailable }) => {
  if (!doctor) return null;

  return (
    <div className={s.grid}>
      <div className={s.card}>
        <div className={s.iconWrap} data-active={doctor.sessionActive}>
          {doctor.sessionActive ? <Play size={20} /> : <Square size={20} />}
        </div>
        <div className={s.textBlock}>
          <div className={s.statusLabel}>حالة الجلسة</div>
          <div className={s.status} data-active={doctor.sessionActive}>
            {doctor.sessionActive ? "الجلسة جارية" : "الجلسة مغلقة"}
          </div>
        </div>
        <button
          className={`${s.toggleBtn} ${doctor.sessionActive ? s.toggleBtnDanger : ""}`}
          onClick={onToggleSession}>
          {doctor.sessionActive ? "إنهاء" : "بدء"}
        </button>
      </div>

      <div className={s.card}>
        <div className={s.iconWrap} data-active={doctor.available}>
          {doctor.available ? <CheckCircle size={20} /> : <XCircle size={20} />}
        </div>
        <div className={s.textBlock}>
          <div className={s.statusLabel}>قبول الحجوزات</div>
          <div className={s.status} data-active={doctor.available}>
            {doctor.available ? "متاح للحجز" : "غير متاح"}
          </div>
        </div>
        <button
          className={`${s.toggleBtn} ${doctor.available ? s.toggleBtnDanger : ""}`}
          onClick={onToggleAvailable}>
          {doctor.available ? "إيقاف" : "تفعيل"}
        </button>
      </div>
    </div>
  );
};

export default SessionControls;
