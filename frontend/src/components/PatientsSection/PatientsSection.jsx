import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  UserX,
  XCircle,
  TrendingDown,
  Timer,
  UserPlus,
  ListFilter,
  Smile,
} from "lucide-react";
import s from "./PatientsSection.module.css";

/* ── helpers ── */
const TYPE_LABEL = { kashf: "كشف", istishara: "استشارة" };

function timeAgo(createdAt) {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  return `منذ ${Math.floor(mins / 60)} س`;
}

/* ── Completion ring ── */
const Ring = ({ pct }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className={s.ring}>
      <circle cx="48" cy="48" r={r} className={s.ringTrack} />
      <circle
        cx="48"
        cy="48"
        r={r}
        className={s.ringFill}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
      />
      <text x="48" y="44" className={s.ringPct}>
        {pct}%
      </text>
      <text x="48" y="60" className={s.ringLabel}>
        اكتمال
      </text>
    </svg>
  );
};

/* ── Status bar ── */
const StatusBar = ({ done, waiting, noshow, cancelled, total }) => {
  if (!total) return null;
  const pDone = (done / total) * 100;
  const pWaiting = (waiting / total) * 100;
  const pNoshow = (noshow / total) * 100;
  const pCancelled = (cancelled / total) * 100;
  return (
    <div className={s.barWrap}>
      <div className={s.bar}>
        {pDone > 0 && (
          <div
            className={s.barDone}
            style={{ width: `${pDone}%` }}
            title={`تم: ${done}`}
          />
        )}
        {pWaiting > 0 && (
          <div
            className={s.barWaiting}
            style={{ width: `${pWaiting}%` }}
            title={`انتظار: ${waiting}`}
          />
        )}
        {pNoshow > 0 && (
          <div
            className={s.barNoshow}
            style={{ width: `${pNoshow}%` }}
            title={`غائب: ${noshow}`}
          />
        )}
        {pCancelled > 0 && (
          <div
            className={s.barCancelled}
            style={{ width: `${pCancelled}%` }}
            title={`ملغي: ${cancelled}`}
          />
        )}
      </div>
      <div className={s.barLegend}>
        <span className={s.legendItem}>
          <span className={`${s.legendDot} ${s.dotDone}`} />
          تم ({done})
        </span>
        <span className={s.legendItem}>
          <span className={`${s.legendDot} ${s.dotWaiting}`} />
          انتظار ({waiting})
        </span>
        <span className={s.legendItem}>
          <span className={`${s.legendDot} ${s.dotNoshow}`} />
          غائب ({noshow})
        </span>
        <span className={s.legendItem}>
          <span className={`${s.legendDot} ${s.dotCancelled}`} />
          ملغي ({cancelled})
        </span>
      </div>
    </div>
  );
};

/* ── Ticket row ── */
const FILTERS = [
  { key: "waiting", label: "انتظار", icon: Clock },
  { key: "all", label: "الكل", icon: ListFilter },
  { key: "done", label: "تم", icon: CheckCircle },
  { key: "cancelled", label: "ملغي", icon: XCircle },
  { key: "noshow", label: "غائب", icon: UserX },
];

