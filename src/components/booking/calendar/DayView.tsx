import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { getAllRooms } from '../../../services/RoomService';
import GlobalContext from '../../../context/GlobalContext';
import { getDayBookings } from '../../../services/BookingService';
import TimeTable from './TimeTable';
import DragAndAddBooking from '../DragAndAddBooking';
import { Booking, Room } from '../../Interfaces';
import BookingForm from '../BookingForm';

interface DayViewProps {
  day: dayjs.Dayjs[];
}

const DayView = ({ day }: DayViewProps) => {
  const { dayIndex, showBookingForm, fetch, setFetch } =
    useContext(GlobalContext);
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
      // console.log('Day booking', bookings);
      setDayBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Render booking when date or time or room changes
  useEffect(() => {
    fetchDayBookings();
    setFetch(false);
  }, [currentDate, fetch]);

  return (
    <div className="h-full w-full flex">
      {/* Fixed Time column */}
      <TimeTable day={day} currentDay={currentDateObj} />

      {/* Scrollable Room Columns */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-max bg-green-200">
          <thead>
            <tr>
              {roomNames.map((roomName, idx) => (
                <th
                  key={idx}
                  className="border-b border-t border-r border-white select-none p-1 h-12 w-28">
                  <div className="text-gray-700 text-sm text-center">
                    {roomName}
                  </div>
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
      {showBookingForm && <BookingForm />}
    </div>
  );
};

export default DayView;
