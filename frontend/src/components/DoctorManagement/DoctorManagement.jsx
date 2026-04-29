import React, { useState } from 'react';
import { Stethoscope, MessageSquare, Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import Button from '../Button/Button';
import DoctorFormModal from '../DoctorFormModal/DoctorFormModal';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import s from './DoctorManagement.module.css';

const DoctorCard = ({ doctor, onEdit, onDelete }) => (
  <div className={s.card}>
    <div className={s.cardHeader}>
      <div className={s.avatar}>{doctor.avatarInitials}</div>
      <div className={s.cardInfo}>
        <div className={s.cardName}>{doctor.name}</div>
        <div className={s.cardSpecialty}>{doctor.specialty}</div>
      </div>
      <span className={`${s.badge} ${doctor.available ? s.badgeAvailable : s.badgeUnavailable}`}>
        {doctor.available ? 'متاح' : 'غير متاح'}
      </span>
    </div>

    <div className={s.prices}>
      <div className={s.priceItem}>
        <Stethoscope size={16} className={s.priceIcon} />
        <div>
          <div className={s.priceLabel}>كشف</div>
          <div className={s.priceValue}>{doctor.prices.kashf} ج</div>
        </div>
      </div>
      <div className={s.priceItem}>
        <MessageSquare size={16} className={s.priceIcon} />
        <div>
          <div className={s.priceLabel}>استشارة</div>
          <div className={s.priceValue}>{doctor.prices.istishara} ج</div>
        </div>
      </div>
    </div>

    <div className={s.cardActions}>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil size={16} />
        تعديل
      </Button>
      <Button variant="danger" size="sm" onClick={onDelete}>
        <Trash2 size={16} />
        حذف
      </Button>
    </div>
  </div>
);

const DoctorManagement = ({ doctors, onDoctorsChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAdd = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doc) => {
    setEditingDoctor(doc);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, data);
      } else {
        await api.createDoctor(data);
      }
      setShowForm(false);
      onDoctorsChange();
    } catch (err) {
      alert(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteDoctor(deleteTarget.id);
      setDeleteTarget(null);
      onDoctorsChange();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>
          <Stethoscope size={22} />
          إدارة الأطباء
        </h2>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <Plus size={18} />
          إضافة طبيب
        </Button>
      </div>

      {doctors.length > 0 ? (
        <div className={s.grid}>
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onEdit={() => handleEdit(doc)}
              onDelete={() => setDeleteTarget(doc)}
            />
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <div className={s.emptyIcon}>
            <Stethoscope size={32} />
          </div>
          <p className={s.emptyText}>لا يوجد أطباء حالياً</p>
          <Button variant="primary" size="sm" onClick={handleAdd}>
            <Plus size={18} />
            إضافة أول طبيب
          </Button>
        </div>
      )}

      <DoctorFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        doctor={editingDoctor}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        doctorName={deleteTarget?.name ?? ''}
      />
    </div>
  );
};

export default DoctorManagement;
