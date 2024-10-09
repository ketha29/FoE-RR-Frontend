import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  deleteBooking,
  getAllBookings,
  getWeekBookings,
} from '../services/BookingService'; // Adjusted to get week bookings
import {
  isAdmin,
  isAuthenticated,
  isRegularUser,
  isSuperAdmin,
} from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import BookingXtaDetails from './BookingXtaDetails';
import GlobalContext from '../context/GlobalContext';

dayjs.extend(isBetween);

interface RenderBookingsProps {
  bookings: Booking[];
  currentDay: dayjs.Dayjs;
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
  };
}

const RenderWeekBookings = ({ bookings, currentDay }: RenderBookingsProps) => {
  const navigator = useNavigate();
  const authenticated = isAuthenticated();
  const [showXtraBookingDetails, setShowXtraBookingDetails] = useState(false);
  const [moveBlock, setMoveBlock] = useState(false);
  const bookingDetailsRef = useRef<HTMLDivElement>(null);
  const { dayIndex } = useContext(GlobalContext);

  const currentDateObj = currentDay;
  // Get start and end of the current week for that date
  const weekStart = currentDateObj.startOf('week');
  const weekEnd = currentDateObj.endOf('week');

  // Group bookings by date
  const bookingsByDay = Array(7)
    .fill(null)
    .map(() => [] as Booking[]); // Create an array with 7 slots (for each day)

  bookings.forEach((booking) => {
    const bookingDate = dayjs(booking.date);
    const dayIndex = bookingDate.diff(weekStart, 'day');
    if (dayIndex >= 0 && dayIndex < 7) {
      bookingsByDay[dayIndex].push(booking); // Place the booking in the correct day slot
    }
  });

  // Close the extra details block if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bookingDetailsRef.current &&
        !bookingDetailsRef.current.contains(event.target as Node)
      ) {
        setShowXtraBookingDetails(false);
        setMoveBlock(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show extra details block and moving transition when clicking the booking
  const handleClick = () => {
    setMoveBlock(!moveBlock);
    setShowXtraBookingDetails(!showXtraBookingDetails);
  };

  // Hide the extra details and set the transition of details block to false when clicking the close button
  const handleCloseDetails = () => {
    setMoveBlock(false);
    setShowXtraBookingDetails(false);
    navigator('/booking');
  };

  // Render update booking form when clicking the edit button
  const handleClickEdit = (booking: Booking) => {
    navigator('/booking/update-booking', { state: { booking } });
  };

  return (
    <div className="h-full w-full grid grid-cols-7 gap-4">
      {bookingsByDay.map((dayBookings, dayIndex) => {
        const currentDay = weekStart.add(dayIndex, 'day').format('dddd, MMM D');

        return (
          <div key={dayIndex} className="relative border p-2">
            <h3 className="text-center font-bold">{currentDay}</h3>

            {dayBookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings</p>
            ) : (
              dayBookings.map((booking, idx) => {
                const bookingStart = dayjs(
                  `${booking.date} ${booking.startTime}`
                );
                const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);

                const startOffsetMinutes = bookingStart.diff(
                  dayjs(`${booking.date} 00:00`),
                  'minute'
                );
                const spanMinutes = bookingEnd.diff(bookingStart, 'minute');

                const topPercentage = (startOffsetMinutes / (24 * 60)) * 100;
                const heightPercentage = (spanMinutes / (24 * 60)) * 100;

                // Delete selected booking and re-render bookings
                const handleDelete = async () => {
                  try {
                    await deleteBooking(booking.bookingId);
                    handleCloseDetails();
                  } catch (error) {
                    console.error('Error deleting booking:', error);
                  }
                };

                return (
                  startOffsetMinutes >= 0 &&
                  authenticated && (
                    <div
                      onClick={() => handleClick()}
                      className="absolute group bg-blue-300 rounded-md flex justify-start items-center"
                      key={idx}
                      style={{
                        top: `${topPercentage}%`,
                        height: `${heightPercentage}%`,
                        width: '85%',
                      }}>
                      <div className="absolute ml-1 text-gray-600 text-xs select-none">
                        {dayjs(bookingStart).format('h:mma')} -{' '}
                        {dayjs(bookingEnd).format('h:mma')}
                      </div>
                      {/* Transition style for extra details block */}
                      <div
                        ref={bookingDetailsRef}
                        style={{
                          top: '120px',
                          transformOrigin: 'top',
                          transform: moveBlock
                            ? 'translateX(125px)'
                            : 'translateX(60px)',
                          transition: 'transform 0.4s ease',
                          position: 'absolute',
                          zIndex: 50,
                          overflow: 'visible',
                        }}>
                        {/* Show the extra details for the bookings */}
                        {showXtraBookingDetails && (
                          <BookingXtaDetails
                            closeBookingDetails={handleCloseDetails}
                            editBookingDetails={() => handleClickEdit(booking)}
                            deleteBookingDetails={handleDelete}
                            booking={booking}
                          />
                        )}
                      </div>
                    </div>
                  )
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderWeekBookings;
