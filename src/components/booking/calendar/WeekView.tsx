import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import { getWeekBookings } from '../../../services/BookingService';
import { getAllRooms } from '../../../services/RoomService';
import DragAndAddBooking from '../DragAndAddBooking';
import TimeTable from './TimeTable';
import { Booking, Room } from '../../Interfaces';
import BookingForm from '../BookingForm';

interface WeekViewProps {
  week: dayjs.Dayjs[];
  day: dayjs.Dayjs[];
}

const WeekView = ({ day, week }: WeekViewProps) => {
  const [weekBookings, setWeekBookings] = useState<Booking[]>([]);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const { weekIndex, showBookingForm } = useContext(GlobalContext);

  // Get start and end of the current week for that date
  const startOfWeek = dayjs()
    .week(weekIndex)
    .startOf('week')
    .format('YYYY-MM-DD');
  const endOfWeek = dayjs().week(weekIndex).endOf('week').format('YYYY-MM-DD');

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
  const fetchWeekBookings = async () => {
    try {
      const response = await getWeekBookings(startOfWeek, endOfWeek);
      const bookings = response.data.bookingList;
      // console.log('Week bookings', bookings);
      setWeekBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Render booking when date or time or room changes
  useEffect(() => {
    fetchWeekBookings();
  }, [weekIndex]);

  return (
    <div>
      {week.map((currentDay, dayIndex) => {
        return (
          <div className="w-full flex" key={dayIndex}>
            {/* Fixed Time column */}
            <TimeTable day={day} currentDay={currentDay} />

            {/* Scrollable Room Columns */}
            <div key={dayIndex} className="flex-1 overflow-x-auto">
              <table className="w-max bg-green-200">
                <thead>
                  <tr>
                    {roomNames.map((roomName, roomIndex) => (
                      <th
                        key={roomIndex}
                        className="border-t border-b border-r border-white select-none p-1 w-28 h-12">
                        <div className="text-gray-600 text-sm text-center">
                          {roomName}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <DragAndAddBooking
                  bookings={weekBookings}
                  currentDay={currentDay}
                />
              </table>
            </div>
          </div>
        );
      })}
      <div>{showBookingForm && <BookingForm />}</div>
    </div>
  );
};

export default WeekView;
