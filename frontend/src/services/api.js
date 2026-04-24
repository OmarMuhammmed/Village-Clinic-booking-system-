/**
 * services/api.js
 * ─────────────────────────────────────────────────────────────────
 * Mock API layer — production-ready contract.
 * All state lives in memory (and localStorage for persistence).
 * Replace each function's body with a real fetch() call and the
 * rest of the UI will work without any other changes.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Simulated network delay ──────────────────────────────────────
const delay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

// ── Persistence helpers ──────────────────────────────────────────
const STORAGE_KEY = 'clinic_state_v2';

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ── Seed data ────────────────────────────────────────────────────
const SEED = {
  doctors: [
    {
      id: 'doc1',
      name: 'د. أحمد محمود',
      specialty: 'باطنة وجهاز هضمي',
      available: true,
      sessionActive: true,
      prices: { kashf: 80, istishara: 40 },
      avatarInitials: 'أم',
    },
    {
      id: 'doc2',
      name: 'د. سارة كمال',
      specialty: 'طب الأطفال',
      available: true,
      sessionActive: true,
      prices: { kashf: 100, istishara: 50 },
      avatarInitials: 'سك',
    },
    {
      id: 'doc3',
      name: 'د. خالد إبراهيم',
      specialty: 'عظام وكسور',
      available: false,
      sessionActive: false,
      prices: { kashf: 150, istishara: 60 },
      avatarInitials: 'خإ',
    },
  ],
  queues: {
    doc1: {
      currentNumber: 4,
      nextTicketNumber: 9,
      tickets: [
        { id: 'tk1', number: 5, name: 'محمد علي', phone: '01012345678', type: 'kashf',     status: 'waiting', createdAt: new Date().toISOString() },
        { id: 'tk2', number: 6, name: 'فاطمة خالد', phone: '01198765432', type: 'istishara', status: 'waiting', createdAt: new Date().toISOString() },
        { id: 'tk3', number: 7, name: 'أحمد سعد',   phone: '01234567890', type: 'kashf',     status: 'waiting', createdAt: new Date().toISOString() },
        { id: 'tk4', number: 8, name: 'نورا محمود',  phone: '01555556789', type: 'istishara', status: 'waiting', createdAt: new Date().toISOString() },
      ],
    },
    doc2: {
      currentNumber: 2,
      nextTicketNumber: 6,
      tickets: [
        { id: 'tk5', number: 3, name: 'علي حسن', phone: '01111111111', type: 'kashf',     status: 'waiting', createdAt: new Date().toISOString() },
        { id: 'tk6', number: 4, name: 'منى صالح',  phone: '01222222222', type: 'istishara', status: 'waiting', createdAt: new Date().toISOString() },
        { id: 'tk7', number: 5, name: 'حسام أحمد', phone: '01333333333', type: 'kashf',     status: 'waiting', createdAt: new Date().toISOString() },
      ],
    },
    doc3: { currentNumber: 0, nextTicketNumber: 1, tickets: [] },
  },
  financials: {
    doc1: {
      daily:   { kashf: 320, istishara: 80  },
      monthly: { kashf: 4800, istishara: 960 },
    },
    doc2: {
      daily:   { kashf: 200, istishara: 50  },
      monthly: { kashf: 3000, istishara: 600 },
    },
    doc3: {
      daily:   { kashf: 0, istishara: 0 },
      monthly: { kashf: 0, istishara: 0 },
    },
  },
};

// ── State bootstrap ──────────────────────────────────────────────
function bootstrap() {
  const stored = getState();
  if (!stored) {
    saveState(SEED);
    return JSON.parse(JSON.stringify(SEED)); // deep clone
  }
  return stored;
}

let _state = bootstrap();

// ── Helpers ──────────────────────────────────────────────────────
function persist() {
  saveState(_state);
}

function getQueue(doctorId) {
  return _state.queues[doctorId] || { currentNumber: 0, nextTicketNumber: 1, tickets: [] };
}

function getDoctorById(doctorId) {
  return _state.doctors.find((d) => d.id === doctorId) || null;
}

// ════════════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════════════

export const api = {
  /**
   * getDoctors()
   * Returns list of all doctors with current availability.
   */
  getDoctors: async () => {
    await delay(400);
    return JSON.parse(JSON.stringify(_state.doctors));
  },

  /**
   * getDoctor(doctorId)
   */
  getDoctor: async (doctorId) => {
    await delay(200);
    return JSON.parse(JSON.stringify(getDoctorById(doctorId)));
  },

  /**
   * bookTicket(doctorId, { name, phone, type })
   * type: 'kashf' | 'istishara'
   * Returns the newly created ticket.
   */
  bookTicket: async (doctorId, { name, phone, type }) => {
    await delay(700);
    const doctor = getDoctorById(doctorId);
    if (!doctor) throw new Error('الطبيب غير موجود');
    if (!doctor.available) throw new Error('الطبيب غير متاح حالياً');
    if (!doctor.sessionActive) throw new Error('الجلسة لم تبدأ بعد');

    const queue = getQueue(doctorId);
    const price = doctor.prices[type] ?? 0;

    const ticket = {
      id: `tk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      number: queue.nextTicketNumber,
      name,
      phone,
      type,
      price,
      status: 'waiting', // waiting | serving | done | cancelled | noshow
      createdAt: new Date().toISOString(),
    };

    queue.tickets.push(ticket);
    queue.nextTicketNumber += 1;
    persist();

    return JSON.parse(JSON.stringify(ticket));
  },

  /**
   * getQueue(doctorId)
   * Returns queue state for a given doctor.
   */
  getQueue: async (doctorId) => {
    await delay(200);
    const q = getQueue(doctorId);
    const waitingTickets = q.tickets.filter(
      (t) => t.status === 'waiting' && t.number > q.currentNumber
    );
    return {
      ...JSON.parse(JSON.stringify(q)),
      waitingCount: waitingTickets.length,
    };
  },

  /**
   * getTicket(ticketId)
   * Finds a ticket across all queues.
   */
  getTicket: async (ticketId) => {
    await delay(200);
    for (const doctorId in _state.queues) {
      const ticket = _state.queues[doctorId].tickets.find((t) => t.id === ticketId);
      if (ticket) {
        const q = getQueue(doctorId);
        const waitingAhead = q.tickets.filter(
          (t) => t.status === 'waiting' && t.number > q.currentNumber && t.number < ticket.number
        ).length;
        return {
          ticket: JSON.parse(JSON.stringify(ticket)),
          doctorId,
          currentNumber: q.currentNumber,
          waitingAhead,
          estimatedWait: waitingAhead * 5, // 5 min per patient
        };
      }
    }
    return null;
  },

  /**
   * nextPatient(doctorId)
   * Advances the queue to the next waiting patient.
   */
  nextPatient: async (doctorId) => {
    await delay(400);
    const doctor = getDoctorById(doctorId);
    if (!doctor?.sessionActive) throw new Error('الجلسة غير نشطة');

    const queue = getQueue(doctorId);

    // Mark the current serving ticket as done
    const currentTicket = queue.tickets.find(
      (t) => t.number === queue.currentNumber && t.status === 'waiting'
    );
    if (currentTicket) {
      currentTicket.status = 'done';
      // Update financial tracking
      const fin = _state.financials[doctorId];
      if (fin) {
        fin.daily[currentTicket.type] = (fin.daily[currentTicket.type] || 0) + currentTicket.price;
        fin.monthly[currentTicket.type] = (fin.monthly[currentTicket.type] || 0) + currentTicket.price;
      }
    }

    // Move to next waiting patient
    const nextTicket = queue.tickets.find(
      (t) => t.status === 'waiting' && t.number > queue.currentNumber
    );
    if (nextTicket) {
      queue.currentNumber = nextTicket.number;
    } else {
      queue.currentNumber += 1; // advance past last
    }

    persist();
    return JSON.parse(JSON.stringify(getQueue(doctorId)));
  },

  /**
   * updateTicketStatus(doctorId, ticketId, status)
   * status: 'cancelled' | 'noshow' | 'done'
   */
  updateTicketStatus: async (doctorId, ticketId, status) => {
    await delay(300);
    const queue = getQueue(doctorId);
    const ticket = queue.tickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('التذكرة غير موجودة');
    ticket.status = status;
    persist();
    return JSON.parse(JSON.stringify(getQueue(doctorId)));
  },

  /**
   * addWalkIn(doctorId, { name, phone, type })
   * Manual walk-in registration from the dashboard.
   */
  addWalkIn: async (doctorId, { name, phone, type }) => {
    return api.bookTicket(doctorId, { name, phone: phone || 'بدون هاتف', type });
  },

  /**
   * toggleDoctorStatus(doctorId)
   * Toggles the doctor's availability.
   */
  toggleDoctorStatus: async (doctorId) => {
    await delay(300);
    const doctor = getDoctorById(doctorId);
    if (!doctor) throw new Error('الطبيب غير موجود');
    doctor.available = !doctor.available;
    persist();
    return JSON.parse(JSON.stringify(doctor));
  },

  /**
   * toggleSession(doctorId, active)
   */
  toggleSession: async (doctorId, active) => {
    await delay(300);
    const doctor = getDoctorById(doctorId);
    if (!doctor) throw new Error('الطبيب غير موجود');
    doctor.sessionActive = active;
    if (active) doctor.available = true;
    persist();
    return JSON.parse(JSON.stringify(doctor));
  },

  /**
   * getStats(doctorId)
   * Returns daily + monthly income and patient counts.
   */
  getStats: async (doctorId) => {
    await delay(400);
    const doctor = getDoctorById(doctorId);
    if (!doctor) return null;

    const fin = _state.financials[doctorId] || {
      daily: { kashf: 0, istishara: 0 },
      monthly: { kashf: 0, istishara: 0 },
    };

    const queue = getQueue(doctorId);
    const doneToday = queue.tickets.filter((t) => t.status === 'done').length;
    const totalToday = queue.tickets.length;

    return {
      daily: {
        kashf:     fin.daily.kashf,
        istishara: fin.daily.istishara,
        total:     fin.daily.kashf + fin.daily.istishara,
      },
      monthly: {
        kashf:     fin.monthly.kashf,
        istishara: fin.monthly.istishara,
        total:     fin.monthly.kashf + fin.monthly.istishara,
      },
      patients: {
        doneToday,
        totalToday,
        waiting: queue.tickets.filter((t) => t.status === 'waiting').length,
      },
    };
  },
};
