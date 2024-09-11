import dayjs from "dayjs";
import React, { Dispatch, SetStateAction } from "react";

interface BookingSelectionType {
  roomName: string | null;
  startTime: dayjs.Dayjs | null;
  endTime: dayjs.Dayjs | null;
}

interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  dayIndex: number;
  setDayIndex: Dispatch<SetStateAction<number>>;
  showBookingForm: boolean;
  setShowBookingForm: Dispatch<SetStateAction<boolean>>;
  showAddRoomForm: boolean;
  setShowAddRoomForm: Dispatch<SetStateAction<boolean>>;
  daySelected: dayjs.Dayjs;
  setDaySelected: Dispatch<SetStateAction<dayjs.Dayjs>>;
  bookingSelection: BookingSelectionType;
  setBookingSelection: Dispatch<BookingSelectionType>;
  isCellSelected: boolean;
  setIsCellSelected: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  dayIndex: 0,
  setDayIndex: (index) => {},
  showBookingForm: false,
  setShowBookingForm: () => {},
  showAddRoomForm: false,
  setShowAddRoomForm: () => {},
  daySelected: dayjs(),
  setDaySelected: (day) => {},
  bookingSelection: {
    roomName: null,
    startTime: null,
    endTime: null
  },
  setBookingSelection: () => {},
  isCellSelected: false,
  setIsCellSelected: () => {},
});

export default GlobalContext;