import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../context/GlobalContext';
import TimeTable from './TimeTable';
import { getAllRooms } from '../../services/RoomService';
import DragAndAddBooking from '../DragAndAddBooking';
import { getWeekBookings } from '../../services/BookingService';

interface WeekViewProps {
  week: dayjs.Dayjs[];
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

const WeekView = ({ day, week }: WeekViewProps) => {
  const [weekBookings, setWeekBookings] = useState<Booking[]>([]);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const { dayIndex, weekIndex } = useContext(GlobalContext);

  // const currentDateObj = dayjs(new Date(dayjs().year(), dayjs().month(), currentDay.date()));
  const currentDateObj = dayjs(
    new Date(dayjs().year(), dayjs().month(), dayIndex)
  );
  const today = dayjs();

  // Get start and end of the current week for that date
  const startOfWeek = dayjs()
    .week(weekIndex)
    .startOf('week')
    .format('YYYY-MM-DD');
  const endOfWeek = dayjs().week(weekIndex).endOf('week').format('YYYY-MM-DD');
  // console.log('Start of week:', startOfWeek);
  // console.log('End of week:', endOfWeek);
  // const startOfWeek = currentDateObj.startOf('week').format('YYYY-MM-DD');
  // const endOfWeek = currentDateObj.endOf('week').format('YYYY-MM-DD');

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
      console.log('Week bookings', bookings);
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
          <div className="w-full flex">
            <TimeTable day={day} currentDay={currentDay} />
            <div key={dayIndex} className="flex-1 overflow-x-auto">
              <table className="w-max bg-gray-50">
                <thead>
                  <tr>
                    {roomNames.map((roomName, roomIndex) => (
                      <th
                        key={roomIndex}
                        className="border-t border-b border-r border-l select-none p-1 w-28">
                        <div className="text-gray-600 text-sm">{roomName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <DragAndAddBooking
                  bookings={weekBookings}
                  currentDay={currentDay}
                />
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
