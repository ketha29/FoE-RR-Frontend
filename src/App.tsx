import React, { useState, useContext, useEffect } from "react"
import './App.css'
import getMonth, { getDay } from "./util"
import CalendarHeader from "./components/calendar/CalendarHeader"
import Month from "./components/calendar/Month"
import GlobalContext from "./context/GlobalContext"
import DayView from "./components/calendar/DayView"
import CalendarHeaderDay from "./components/calendar/CalendarHeaderDay"
import BookingForm from "./components/BookingForm"
import ListBooking from "./components/ListBooking"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import ListRoom from "./components/ListRoom"
import AddRoomForm from "./components/AddRoomForm"
import LoginIn from "./components/SignIn"

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const {monthIndex, dayIndex, showBookingForm} = useContext(GlobalContext);
  const [view, setView] = useState("month");
  const [currentDay, setCurretDay] = useState(getDay());

  useEffect(( )=> {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  console.table(getMonth(3))
  return (
    <React.Fragment>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/auth/login" element={ <LoginIn/> }></Route>
          <Route path="/add-booking" element={ <BookingForm /> }></Route>
          <Route path="/booking/all" element={ <ListBooking /> }></Route>
          <Route path="/add-room" element={ <AddRoomForm /> }></Route>
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
          <Route path="/room/all" element={ <ListRoom /> } />
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