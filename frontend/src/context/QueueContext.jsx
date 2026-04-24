import React, { createContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';

const initialState = {
  doctors: [],
  dashboardData: null,
  loading: false,
  error: null,
};

function queueReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload, loading: false };
    case 'SET_DASHBOARD_DATA':
      return { ...state, dashboardData: action.payload, loading: false };
    default:
      return state;
  }
}

export const QueueContext = createContext();

export function QueueProvider({ children }) {
  const [state, dispatch] = useReducer(queueReducer, initialState);

  const fetchDoctors = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const docs = await api.getDoctors();
      dispatch({ type: 'SET_DOCTORS', payload: docs });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const fetchDashboardData = async (doctorId) => {
     try {
         const data = await api.getDashboardData(doctorId);
         dispatch({ type: 'SET_DASHBOARD_DATA', payload: data });
     } catch(err) {
         dispatch({ type: 'SET_ERROR', payload: err.message });
     }
  };

  const callNext = async (doctorId) => {
    try {
        await api.callNextPatient(doctorId);
        await fetchDashboardData(doctorId);
    } catch(err) {
        console.error(err);
    }
  };

  const updateStatus = async (doctorId, ticketId, status) => {
      try {
          await api.updateTicketStatus(doctorId, ticketId, status);
          await fetchDashboardData(doctorId);
      } catch(err) {
          console.error(err);
      }
  }

  const toggleSession = async (doctorId, active) => {
      try {
          await api.toggleSession(doctorId, active);
          await fetchDashboardData(doctorId);
      } catch(err) {
          console.error(err);
      }
  }

  return (
    <QueueContext.Provider value={{ 
        state, 
        dispatch, 
        fetchDoctors, 
        fetchDashboardData, 
        callNext,
        updateStatus,
        toggleSession
    }}>
      {children}
    </QueueContext.Provider>
  );
}
