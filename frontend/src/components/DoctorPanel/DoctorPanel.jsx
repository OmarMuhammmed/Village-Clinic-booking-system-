import React from "react";
import {
  Users,
  Clock,
  CheckCircle,
  Wallet,
  Stethoscope,
  MessageSquare,
} from "lucide-react";
import s from "./DoctorPanel.module.css";

const DoctorPanel = ({ doctors, selectedId, onSelect, queue, stats }) => {
  return (
    <div className={s.wrapper}>
      {/* ── Doctor cards row ── */}
      <div className={s.row}>
        {doctors.map((doc) => {
          const isSelected = doc.id === selectedId;
          return (
            <button
              key={doc.id}
              className={`${s.card} ${isSelected ? s.cardActive : ""}`}
              onClick={() => onSelect(doc.id)}>
              <div className={s.cardTop}>
                <div
                  className={`${s.avatar} ${isSelected ? s.avatarActive : ""}`}>
                  {doc.avatarInitials}
                </div>
                <span
                  className={`${s.dot} ${doc.available ? s.dotGreen : s.dotRed}`}
                />
              </div>
              <div className={s.cardName}>{doc.name}</div>
              <div className={s.cardSpec}>{doc.specialty}</div>
              <span
                className={`${s.badge} ${doc.available ? s.badgeGreen : s.badgeRed}`}>
                {doc.available ? "متاح" : "مشغول"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Expanded detail strip for selected doctor ── */}
      {queue && stats && (
        <div className={s.detail}>
          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(26,110,181,0.1)",
                color: "var(--clr-primary)",
              }}>
              <Clock size={16} />
            </div>
            <div>
              <div className={s.detailValue}>{queue.waitingCount ?? 0}</div>
              <div className={s.detailLabel}>في الانتظار</div>
            </div>
          </div>

          <div className={s.detailSep} />

          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(34,160,107,0.1)",
                color: "var(--clr-success)",
              }}>
              <CheckCircle size={16} />
            </div>
            <div>
              <div className={s.detailValue}>{stats.patients.doneToday}</div>
              <div className={s.detailLabel}>تمّت خدمتهم</div>
            </div>
          </div>

          <div className={s.detailSep} />

          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(26,110,181,0.1)",
                color: "var(--clr-primary)",
              }}>
              <Users size={16} />
            </div>
            <div>
              <div className={s.detailValue}>{stats.patients.totalToday}</div>
              <div className={s.detailLabel}>مرضى اليوم</div>
            </div>
          </div>

          <div className={s.detailSep} />

          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(224,123,0,0.1)",
                color: "var(--clr-warning)",
              }}>
              <Wallet size={16} />
            </div>
            <div>
              <div className={s.detailValue}>
                {stats.daily.total} <small>ج</small>
              </div>
              <div className={s.detailLabel}>إيراد اليوم</div>
            </div>
          </div>

          <div className={s.detailSep} />

          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(15,157,130,0.1)",
                color: "var(--clr-secondary)",
              }}>
              <Stethoscope size={16} />
            </div>
            <div>
              <div className={s.detailValue}>
                {stats.daily.kashf} <small>ج</small>
              </div>
              <div className={s.detailLabel}>كشف</div>
            </div>
          </div>

          <div className={s.detailSep} />

          <div className={s.detailItem}>
            <div
              className={s.detailIcon}
              style={{
                background: "rgba(224,123,0,0.1)",
                color: "var(--clr-warning)",
              }}>
              <MessageSquare size={16} />
            </div>
            <div>
              <div className={s.detailValue}>
                {stats.daily.istishara} <small>ج</small>
              </div>
              <div className={s.detailLabel}>استشارة</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPanel;
