import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { getAllRooms } from '../../services/RoomService';
import {
  isAdmin,
  isAuthenticated,
  isRegularUser,
  isSuperAdmin,
} from '../../services/AuthService';
import GlobalContext from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import RenderBookings from './RenderBookings';
import { getDay } from '../../util';

interface DragAndAddBookingpRrops {
  bookings: Booking[];
  currentDay: dayjs.Dayjs;
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
  startDate: string;
  endDate: string;
  details: string;
  recurrence: string;
  recurrencePeriod: number;
  room: {
    roomName: string;
  };
  user: {
    firstName: string;
    lastName: string;
    userType: string;
  };
}

const DragAndAddBooking = ({
  bookings,
  currentDay,
}: DragAndAddBookingpRrops) => {
  const navigator = useNavigate();
  const authenticated = isAuthenticated();
  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const { bookingSelection, setBookingSelection, daySelected, setDaySelected } =
    useContext(GlobalContext);
  const [selecting, setSelecting] = useState(false);

  const hoursInDay = getDay(currentDay.date());
  const currentDateObj = currentDay;
  const currentDate = currentDateObj.format('YYYY-MM-DD');
  const startTimeDay = dayjs(
    new Date(dayjs().year(), dayjs().month(), currentDay.date(), 8, 0)
  );
  const endTimeDay = dayjs(
    new Date(dayjs().year(), dayjs().month(), currentDay.date(), 17, 0)
  );
  const isWeekend = currentDateObj.day() === 0 || currentDateObj.day() === 6;
  const isAcademicHour = (hour: dayjs.Dayjs) =>
    hour.isBetween(startTimeDay, endTimeDay, null, '[)');

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

  // Checks if the room is booked for the specific time
  const isTimeBooked = (roomName: string, time: dayjs.Dayjs): boolean => {
    // Return true, if any booking that is selected is already booked else return false
    return bookings.some((booking) => {
      const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
      const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);
      return (
        booking.room.roomName === roomName &&
        time.isBetween(bookingStart, bookingEnd, null, '[)')
      );
    });
  };

  // Triggers the start of the selection process. Sets the initial time for booking
  const handleMouseDown = (roomName: string, time: dayjs.Dayjs) => {
    console.log('Current date: ', currentDate);

    if (isTimeBooked(roomName, time)) {
      return;
    }
    setSelecting(true);
    if (!isWeekend && isAcademicHour(time) && regularUser) {
      setBookingSelection({ roomName, startTime: time, endTime: time });
    } else if (admin || superAdmin) {
      setBookingSelection({
        roomName,
        startTime: time,
        endTime: time.add(1, 'hour'),
      });
    }
    setDaySelected(currentDateObj);
  };

  // When dragging the mouse, function updates the booking's end time
  const handleMouseMove = (roomName: string, time: dayjs.Dayjs) => {
    if (selecting && isTimeBooked(roomName, time)) {
      setSelecting(false);
      return;
    }
    if (selecting && roomName === bookingSelection.roomName) {
      if (time.isAfter(bookingSelection.startTime)) {
        setBookingSelection({ ...bookingSelection, endTime: time });
      } else {
        setBookingSelection({ ...bookingSelection, startTime: time });
      }
    }
  };

  // End the booking selection
  // If the start time and end time are valid, user is redricted to the booking page
  const handleMouseUp = () => {
    setSelecting(false);
    if (
      !(
        bookingSelection.endTime &&
        !isWeekend &&
        isAcademicHour(bookingSelection.endTime)
      ) &&
      regularUser
    ) {
      setBookingSelection({ ...bookingSelection, endTime: endTimeDay });
    }
    if (
      !(
        bookingSelection.startTime === bookingSelection.endTime ||
        bookingSelection.startTime === null ||
        bookingSelection.endTime === null
      ) &&
      authenticated
    ) {
      navigator('/booking/add-booking');
    }
    console.log(
      bookingSelection.startTime?.format('HH:mm'),
      bookingSelection.endTime?.format('HH:mm')
    );
  };

  const setIsCellSelected = (
    roomName: string,
    time: dayjs.Dayjs,
    currentDateObj: dayjs.Dayjs
  ) => {
    const { roomName: selectedRoom, startTime, endTime } = bookingSelection;
    // Check if selected room, time, and date match
    const isSameDate = currentDateObj.isSame(daySelected, 'day');
    return (
      selectedRoom === roomName &&
      startTime &&
      endTime &&
      time.isBetween(startTime, endTime, null, '[)') &&
      isSameDate
    );
  };

  const isStartOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return (
      bookingSelection.roomName === roomName &&
      bookingSelection.startTime?.isSame(time, 'minute')
    );
  };

  const isEndOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return (
      bookingSelection.roomName === roomName &&
      bookingSelection.endTime?.isSame(time.add(1, 'hour'), 'minute')
    );
  };

  return (
    <tbody onMouseUp={handleMouseUp}>
      {hoursInDay.map((time, timeIndex) => (
        <tr key={timeIndex}>
          {roomNames.map((roomName, roomIndex) => (
            <td
              key={timeIndex - roomIndex}
              className={`
                        relative w-36 h-11 transition-all duration-300 ease-in-out
                        ${
                          regularUser && (!isAcademicHour(time) || isWeekend)
                            ? roomIndex % 2 === 0
                              ? 'bg-red-100  border-red-100'
                              : 'bg-red-80 border-red-80'
                            : ''
                        }
                        ${
                          authenticated &&
                          setIsCellSelected(roomName, time, currentDateObj)
                            ? 'bg-blue-300 border-none z-20'
                            : roomIndex % 2 === 0
                            ? 'bg-gray-100 border-b border-gray-200'
                            : 'bg-gray-50 border-b border-gray-200'
                        }
                        ${
                          isStartOfSelection(roomName, time)
                            ? 'rounded-t-lg'
                            : ''
                        }
                        ${
                          isEndOfSelection(roomName, time) ? 'rounded-b-lg' : ''
                        }
                `}
              data-row-index={roomIndex}
              data-col-index={timeIndex}
              onMouseDown={() => handleMouseDown(roomName, time)}
              onMouseMove={() => handleMouseMove(roomName, time)}>
              <RenderBookings
                date={currentDateObj.format('YYYY-MM-DD')}
                bookings={bookings.filter((booking) => {
                  const bookingStart = dayjs(
                    `${booking.date} ${booking.startTime}`
                  );
                  return (
                    booking.room.roomName === roomName &&
                    bookingStart.isSame(time, 'hour') &&
                    dayjs(booking.date).isSame(currentDateObj, 'day')
                  );
                })}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default DragAndAddBooking;
