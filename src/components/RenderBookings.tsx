import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useEffect, useRef, useState } from 'react';
import { deleteBooking } from '../services/BookingService';
import { isAuthenticated } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import BookingXtaDetails from './BookingXtaDetails';

dayjs.extend(isBetween);

interface RenderBookingsProps {
  date: string;
  bookings: Booking[];
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

const RenderBookings = ({ date, bookings }: RenderBookingsProps) => {
  const navigator = useNavigate();
  const authenticated = isAuthenticated();
  const [showXtraBookingDetails, setShowXtraBookingDetails] = useState(false);
  const [moveBlock, setMoveBlock] = useState(false);
  const bookingDetailsRef = useRef<HTMLDivElement>(null);

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
    console.log(showXtraBookingDetails);
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
    <div className="h-full w-full">
      {bookings.map((booking) => {
        const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
        const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);

        const startOffsetMinutes = bookingStart.diff(
          dayjs(`${date} 00:00`),
          'minute'
        );
        const spanMinutes = bookingEnd.diff(bookingStart, 'minute');
        // console.log('Bookings length:', bookings.length);
        // console.log('Start of minutes: ', startOffsetMinutes);

        const leftPercentage =
          (startOffsetMinutes / 60 - bookingStart.hour()) * 100;
        const heightPercentage = (spanMinutes / 60) * 102;

        // Delete selected booking and re-render bookings
        const handleDelete = async () => {
          try {
            await deleteBooking(booking.bookingId);
            handleCloseDetails();
            // fetchDayBookings();
          } catch (error) {
            console.error('Error deleting booking:', error);
          }
        };

        return (
          startOffsetMinutes >= 0 &&
          authenticated && (
            // Display booking according to the start time and time duration
            <>
              <div
                onClick={() => handleClick()}
                className="absolute group z-10 bg-blue-300 rounded-md h-full flex justify-start items-center"
                key={booking.bookingId}
                style={{
                  top: 0,
                  left: `${leftPercentage}%`,
                  height: `${heightPercentage}%`,
                  width: '85%',
                }}>
                <div className="absolute ml-1 text-gray-600 text-xs select-none">
                  {dayjs(bookingStart).format('h:mma')} -{' '}
                  {dayjs(bookingEnd).format('h:mma')}
                </div>
              </div>
              <div
                className="z-20"
                ref={bookingDetailsRef}
                style={{
                  top: '120px',
                  transformOrigin: 'top',
                  transform: moveBlock
                    ? 'translateX(125px)'
                    : 'translateX(60px)',
                  transition: 'transform 0.4s ease',
                  position: 'absolute',
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
            </>
          )
        );
      })}
    </div>
  );
};

export default RenderBookings;
