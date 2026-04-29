import React from 'react';
import { Menu } from 'lucide-react';
import s from './DashboardHeader.module.css';

const DashboardHeader = ({ doctor, onMenuToggle, activeView }) => {
  return (
    <header className={s.header}>
      <div className={s.start}>
        <button className={s.menuBtn} onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <div>
          <h1 className={s.title}>
            {activeView === 'doctors' ? 'إدارة الأطباء' : 'لوحة التحكم'}
          </h1>
          <p className={s.sub}>
            {activeView === 'doctors' ? 'إضافة، تعديل، وحذف الأطباء' : 'إدارة الطابور والجلسة'}
          </p>
        </div>
      </div>

      {doctor && (
        <div className={s.end}>
          <div className={s.doctorChip}>
            <div className={s.avatar}>{doctor.avatarInitials}</div>
            <div className={s.chipInfo}>
              <span className={s.chipName}>{doctor.name}</span>
              <span className={s.chipSpec}>{doctor.specialty}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
