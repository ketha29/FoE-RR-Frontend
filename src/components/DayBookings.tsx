import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { getAllBookings } from "../services/BookingService";
import { isAdmin, isAuthenticated, isRegularUser, isSuperAdmin } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import BookingXtaDetails from "./BookingXtaDetails";

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
  const [showXtraBookingDetails, setShowXtraBookingDetails] = useState(false);
  const [moveBlock, setMoveBlock] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  // Show extra details block and moving transition when clicking the booking
  const handleClick = (bookingId: number) => {    
    setSelectedBookingId((selectedBookingId === bookingId) ? null : bookingId);
    setMoveBlock(!moveBlock);
    setShowXtraBookingDetails(!showXtraBookingDetails);
    console.log(selectedBookingId, bookingId);
  }
  // Hide the extra details and set the transition of details block to false when clicking the close button
  const handleCloseDetails = () => {
    setSelectedBookingId(null);
    setMoveBlock(false);
    setShowXtraBookingDetails(false);
    console.log(selectedBookingId);
    
  }  
  const navigator = useNavigate();
  // Render update booking form when clicking the edit button
  const handleClickEdit = (booking: Booking) => {
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
              onClick={() => handleClick(booking.bookingId)}
              className="absolute group z-20 bg-blue-300 rounded-md h-full flex justify-start items-center hover:bg-blue-400 transition-transform ease-in-out"
              key={idx}
              style={{
                top: 0,
                left: `${leftPercentage}%`,
                width: `${widthPercentage}%`,
                height: "85%",
              }}
            >
              <div className="absolute ml-1 text-gray-600 text-xs">
                {dayjs(bookingStart).format('h:mma')} - {dayjs(bookingEnd).format('h:mma')}
              </div>
              {/* Transition style for extra details block */}
              <div
                style={{ 
                  transformOrigin: "bottom center",
                  transform: moveBlock ? "translateY(-20px)" : "translateY(0px)",
                  transition: "transform 0.4s ease"
              }}
              >
                {/* Show the extra details for the bookings */}
                {showXtraBookingDetails && <BookingXtaDetails closeBookingDetails={handleCloseDetails} editBookingDetails={() => handleClickEdit(booking)}  booking={booking} />}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}

export default DayBookings;