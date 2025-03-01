import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction } from 'react';

interface BookingSelectionType {
  roomName: string | null;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
  details: string | null;
}

interface DeleteBooking {
  bookingId: number;
  isRecurrence: boolean;
}

interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  weekIndex: number;
  setWeekIndex: Dispatch<SetStateAction<number>>;
  dayIndex: number;
  setDayIndex: Dispatch<SetStateAction<number>>;
  showBookingForm: boolean;
  view: string;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
  setView: Dispatch<SetStateAction<string>>;
  setShowBookingForm: Dispatch<SetStateAction<boolean>>;
  showAddRoomForm: boolean;
  setShowAddRoomForm: Dispatch<SetStateAction<boolean>>;
  showAddUserForm: boolean;
  setShowAddUserForm: Dispatch<SetStateAction<boolean>>;
  showUpdateRoomForm: boolean;
  setShowUpdateRoomForm: Dispatch<SetStateAction<boolean>>;
  daySelected: dayjs.Dayjs;
  setDaySelected: Dispatch<SetStateAction<dayjs.Dayjs>>;
  selectingBooking: boolean;
  setSelectingBooking: Dispatch<SetStateAction<boolean>>;
  bookingSelection: BookingSelectionType;
  setBookingSelection: Dispatch<BookingSelectionType>;
  isCellSelected: boolean;
  setIsCellSelected: Dispatch<SetStateAction<boolean>>;
  fetch: boolean;
  setFetch: Dispatch<SetStateAction<boolean>>;
  selectedDeleteBooking: DeleteBooking;
  setSelectedDeleteBooking: Dispatch<SetStateAction<DeleteBooking>>;
}

const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  weekIndex: 0,
  setWeekIndex: (index) => {},
  dayIndex: 0,
  setDayIndex: (index) => {},
  view: 'Month',
  setView: () => {},
  showBookingForm: false,
  setShowBookingForm: () => {},
  showDeleteConfirmation: false,
  setShowDeleteConfirmation: () => {},
  showAddRoomForm: false,
  setShowAddRoomForm: () => {},
  showAddUserForm: false,
  setShowAddUserForm: () => {},
  showUpdateRoomForm: false,
  setShowUpdateRoomForm: () => {},
  daySelected: dayjs(),
  setDaySelected: (day) => {},
  selectingBooking: false,
  setSelectingBooking: () => {},
  bookingSelection: {
    roomName: null,
    startTime: null,
    endTime: null,
    details: null,
  },
  setBookingSelection: () => {},
  isCellSelected: false,
  setIsCellSelected: () => {},
  fetch: false,
  setFetch: () => {},
  selectedDeleteBooking: {
    bookingId: -1,
    isRecurrence: false,
  },
  setSelectedDeleteBooking: () => {},
});

export default GlobalContext;
