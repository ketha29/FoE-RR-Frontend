import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { getAllRooms } from '../../services/RoomService';
import GlobalContext from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import {
  isAdmin,
  isAuthenticated,
  isRegularUser,
  isSuperAdmin,
} from '../../services/AuthService';
import DayBookings from '../RenderBookings';
import { getAllBookings, getDayBookings } from '../../services/BookingService';
import TimeTable from './TimeTable';
import DragAndAddBooking from '../DragAndAddBooking';

interface DayViewProps {
  day: dayjs.Dayjs[];
}

type Room = {
  roomId: number;
  capacity: number;
  roomName: string;
  description: string;
};

interface Booking {
  bookingId: number;
  startTime: string;
  endTime: string;
  date: string;
  details: string;
  recurrence: string;
  recurrencePeriod: number;
  room: {
    roomName: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

const DayView = ({ day }: DayViewProps) => {
  const { dayIndex } = useContext(GlobalContext);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  const currentDateObj = dayjs(
    new Date(dayjs().year(), dayjs().month(), dayIndex)
  );
  const currentDate = currentDateObj.format('YYYY-MM-DD');

  // Fetch room details
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getAllRooms();
      const roomNameList = response.data.roomList.map(
        (room: Room) => room.roomName
      );
      setRoomNames(roomNameList);
    };
    fetchRooms();
  }, []);

  // Fetch the bookings for the specific date
  const fetchDayBookings = async () => {
    try {
      const response = await getDayBookings(currentDate);
      const bookings = response.data.bookingList;
      console.log('Day booking', bookings);
      setDayBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Render booking when date or time or room changes
  useEffect(() => {
    fetchDayBookings();
  }, [currentDate]);

  return (
    <div className="h-full w-full flex">
      {/* Fixed Time column */}
      <TimeTable day={day} currentDay={currentDateObj} />

      {/* Scrollable Room Columns */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-max bg-gray-50">
          <thead>
            <tr>
              {roomNames.map((roomName, idx) => (
                <th
                  key={idx}
                  className="border-t border-b border-r border-l select-none p-1 w-28">
                  <div className="text-gray-600 text-sm">{roomName}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <DragAndAddBooking
            bookings={dayBookings}
            currentDay={currentDateObj}
          />
        </table>
      </div>
    </div>
  );
};

export default DayView;
