import dayjs from "dayjs";
import React, { Dispatch, SetStateAction } from "react";

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
});

export default GlobalContext;