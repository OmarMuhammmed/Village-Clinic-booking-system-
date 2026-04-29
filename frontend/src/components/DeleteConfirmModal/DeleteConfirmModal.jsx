import React, { useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Button from '../Button/Button';
import s from './DeleteConfirmModal.module.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading, doctorName }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.card} onClick={(e) => e.stopPropagation()}>
        <div className={s.icon}>
          <AlertTriangle size={28} />
        </div>
        <div className={s.title}>هل أنت متأكد من حذف {doctorName}؟</div>
        <div className={s.subtitle}>
          سيتم حذف جميع بيانات الطبيب والطابور والبيانات المالية. لا يمكن التراجع عن هذا الإجراء.
        </div>
        <div className={s.actions}>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            <Trash2 size={18} />
            حذف
          </Button>
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
