import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../../services/BookingService';

interface DayProps {
  day: dayjs.Dayjs;
  rowIdx: number;
}

interface Booking {
  startTime: string;
  endTime: string;
  details: string;
  recurrence: string;
  recurrencePeriod: number;
}

const Day = ({ day, rowIdx }: DayProps) => {
  const [dayBooking, setDayBooking] = useState<Booking[]>([]);
  const [dayBookingCount, setDayBookingCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllBookings();
      const bookings = response.data.bookingList;
      const currentDayBookings = bookings.filter(
        (booking: { date: dayjs.Dayjs }) =>
          dayjs(booking.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      );
      setDayBooking(currentDayBookings);
      setDayBookingCount(currentDayBookings.length);
    };
    fetchData();
  }, [day]);

  const { setShowBookingForm, setDaySelected } = useContext(GlobalContext);
  const navigator = useNavigate();
  // function to mark the current date background to blue
  const getCurrentDayClass = () => {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : '';
  };
  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>
        )}
        <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
          {day.format('DD')}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowBookingForm(true);
          navigator('/booking/add-booking');
        }}>
        <div className="bg-blue-200 p-1 mr-3 text-gray-500 text-sm rounded mb-1">
          Number of bookings: {dayBookingCount}
        </div>
        {/* {dayBooking.map((booking, idx) => (
          <div
            className="bg-blue-200 p-1 mr-3 text-gray-500 text-sm rounded mb-1"
            key={idx}>
            <div className="truncate">{booking.details}</div>
            <div className="absolute bottom-full mb-1 bg-sky-400 transform text-white px-2 py-1 rounded">
              {booking.startTime} - {booking.endTime} <br />
              Recurrence: {booking.recurrence} <br />
              Period: {booking.recurrencePeriod}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Day;
