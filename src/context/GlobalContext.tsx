import React, { Dispatch, SetStateAction } from "react";
import { Dayjs } from "dayjs";

// Define an interface for your context values
interface GlobalContextType {
  monthIndex: number;
  setMonthIndex: Dispatch<SetStateAction<number>>;
  dayIndex: number;
  setDayIndex: Dispatch<SetStateAction<number>>;
}

// Initialize context with a default value
const GlobalContext = React.createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  dayIndex: 0,
  setDayIndex: (index) => {},
});

export default GlobalContext;
