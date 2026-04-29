import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Wallet,
  Stethoscope,
  MessageSquare,
  Calendar,
  Users,
  UserPlus,
} from "lucide-react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar/Sidebar";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import DoctorPanel from "../components/DoctorPanel/DoctorPanel";
import SessionControls from "../components/SessionControls/SessionControls";
import CurrentServing from "../components/CurrentServing/CurrentServing";
import StatsCard from "../components/Stats/StatsCard";
import DailyChart from "../components/DailyChart/DailyChart";
import PatientsSection from "../components/PatientsSection/PatientsSection";
import WalkInModal from "../components/WalkInModal/WalkInModal";
import DoctorManagement from "../components/DoctorManagement/DoctorManagement";
import s from "./Dashboard.module.css";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeView, setActiveView] = useState('queue');
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [wiLoading, setWiLoading] = useState(false);

  const refreshAll = async (id = selectedId) => {
    if (!id) return;
    const [q, st, d] = await Promise.all([
      api.getQueue(id),
      api.getStats(id),
      api.getDoctor(id),
    ]);
    setQueue(q);
    setStats(st);
    setDoctor(d);
  };

  const refreshDoctors = async () => {
    const data = await api.getDoctors();
    setDoctors(data);
    if (!data.find((d) => d.id === selectedId)) {
      setSelectedId(data.length ? data[0].id : '');
    }
  };

  useEffect(() => {
    api.getDoctors().then((data) => {
      setDoctors(data);
      if (data.length) setSelectedId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    refreshAll(selectedId).finally(() => setLoading(false));
    const interval = setInterval(() => refreshAll(selectedId), 10000);
    return () => clearInterval(interval);
  }, [selectedId]);

  const handleNext = async () => {
    if (!selectedId || !doctor?.sessionActive) return;
    setCalling(true);
    try {
      await api.nextPatient(selectedId);
      await refreshAll();
    } finally {
      setCalling(false);
    }
  };

  const handleTicketAction = async (ticketId, status) => {
    await api.updateTicketStatus(selectedId, ticketId, status);
    await refreshAll();
  };

  const handleToggleAvailable = async () => {
    await api.toggleDoctorStatus(selectedId);
    await refreshAll();
  };

  const handleToggleSession = async () => {
    await api.toggleSession(selectedId, !doctor?.sessionActive);
    await refreshAll();
  };

  const handleWalkIn = async ({ name, phone, type }) => {
    setWiLoading(true);
    try {
      await api.addWalkIn(selectedId, { name, phone, type });
      setShowWalkIn(false);
      await refreshAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setWiLoading(false);
    }
  };

  return (
    <div className={s.shell}>
      <Sidebar
        doctors={doctors}
        selectedId={selectedId}
        onSelectDoctor={setSelectedId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className={s.main}>
        <DashboardHeader
          doctor={activeView === 'queue' ? doctor : null}
          onMenuToggle={() => setSidebarOpen(true)}
          activeView={activeView}
        />

        <div className={s.content}>
          {activeView === 'queue' && (
            <>
              {loading && (
                <div className="loading-page">
                  <div className="spinner" />
                </div>
              )}

              {doctors.length > 0 && (
                <DoctorPanel
                  doctors={doctors}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  queue={queue}
                  stats={stats}
                />
              )}

              {!loading && doctor && (
                <>
                  <SessionControls
                    doctor={doctor}
                    onToggleSession={handleToggleSession}
                    onToggleAvailable={handleToggleAvailable}
                  />

                  <CurrentServing
                    currentNumber={queue?.currentNumber ?? 0}
                    waitingCount={queue?.waitingCount ?? 0}
                    totalToday={stats?.patients?.totalToday ?? 0}
                    doneToday={stats?.patients?.doneToday ?? 0}
                    sessionActive={doctor.sessionActive}
                    calling={calling}
                    onCallNext={handleNext}
                  />

                  {stats && (
                    <section className={s.sectionCard}>
                      <div className={s.sectionHeader}>
                        <h2 className={s.sectionTitle}>
                          <BarChart3 size={20} />
                          الإحصائيات
                        </h2>
                      </div>

                      <div className={s.statsGroup}>
                        <div className={s.statsGroupLabel}>
                          <Wallet size={13} />
                          الإيرادات
                        </div>
                        <div className={s.statsRow4}>
                          <StatsCard
                            icon={<Wallet size={20} />}
                            label="إيراد اليوم الكلي"
                            value={stats.daily.total}
                            unit="ج"
                            accentColor="var(--clr-primary)"
                          />
                          <StatsCard
                            icon={<Stethoscope size={20} />}
                            label="كشف اليوم"
                            value={stats.daily.kashf}
                            unit="ج"
                            accentColor="var(--clr-secondary)"
                          />
                          <StatsCard
                            icon={<MessageSquare size={20} />}
                            label="استشارة اليوم"
                            value={stats.daily.istishara}
                            unit="ج"
                            accentColor="var(--clr-warning)"
                          />
                          <StatsCard
                            icon={<Calendar size={20} />}
                            label="إيراد الشهر"
                            value={stats.monthly.total}
                            unit="ج"
                            accentColor="var(--clr-success)"
                          />
                        </div>
                        <DailyChart
                          kashf={stats.daily.kashf}
                          istishara={stats.daily.istishara}
                        />
                      </div>

                      <div className={s.statsGroup}>
                        <div className={s.statsGroupLabel}>
                          <Users size={13} />
                          المرضى
                        </div>
                        <PatientsSection
                          stats={stats}
                          tickets={queue?.tickets ?? []}
                          currentNumber={queue?.currentNumber ?? 0}
                          onAction={handleTicketAction}
                          onAddWalkIn={() => setShowWalkIn(true)}
                        />
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {activeView === 'doctors' && (
            <DoctorManagement
              doctors={doctors}
              onDoctorsChange={refreshDoctors}
            />
          )}
        </div>
      </div>

      <WalkInModal
        isOpen={showWalkIn}
        onClose={() => setShowWalkIn(false)}
        onSubmit={handleWalkIn}
        loading={wiLoading}
        prices={doctor?.prices}
      />
    </div>
  );
};

export default Dashboard;
