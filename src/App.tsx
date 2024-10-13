import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import getMonth, { getDay, getWeek } from './util';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CalendarHeader from './components/booking/calendar/CalendarHeader';
import DayView from './components/booking/calendar/DayView';
import Month from './components/booking/calendar/MonthView';
import WeekView from './components/booking/calendar/WeekView';
import UpdateBooking from './components/booking/UpdateBooking';
import LoginIn from './components/LogIn';
import ListRoom from './components/room/ListRoom';
import GlobalContext from './context/GlobalContext';
import NavBar from './components/NavBar';
import ListUser from './components/user/ListUser';

function App() {
  const { monthIndex, weekIndex, dayIndex } = useContext(GlobalContext);
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
          <Route
            path="/booking/update-booking"
            element={<UpdateBooking />}></Route>
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
          <Route path="/user/all" element={<ListUser />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