const TicketRow = ({ ticket, currentNumber, onAction }) => {
  const [confirming, setConfirming] = useState(null);
  const isServing =
    ticket.number === currentNumber && ticket.status === "waiting";
  const isDone = ticket.status === "done";
  const isInactive =
    ticket.status === "cancelled" || ticket.status === "noshow";

  const rowClass = isServing
    ? s.rowServing
    : isDone
      ? s.rowDone
      : isInactive
        ? s.rowInactive
        : s.rowWaiting;

  const act = (action) => {
    if (action === "done") {
      onAction(ticket.id, "done");
      return;
    }
    if (confirming === action) {
      onAction(ticket.id, action);
      setConfirming(null);
    } else setConfirming(action);
  };

  return (
    <div className={`${s.ticketRow} ${rowClass}`}>
      <div className={s.ticketMain}>
        <div
          className={`${s.ticketNum} ${isServing ? s.ticketNumServing : ""}`}>
          {ticket.number}
        </div>
        <div className={s.ticketInfo}>
          <div className={s.ticketName}>
            {isInactive ? <s>{ticket.name}</s> : ticket.name}
            {isServing && <span className={s.servingPill}>يُخدَم الآن</span>}
          </div>
          <div className={s.ticketMeta}>
            <span>{TYPE_LABEL[ticket.type]}</span>
            <span className={s.sep} />
            <span>{ticket.price} ج</span>
            {ticket.status === "waiting" && ticket.createdAt && (
              <>
                <span className={s.sep} />
                <Clock size={11} />
                <span>{timeAgo(ticket.createdAt)}</span>
              </>
            )}
          </div>
        </div>
        <div className={s.ticketStatus}>
          {isDone && <span className={`${s.pill} ${s.pillDone}`}>تم</span>}
          {ticket.status === "cancelled" && (
            <span className={`${s.pill} ${s.pillCancelled}`}>ملغي</span>
          )}
          {ticket.status === "noshow" && (
            <span className={`${s.pill} ${s.pillNoshow}`}>غائب</span>
          )}
        </div>
      </div>

      {ticket.status === "waiting" && (
        <div className={s.ticketActions}>
          {confirming ? (
            <div className={s.confirmRow}>
              <span className={s.confirmText}>هل أنت متأكد؟</span>
              <button
                className={`${s.actBtn} ${s.actConfirm}`}
                onClick={() => act(confirming)}>
                نعم
              </button>
              <button
                className={`${s.actBtn} ${s.actNo}`}
                onClick={() => setConfirming(null)}>
                لا
              </button>
            </div>
          ) : (
            <>
              <button
                className={`${s.actBtn} ${s.actDone}`}
                onClick={() => act("done")}>
                {" "}
                <CheckCircle size={13} /> تم
              </button>
              <button
                className={`${s.actBtn} ${s.actNoshow}`}
                onClick={() => act("noshow")}>
                {" "}
                <UserX size={13} /> غاب
              </button>
              <button
                className={`${s.actBtn} ${s.actCancel}`}
                onClick={() => act("cancelled")}>
                {" "}
                <XCircle size={13} /> إلغاء
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
const PatientsSection = ({
  stats,
  tickets = [],
  currentNumber,
  onAction,
  onAddWalkIn,
}) => {
  const [filter, setFilter] = useState("waiting");

  if (!stats) return null;

  const {
    totalToday,
    doneToday,
    waiting,
    noShowToday,
    cancelledToday,
    cancellationRate,
    averageWaitTime,
    completionPercentage,
  } = stats.patients;

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const kpiCards = [
    {
      icon: Users,
      label: "مرضى اليوم",
      value: totalToday,
      unit: "",
      color: "var(--clr-info)",
    },
    {
      icon: CheckCircle,
      label: "تمّت خدمتهم",
      value: doneToday,
      unit: "",
      color: "var(--clr-success)",
    },
    {
      icon: Clock,
      label: "في الانتظار",
      value: waiting,
      unit: "",
      color: "var(--clr-warning)",
    },
    {
      icon: UserX,
      label: "غائبون",
      value: noShowToday,
      unit: "",
      color: "var(--clr-danger)",
    },
    {
      icon: TrendingDown,
      label: "معدل الإلغاء",
      value: cancellationRate,
      unit: "%",
      color: "var(--clr-danger)",
    },
    {
      icon: Timer,
      label: "متوسط الانتظار",
      value: averageWaitTime,
      unit: "د",
      color: "var(--clr-info)",
    },
  ];

  return (
    <div className={s.wrapper}>
      {/* ── Top: ring + KPIs ── */}
      <div className={s.overview}>
        <div className={s.ringWrap}>
          <Ring pct={completionPercentage} />
          <div className={s.ringCaption}>
            <span className={s.ringTotal}>{totalToday}</span>
            <span className={s.ringTotalLabel}>مريض اليوم</span>
          </div>
        </div>

        <div className={s.kpiGrid}>
          {kpiCards.map((k) => (
            <div
              key={k.label}
              className={s.kpi}
              style={{ "--kpi-color": k.color }}>
              <div className={s.kpiIcon}>
                <k.icon size={15} />
              </div>
              <div className={s.kpiValue}>
                {k.value}
                <span className={s.kpiUnit}>{k.unit}</span>
              </div>
              <div className={s.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status distribution bar ── */}
      <StatusBar
        done={doneToday}
        waiting={waiting}
        noshow={noShowToday}
        cancelled={cancelledToday}
        total={totalToday}
      />

      {/* ── Queue list ── */}
      <div className={s.queueSection}>
        <div className={s.queueHeader}>
          <div className={s.queueTitle}>
            <ListFilter size={16} />
            قائمة الانتظار
          </div>
          <button className={s.addBtn} onClick={onAddWalkIn}>
            <UserPlus size={14} />
            إضافة يدوياً
          </button>
        </div>

        {/* filters */}
        <div className={s.filters}>
          {FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? tickets.length
                : tickets.filter((t) => t.status === f.key).length;
            return (
              <button
                key={f.key}
                className={`${s.filterBtn} ${filter === f.key ? s.filterActive : ""}`}
                onClick={() => setFilter(f.key)}>
                <f.icon size={13} />
                {f.label}
                <span className={s.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* list */}
        {filtered.length === 0 ? (
          <div className={s.empty}>
            <Smile size={36} strokeWidth={1.5} />
            <span>
              {filter === "waiting"
                ? "لا يوجد مرضى في الانتظار"
                : "لا توجد نتائج"}
            </span>
          </div>
        ) : (
          <div className={s.list}>
            {filtered.map((t) => (
              <TicketRow
                key={t.id}
                ticket={t}
                currentNumber={currentNumber}
                onAction={onAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsSection;
