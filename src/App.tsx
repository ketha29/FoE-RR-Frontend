import React, { useState, useContext, useEffect } from "react"
import './App.css'
import getMonth, { getDay } from "./util"
import CalendarHeader from "./components/CalendarHeader"
import Sidebar from "./components/Sidebar"
import Month from "./components/Month"
import GlobalContext from "./context/GlobalContext"
import DayView from "./components/DayView"
import CalendarHeaderDay from "./components/CalendarHeaderDay"
import BookingForm1 from "./components/BookingForm1"
import BookingForm from "./components/BookingForm"
import ListBooking from "./components/ListBooking"
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const {monthIndex, dayIndex, showBookingForm} = useContext(GlobalContext);
  const [view, setView] = useState("day");
  const [currentDay, setCurretDay] = useState(getDay());

  useEffect(( )=> {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  console.table(getMonth(3))
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ListBooking /> }></Route>
          <Route path="/booking/all" element={ <ListBooking /> }></Route>
          <Route path="/home" element={  
            <div className="h-screen flex flex-col">
              {(view === "month") && <CalendarHeader view={view} setView={setView} />}
              {(view === "day") && <CalendarHeaderDay view={view} setView={setView} />}
              <div className="flex flex-1">
                {(view === "month") && <Month month={currentMonth} />}
                {(view === "day") && <DayView day={currentDay} />}
              </div>
            </div>
          }>
          </Route>
          <Route path="/add-booking" element={ <BookingForm /> }></Route>
        </Routes>
      </BrowserRouter>
      {/* {showBookingForm && <BookingForm />} */}
      {/* <DayView day={currentDay} /> */}
      {/* <BookingForm /> */}
      {/* <div className="h-screen flex flex-col">
        {(view === "month") && <CalendarHeader view={view} setView={setView} />}
        {(view === "day") && <CalendarHeaderDay view={view} setView={setView} />}
        <div className="flex flex-1">
          <Sidebar />
          {(view === "month") && <Month month={currentMonth} />}
          {(view === "day") && <DayView day={currentDay} />}
        </div>
      </div> */}
    </React.Fragment>
  );
}

export default App