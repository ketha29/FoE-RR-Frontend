import { ReactNode, useState } from 'react';
import GlobalContext from './GlobalContext';
import dayjs from 'dayjs';

interface ContextWrapperProps {
  children: ReactNode;
}

const ContextWrapper = ({ children }: ContextWrapperProps) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [dayIndex, setDayIndex] = useState(dayjs().date());
  const [view, setView] = useState("Month");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [bookingSelection, setBookingSelection] = useState<{ 
    roomName: string | null;
    startTime: dayjs.Dayjs | null;
    endTime: dayjs.Dayjs | null 
  }>({
    roomName: null,
    startTime: null,
    endTime: null
  });
  const [isCellSelected, setIsCellSelected] = useState(false);

  return (
    <GlobalContext.Provider 
      value={{ 
        monthIndex, 
        setMonthIndex, 
        dayIndex, 
        setDayIndex,
        view,
        setView,
        showBookingForm, 
        setShowBookingForm, 
        showAddRoomForm, 
        setShowAddRoomForm, 
        daySelected, 
        setDaySelected,
        bookingSelection,
        setBookingSelection,
        isCellSelected,
        setIsCellSelected,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
