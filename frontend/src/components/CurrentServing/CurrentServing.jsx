import React from "react";
import { Megaphone } from "lucide-react";
import s from "./CurrentServing.module.css";

const CurrentServing = ({
  currentNumber,
  waitingCount,
  totalToday,
  doneToday,
  sessionActive,
  calling,
  onCallNext,
}) => {
  const progress =
    totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;

  return (
    <div className={`${s.hero} ${!sessionActive ? s.inactive : ""}`}>
      <div className={s.top}>
        <span className={s.label}>يُخدَم الآن</span>
        <div
          className={`${s.number} ${sessionActive && currentNumber > 0 ? s.pulse : ""}`}>
          {currentNumber ?? 0}
        </div>
        {waitingCount > 0 && (
          <span className={s.waiting}>{waitingCount} في الانتظار</span>
        )}
      </div>

      <div className={s.progressSection}>
        <div className={s.progressBar}>
          <div className={s.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={s.progressLabel}>{progress}% اكتمال</span>
      </div>

      <button
        className={s.callBtn}
        disabled={!sessionActive || calling}
        onClick={onCallNext}>
        <Megaphone size={18} />
        {calling ? "جاري الاستدعاء..." : "استدعاء التالي"}
      </button>

      {!sessionActive && <p className={s.hint}>ابدأ الجلسة أولاً</p>}
    </div>
  );
};

export default CurrentServing;
