import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { getAllBookings } from "../services/BookingService";
import { isAdmin, isAuthenticated, isRegularUser, isSuperAdmin } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

dayjs.extend(isBetween);

interface DayBookingsProps {
    hour: dayjs.Dayjs;
    roomName: string;
    date: string;
}

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
  }
}

const DayBookings = ({ hour, roomName, date }: DayBookingsProps) => {
  const authenticated = isAuthenticated();
  const admin = isSuperAdmin();
  const superAdmin = isAdmin();
  const regularUser = isRegularUser();
  const [hourBooking, setHourBooking] = useState<Booking[]>([]);
  const navigator = useNavigate();
  const handleClick = (booking: Booking) => {
    console.log('event selected', booking.bookingId);
    navigator('/booking/update-booking', { state: { booking } });
  }

  // Filter bookings
  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllBookings();
      const bookings = response.data.bookingList;
      const currentHourBookings = bookings.filter((booking: Booking) => {
        const bookingDate = dayjs(booking.date).format('YYYY-MM-DD');
        const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
        return (
          bookingDate === date &&
          booking.room.roomName === roomName &&
          bookingStart.isSame(hour, 'hour')
        );
      });
      setHourBooking(currentHourBookings);
    }
    fetchData();
  }, [hour, roomName, date]);

  return (
    <div className="h-full w-full">
      {hourBooking.map((booking, idx) => {
        const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
        const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);
        
        const startOffsetMinutes = bookingStart.diff(dayjs(`${date} 00:00`), 'minute');
        const spanMinutes = bookingEnd.diff(bookingStart, 'minute');

        const leftPercentage = ((startOffsetMinutes / 60) - bookingStart.hour()) * 100;
        const widthPercentage = (spanMinutes / 60) * 101;
                
        return (
          startOffsetMinutes >= 0 && authenticated && (
            // Display booking according to the start time and time duration
            <div
              onClick={() => handleClick(booking)}
              className="absolute group z-20 bg-blue-300 text-gray-600 text-xs rounded-md h-full flex justify-start items-center hover:bg-blue-400 transition-transform ease-in-out"
              key={idx}
              style={{
                top: 0,
                left: `${leftPercentage}%`,
                width: `${widthPercentage}%`,
                height: "85%",
              }}
            >
              <div className="absolute ml-1 text-gray-700">
                {dayjs(bookingStart).format('h:mma')} - {dayjs(bookingEnd).format('h:mma')}
              </div>
              {/* Extra details for the booking */}
              <div 
                className="absolute bottom-full mb-1 bg-blue-500 transform scale-105 text-white px-2 py-1 rounded hidden group-hover:block transition-transform duration-300 ease-in-out" 
                style={{ minWidth: "120px", maxWidth: "180px" }}
              >
                {booking.details !== '' ? booking.details : 'No booking details'} <br />
                Booked by: {booking.user.firstName} {booking.user.lastName.charAt(0)} <br />
                Recurrence: {booking.recurrence} {booking.recurrencePeriod !== 0 && booking.recurrencePeriod}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}

export default DayBookings;