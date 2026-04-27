import React, { useState } from 'react';
import { CheckCircle, UserX, XCircle, Clock, ListFilter, Smile } from 'lucide-react';
import s from './QueueList.module.css';

const FILTERS = [
  { key: 'waiting',   label: 'في الانتظار', icon: Clock },
  { key: 'all',       label: 'الكل',        icon: ListFilter },
  { key: 'done',      label: 'تم',          icon: CheckCircle },
  { key: 'cancelled', label: 'ملغي',        icon: XCircle },
  { key: 'noshow',    label: 'غائب',        icon: UserX },
];

const TYPE_LABEL = { kashf: 'كشف', istishara: 'استشارة' };

function timeAgo(createdAt) {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} د`;
  const hrs = Math.floor(mins / 60);
  return `منذ ${hrs} س`;
}

const TicketRow = ({ ticket, currentNumber, onAction }) => {
  const [confirming, setConfirming] = useState(null);
  const isServing = ticket.number === currentNumber && ticket.status === 'waiting';
  const isDone = ticket.status === 'done';
  const isInactive = ticket.status === 'cancelled' || ticket.status === 'noshow';

  const statusClass = isServing ? s.serving : isDone ? s.done : isInactive ? s.inactive : '';

  const handleAction = (action) => {
    if (action === 'done') {
      onAction(ticket.id, 'done');
      return;
    }
    if (confirming === action) {
      onAction(ticket.id, action);
      setConfirming(null);
    } else {
      setConfirming(action);
    }
  };

  return (
    <div className={`${s.ticket} ${statusClass}`}>
      <div className={s.ticketHeader}>
        <div className={`${s.number} ${isServing ? s.numberServing : ''}`}>
          {ticket.number}
        </div>
        <div className={s.patientInfo}>
          <div className={`${s.patientName} ${isInactive ? s.strikethrough : ''}`}>
            {ticket.name}
            {isServing && <span className={s.servingBadge}>يُخدَم الآن</span>}
          </div>
          <div className={s.patientMeta}>
            <span>{TYPE_LABEL[ticket.type]}</span>
            <span className={s.dot} />
            <span>{ticket.price} ج</span>
            {ticket.status === 'waiting' && ticket.createdAt && (
              <>
                <span className={s.dot} />
                <Clock size={12} />
                <span>{timeAgo(ticket.createdAt)}</span>
              </>
            )}
            {isDone && <span className={s.statusTag} data-status="done">تم</span>}
            {ticket.status === 'cancelled' && <span className={s.statusTag} data-status="cancelled">ملغي</span>}
            {ticket.status === 'noshow' && <span className={s.statusTag} data-status="noshow">غائب</span>}
          </div>
        </div>
      </div>

      {ticket.status === 'waiting' && (
        <div className={s.actions}>
          {confirming ? (
            <div className={s.confirmRow}>
              <span className={s.confirmText}>هل أنت متأكد؟</span>
              <button className={`${s.action} ${s.actionConfirm}`} onClick={() => handleAction(confirming)}>
                نعم
              </button>
              <button className={`${s.action} ${s.actionCancel}`} onClick={() => setConfirming(null)}>
                لا
              </button>
            </div>
          ) : (
            <>
              <button className={`${s.action} ${s.actionDone}`} onClick={() => handleAction('done')}>
                <CheckCircle size={14} /> تم
              </button>
              <button className={`${s.action} ${s.actionNoShow}`} onClick={() => handleAction('noshow')}>
                <UserX size={14} /> غاب
              </button>
              <button className={`${s.action} ${s.actionCancelBtn}`} onClick={() => handleAction('cancelled')}>
                <XCircle size={14} /> إلغاء
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const QueueList = ({ tickets = [], currentNumber, onAction }) => {
  const [filter, setFilter] = useState('waiting');

  const filtered = filter === 'all'
    ? tickets
    : tickets.filter((t) => t.status === filter);

  return (
    <div>
      <div className={s.filters}>
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? tickets.length : tickets.filter((t) => t.status === f.key).length;
          return (
            <button
              key={f.key}
              className={`${s.filterBtn} ${filter === f.key ? s.filterActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              <f.icon size={14} />
              <span>{f.label}</span>
              <span className={s.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className={s.empty}>
          <Smile size={40} strokeWidth={1.5} />
          <div>{filter === 'waiting' ? 'لا يوجد مرضى في الانتظار' : 'لا توجد نتائج'}</div>
        </div>
      ) : (
        <div className={s.list}>
          {filtered.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              currentNumber={currentNumber}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueList;
