import React from "react";
import { Stethoscope, MessageSquare } from "lucide-react";
import s from "./DailyChart.module.css";

const DailyChart = ({ kashf = 0, istishara = 0 }) => {
  const max = Math.max(kashf, istishara, 1);

  return (
    <div className={s.wrapper}>
      <div className={s.title}>توزيع إيراد اليوم</div>
      <div className={s.rows}>
        <div className={s.row}>
          <div className={s.rowLabel}>
            <Stethoscope size={13} />
            كشف
          </div>
          <div className={s.track}>
            <div
              className={`${s.fill} ${s.kashf}`}
              style={{ width: `${(kashf / max) * 100}%` }}
            />
          </div>
          <div className={s.rowValue}>{kashf} ج</div>
        </div>
        <div className={s.row}>
          <div className={s.rowLabel}>
            <MessageSquare size={13} />
            استشارة
          </div>
          <div className={s.track}>
            <div
              className={`${s.fill} ${s.istishara}`}
              style={{ width: `${(istishara / max) * 100}%` }}
            />
          </div>
          <div className={s.rowValue}>{istishara} ج</div>
        </div>
      </div>
    </div>
  );
};

export default DailyChart;
