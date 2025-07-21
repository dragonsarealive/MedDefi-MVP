'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Appointment {
  id: string;
  doctorName: string;
  doctorId: string;
  serviceName: string;
  serviceId: string;
  date: string;
  time: string;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  transactionHash?: string;
  createdAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  role: 'patient' | 'doctor';
  createdAt: string;
  address?: string;
  appointments?: Appointment[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  getAppointments: () => Appointment[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('meddefi_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('meddefi_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('meddefi_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('meddefi_user');
    }
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (!user) return;

    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      appointments: [...(user.appointments || []), newAppointment],
    };

    handleSetUser(updatedUser);
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    if (!user || !user.appointments) return;

    const updatedAppointments = user.appointments.map(appointment =>
      appointment.id === appointmentId ? { ...appointment, ...updates } : appointment
    );

    const updatedUser = {
      ...user,
      appointments: updatedAppointments,
    };

    handleSetUser(updatedUser);
  };

  const getAppointments = (): Appointment[] => {
    return user?.appointments || [];
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      isLoading,
      addAppointment,
      updateAppointment,
      getAppointments
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 