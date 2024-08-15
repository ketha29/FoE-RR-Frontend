import React, { Dispatch, SetStateAction } from "react";

interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  dayIndex: number;
  setDayIndex: Dispatch<SetStateAction<number>>;
  showBookingForm: boolean;
  setShowBookingForm: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  dayIndex: 0,
  setDayIndex: (index) => {},
  showBookingForm: false,
  setShowBookingForm: () => {},
});

export default GlobalContext;