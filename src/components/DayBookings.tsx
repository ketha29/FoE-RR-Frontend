import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useRef, useState } from "react";
import { deleteBooking, getAllBookings } from "../services/BookingService";
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
  const navigator = useNavigate();
  const authenticated = isAuthenticated();
  const admin = isSuperAdmin();
  const superAdmin = isAdmin();
  const regularUser = isRegularUser();
  const [hourBooking, setHourBooking] = useState<Booking[]>([]);
  const [showXtraBookingDetails, setShowXtraBookingDetails] = useState(false);
  const [moveBlock, setMoveBlock] = useState(false);
  const bookingDetailsRef = useRef<HTMLDivElement>(null);

  // Close the extra details block if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (bookingDetailsRef.current && !bookingDetailsRef.current.contains(event.target as Node)) {
            setShowXtraBookingDetails(false);
            setMoveBlock(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show extra details block and moving transition when clicking the booking
  const handleClick = (bookingId: number) => {    
    setMoveBlock(!moveBlock);
    setShowXtraBookingDetails(!showXtraBookingDetails);
  }
  // Hide the extra details and set the transition of details block to false when clicking the close button
  const handleCloseDetails = () => {
    setMoveBlock(false);
    setShowXtraBookingDetails(false);
    navigator('/booking');    
  }  
  // Render update booking form when clicking the edit button
  const handleClickEdit = (booking: Booking) => {
    console.log('event selected', booking.bookingId);
    navigator('/booking/update-booking', { state: { booking } });
  }

  // Filter bookings according to the date, time and room
  const fetchBookings = async () => {
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

  // Render booking when date or time or room changes
  useEffect(() => {
    fetchBookings();
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

        // Delete selected booking and re-render bookings
        const handleDelete = async () => {
          try {
            await deleteBooking(booking.bookingId);
            handleCloseDetails();
            fetchBookings();
          } catch(error) {
            console.error("Error deleting booking:", error);
          }
        }
                
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
                ref={bookingDetailsRef}
                style={{ 
                  transformOrigin: "bottom center",
                  transform: moveBlock ? "translateY(-20px)" : "translateY(0px)",
                  transition: "transform 0.4s ease"
              }}
              >
                {/* Show the extra details for the bookings */}
                {showXtraBookingDetails && 
                  <BookingXtaDetails 
                    closeBookingDetails={handleCloseDetails}
                    editBookingDetails={() => handleClickEdit(booking)}
                    deleteBookingDetails={handleDelete}
                    booking={booking}
                  />
                }
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}

export default DayBookings;