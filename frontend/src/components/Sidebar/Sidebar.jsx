import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hospital, LayoutDashboard, Users, BarChart3, Settings,
  LogOut, ChevronDown, X, Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import s from './Sidebar.module.css';

const NAV_ITEMS = [
  { key: 'queue',    icon: LayoutDashboard, label: 'لوحة التحكم' },
  { key: 'doctors',  icon: Stethoscope,     label: 'إدارة الأطباء' },
  { key: 'patients', icon: Users,           label: 'المرضى',       disabled: true },
  { key: 'reports',  icon: BarChart3,       label: 'التقارير',      disabled: true },
  { key: 'settings', icon: Settings,        label: 'الإعدادات',     disabled: true },
];

const Sidebar = ({ doctors, selectedId, onSelectDoctor, isOpen, onClose, activeView, onViewChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedId);

  return (
    <>
      {isOpen && <div className={s.overlay} onClick={onClose} />}
      <aside className={`${s.sidebar} ${isOpen ? s.open : ''}`}>
        {/* Close button (mobile) */}
        <button className={s.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        {/* Branding */}
        <div className={s.brand}>
          <div className={s.brandIcon}>
            <Hospital size={22} />
          </div>
          <div>
            <div className={s.brandName}>نظام العيادة</div>
            <div className={s.brandSub}>لوحة التحكم</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={s.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`${s.navItem} ${activeView === item.key ? s.navItemActive : ''} ${item.disabled ? s.navItemDisabled : ''}`}
              disabled={item.disabled}
              onClick={() => !item.disabled && onViewChange(item.key)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.disabled && <span className={s.badge}>قريباً</span>}
            </button>
          ))}
        </nav>

        {activeView !== 'doctors' && (
          <div className={s.doctorSection}>
            <div className={s.sectionLabel}>الطبيب / العيادة</div>
            {selectedDoctor && (
              <div className={s.doctorPreview}>
                <div className={s.doctorAvatar}>{selectedDoctor.avatarInitials}</div>
                <div className={s.doctorInfo}>
                  <div className={s.doctorName}>{selectedDoctor.name}</div>
                  <div className={s.doctorSpec}>{selectedDoctor.specialty}</div>
                </div>
              </div>
            )}
            <div className={s.selectWrapper}>
              <select
                value={selectedId}
                onChange={(e) => onSelectDoctor(e.target.value)}
                className={s.select}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className={s.selectIcon} />
            </div>
          </div>
        )}

        {/* Logout */}
        <div className={s.bottom}>
          <button className={s.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
