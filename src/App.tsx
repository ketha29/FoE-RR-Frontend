import React, { useState, useContext, useEffect } from "react"
import './App.css'
import getMonth, { getDay } from "./util"
import Month from "./components/calendar/Month"
import GlobalContext from "./context/GlobalContext"
import DayView from "./components/calendar/DayView"
import CalendarHeaderDay from "./components/calendar/CalendarHeader"
import BookingForm from "./components/BookingForm"
import ListBooking from "./components/ListBooking"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from "./components/NavBar"
import ListRoom from "./components/ListRoom"
import AddRoomForm from "./components/AddRoomForm"
import LoginIn from "./components/LogIn"
import UpdateBooking from "./components/UpdateBooking"

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const {monthIndex, dayIndex, view} = useContext(GlobalContext);
  // const [view, setView] = useState("Month");
  const [currentDay, setCurretDay] = useState(getDay());

  useEffect(()=> {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    setCurretDay(getDay(dayIndex));
  }, [dayIndex]);

  // console.table(getMonth(3))
  return (
    <React.Fragment>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path="/auth/login" element={ <LoginIn/> }></Route>
          <Route path="/booking/add-booking" element={ <BookingForm /> }></Route>
          <Route path="/booking/update-booking" element={ <UpdateBooking /> }></Route>
          <Route path="/booking/all" element={ <ListBooking /> }></Route>
          <Route path="/add-room" element={ <AddRoomForm /> }></Route>
          <Route path="/booking" element={  
            <div className="h-screen flex flex-col">
              <CalendarHeaderDay />
              <div className="flex flex-1">
                {(view === "Month") && <Month month={currentMonth} />}
                {(view === "Day") && <DayView day={currentDay} />}
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