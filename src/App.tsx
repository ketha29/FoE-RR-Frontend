import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import getMonth, { getDay, getWeek } from './util';
import Month from './components/calendar/MonthView';
import GlobalContext from './context/GlobalContext';
import DayView from './components/calendar/DayView';
import CalendarHeader from './components/calendar/CalendarHeader';
import BookingForm from './components/BookingForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ListRoom from './components/ListRoom';
import AddRoomForm from './components/AddRoomForm';
import LoginIn from './components/LogIn';
import UpdateBooking from './components/UpdateBooking';
import WeekView from './components/calendar/WeekView';

function App() {
  const { monthIndex, weekIndex, dayIndex, showBookingForm } =
    useContext(GlobalContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentWeek, setCurrentWeek] = useState(getWeek());
  const [currentDay, setCurretDay] = useState(getDay());

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    setCurrentWeek(getWeek(weekIndex));
  }, [weekIndex]);

  useEffect(() => {
    setCurretDay(getDay(dayIndex));
  }, [dayIndex]);

  // console.table(getMonth(3))
  return (
    <React.Fragment>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/auth/login" element={<LoginIn />}></Route>
          <Route path="/booking/add-booking" element={<BookingForm />}></Route>
          <Route
            path="/booking/update-booking"
            element={<UpdateBooking />}></Route>
          <Route path="/add-room" element={<AddRoomForm />}></Route>
          <Route
            path="/booking/day"
            element={
              <div className="h-screen flex flex-col mt-36">
                <CalendarHeader />
                <div className="flex flex-1">
                  <DayView day={currentDay} />
                </div>
              </div>
            }></Route>
          <Route
            path="/booking/week"
            element={
              <div className="h-screen flex flex-col mt-36">
                <CalendarHeader />
                <div className="flex flex-1">
                  <WeekView week={currentWeek} day={currentDay} />
                </div>
              </div>
            }></Route>
          <Route
            path="/booking/month"
            element={
              <div className="h-screen flex flex-col mt-36">
                <CalendarHeader />
                <div className="flex flex-1">
                  <Month month={currentMonth} />
                </div>
              </div>
            }></Route>
          <Route path="/room/all" element={<ListRoom />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
