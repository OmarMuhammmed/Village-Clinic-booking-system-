/**
 * src/services/api.js
 * Mock API layer for the MVP.
 * Simulates latency and uses localStorage for persistence across reloads.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'clinic_queue_state';

const defaultState = {
  doctors: [
    { id: '1', name: 'د. أحمد محمود', specialty: 'باطنة' },
    { id: '2', name: 'د. سارة كمال', specialty: 'أطفال' }
  ],
  sessions: {
    // doctorId -> { active: boolean, currentNumber: number, nextTicketNumber: number, tickets: [] }
    '1': { active: true, currentNumber: 5, nextTicketNumber: 13, tickets: [
      { id: 't12', number: 12, name: 'محمد علي', phone: '01012345678', status: 'waiting' }
    ] },
    '2': { active: false, currentNumber: 0, nextTicketNumber: 1, tickets: [] }
  }
};

const getState = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : defaultState;
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Initialize if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  saveState(defaultState);
}

export const api = {
  getDoctors: async () => {
    await delay(300);
    return getState().doctors;
  },

  getQueueStatus: async (doctorId) => {
    await delay(200);
    const state = getState();
    const session = state.sessions[doctorId];
    if (!session) return null;
    
    // Calculate estimated time (e.g., 5 mins per patient)
    const waitingCount = session.tickets.filter(t => t.status === 'waiting' && t.number > session.currentNumber).length;
    
    return {
      active: session.active,
      currentNumber: session.currentNumber,
      estimatedWaitTimeMinutes: waitingCount * 5
    };
  },

  bookTicket: async (doctorId, patientData) => {
    await delay(600);
    const state = getState();
    const session = state.sessions[doctorId];
    if (!session || !session.active) throw new Error('العيادة مغلقة حالياً');

    const newTicket = {
      id: Math.random().toString(36).substr(2, 9),
      number: session.nextTicketNumber,
      name: patientData.name,
      phone: patientData.phone,
      isForSomeoneElse: patientData.isForSomeoneElse,
      status: 'waiting', // waiting, served, noshow, cancelled
      createdAt: new Date().toISOString()
    };

    session.tickets.push(newTicket);
    session.nextTicketNumber++;
    saveState(state);

    return newTicket;
  },

  getTicketDetails: async (ticketId) => {
    await delay(200);
    const state = getState();
    for (const docId in state.sessions) {
      const ticket = state.sessions[docId].tickets.find(t => t.id === ticketId);
      if (ticket) {
        return { ticket, doctorId: docId };
      }
    }
    return null;
  },

  // Dashboard API methods
  getDashboardData: async (doctorId) => {
    await delay(300);
    const state = getState();
    return state.sessions[doctorId] || null;
  },

  callNextPatient: async (doctorId) => {
    await delay(300);
    const state = getState();
    const session = state.sessions[doctorId];
    if (!session) return;
    
    // Find next waiting patient
    const nextPatient = session.tickets.find(t => t.status === 'waiting' && t.number > session.currentNumber);
    if (nextPatient) {
      session.currentNumber = nextPatient.number;
    } else {
       // If no next patient, just increment if we are not at max
       session.currentNumber++;
    }
    saveState(state);
    return session;
  },

  updateTicketStatus: async (doctorId, ticketId, newStatus) => {
    await delay(300);
    const state = getState();
    const session = state.sessions[doctorId];
    if (!session) return;

    const ticket = session.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = newStatus;
    }
    saveState(state);
    return session;
  },
  
  toggleSession: async (doctorId, active) => {
      await delay(300);
      const state = getState();
      const session = state.sessions[doctorId];
      if (session) {
          session.active = active;
          if (active && session.currentNumber === 0) {
              session.currentNumber = 0;
          }
      }
      saveState(state);
      return session;
  }
};
