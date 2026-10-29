import React, { createContext, useState, useEffect } from 'react';
import { initialVisitors, initialParcels } from '../data/mockData';

export const GuardDataContext = createContext();

export const GuardDataProvider = ({ children }) => {
  const [visitorRequests, setVisitorRequests] = useState([]);
  const [parcelRequests, setParcelRequests] = useState([]);
  const [insideVisitors, setInsideVisitors] = useState([]);
  const [parcelRecords, setParcelRecords] = useState([]);

  useEffect(() => {
    // Load initial data from mockData.js
    setVisitorRequests(initialVisitors.filter(v => v.status === 'Pending Approval'));
    setParcelRequests(initialParcels.filter(p => p.status === 'Pending Approval'));
    setInsideVisitors(initialVisitors.filter(v => v.status === 'Checked In'));
    setParcelRecords(initialParcels);
  }, []);

  const addVisitorRequest = (visitorData) => {
    const newRequest = {
      id: `VISITOR-${Date.now()}`,
      requestTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Approval',
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      qrCode: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      ...visitorData
    };
    setVisitorRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const addParcelRequest = (parcelData) => {
    const newRequest = {
      id: `PARCEL-${Date.now()}`,
      receivedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending Approval',
      ...parcelData
    };
    setParcelRequests(prev => [newRequest, ...prev]);
    setParcelRecords(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const markVisitorCheckIn = (visitorId) => {
    // Find in visitorRequests or initial mock data
    let visitor = visitorRequests.find(v => v.id === visitorId);
    if (!visitor) {
      // If not in pending, check if it exists in mock data / expected list
      visitor = initialVisitors.find(v => v.id === visitorId);
    }

    if (visitor) {
      const updatedVisitor = {
        ...visitor,
        status: 'Checked In',
        entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Remove from pending if it was there
      setVisitorRequests(prev => prev.filter(v => v.id !== visitorId));
      // Add to inside visitors
      setInsideVisitors(prev => [updatedVisitor, ...prev]);
    }
  };

  const markVisitorCheckOut = (visitorId) => {
    setInsideVisitors(prev => prev.filter(v => v.id !== visitorId));
  };

  const updateParcelStatus = (parcelId, newStatus) => {
    setParcelRecords(prev => prev.map(p => {
      if (p.id === parcelId) {
        return {
          ...p,
          status: newStatus,
          deliveredTime: newStatus === 'Delivered to Resident' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : p.deliveredTime
        };
      }
      return p;
    }));
    
    // Also update pending list if status changed from Pending
    if (newStatus !== 'Pending Approval') {
      setParcelRequests(prev => prev.filter(p => p.id !== parcelId));
    }
  };

  return (
    <GuardDataContext.Provider value={{
      visitorRequests,
      parcelRequests,
      insideVisitors,
      parcelRecords,
      addVisitorRequest,
      addParcelRequest,
      markVisitorCheckIn,
      markVisitorCheckOut,
      updateParcelStatus
    }}>
      {children}
    </GuardDataContext.Provider>
  );
};
