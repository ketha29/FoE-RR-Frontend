import { ReactNode, useState } from 'react';
import GlobalContext from './GlobalContext';
import dayjs from 'dayjs';

interface ContextWrapperProps {
  children: ReactNode;
}

const ContextWrapper = ({ children }: ContextWrapperProps) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [dayIndex, setDayIndex] = useState(dayjs().date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [daySelected, setDaySelected] = useState(dayjs());

  return (
    <GlobalContext.Provider 
      value={{ 
        monthIndex, 
        setMonthIndex, 
        dayIndex, 
        setDayIndex, 
        showBookingForm, 
        setShowBookingForm, 
        showAddRoomForm, 
        setShowAddRoomForm, 
        daySelected, 
        setDaySelected,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
