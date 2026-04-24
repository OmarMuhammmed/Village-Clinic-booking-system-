import React from 'react';
import s from './QueueList.module.css';

const TYPE_LABEL = { kashf: '🩺 كشف', istishara: '💬 استشارة' };

const TicketRow = ({ ticket, currentNumber, onAction }) => {
  const isServing = ticket.number === currentNumber;
  return (
    <div className={[s.ticket, isServing && s.ticketServing].filter(Boolean).join(' ')}>
      <div className={s.ticketHeader}>
        <div className={[s.number, isServing && s.numberServing].filter(Boolean).join(' ')}>
          {ticket.number}
        </div>
        <div className={s.patientInfo}>
          <div className={s.patientName}>{ticket.name}</div>
          <div className={s.patientMeta}>
            {ticket.phone} &nbsp;·&nbsp; {TYPE_LABEL[ticket.type]} &nbsp;·&nbsp; {ticket.price} ج
            {isServing && <span style={{ color: 'var(--clr-success)', fontWeight: 600, marginRight: 6 }}> ← يُخدَم الآن</span>}
          </div>
        </div>
      </div>
      <div className={s.actions}>
        <button className={`${s.action} ${s.actionDone}`}    onClick={() => onAction(ticket.id, 'done')}>✓ تم</button>
        <button className={`${s.action} ${s.actionNoShow}`}  onClick={() => onAction(ticket.id, 'noshow')}>⚠ غاب</button>
        <button className={`${s.action} ${s.actionCancel}`}  onClick={() => onAction(ticket.id, 'cancelled')}>✕ إلغاء</button>
      </div>
    </div>
  );
};

const QueueList = ({ tickets = [], currentNumber, onAction }) => {
  const active = tickets.filter((t) => t.status === 'waiting');

  if (!active.length) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🎉</div>
        <div className="empty-state__text">لا يوجد مرضى في الانتظار</div>
      </div>
    );
  }

  return (
    <div className={s.list}>
      {active.map((ticket) => (
        <TicketRow
          key={ticket.id}
          ticket={ticket}
          currentNumber={currentNumber}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default QueueList;
