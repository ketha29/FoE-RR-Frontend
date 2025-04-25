import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { getAllRooms } from '../../services/RoomService';
import GlobalContext from '../../context/GlobalContext';
import RenderBookings from './RenderBookings';
import { getDay } from '../../util';
import { Booking, Room } from '../Interfaces';
import { useAuth } from '../../context/AuthContext';

interface DragAndAddBookingpRrops {
  bookings: Booking[];
  currentDay: dayjs.Dayjs;
}

const DragAndAddBooking = ({
  bookings,
  currentDay,
}: DragAndAddBookingpRrops) => {

  const authContext = useAuth();
    
      if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
    
      const { isAuthenticated, user } = authContext;
      
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const {
    bookingSelection,
    setBookingSelection,
    daySelected,
    setDaySelected,
    setShowBookingForm,
    selectingBooking,
    setSelectingBooking,
  } = useContext(GlobalContext);
  // const [selecting, setSelecting] = useState(false);
  const hoursInDay = getDay(currentDay);
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

  const isFuture = startTimeDay.isAfter(dayjs(new Date()).startOf('day'))
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
    // Only getting the hours for the time
    return bookings.some((booking) => {
      const bookingStart = dayjs(
        `${booking.date} ${booking.startTime.split(':')[0]}:00:00`
      );
      const bookingEnd = dayjs(
        `${booking.date} ${booking.endTime.split(':')[0]}:00:00`
      ).endOf('hour');
      return (
        booking.room.roomName === roomName &&
        time.isBetween(bookingStart, bookingEnd, null, '[)')
      );
    });
  };

  // Triggers the start of the selection process. Sets the initial time for booking
  const handleMouseDown = (roomName: string, time: dayjs.Dayjs) => {
    if (isTimeBooked(roomName, time)) {
      return;
    }
    setSelectingBooking(true);
    if (!isWeekend && isAcademicHour(time) && (user?.userType == "regularUser")) {
      setBookingSelection({
        roomName,
        startTime: time,
        endTime: time.add(1, 'hour'),
        details: null,
      });
    } else if ((user?.userType == "superAdmin") || (user?.userType == "admin")) {
      setBookingSelection({
        roomName,
        startTime: time,
        endTime: time.add(1, 'hour'),
        details: null,
      });
    }
    setDaySelected(currentDateObj);
  };

  // When dragging the mouse, function updates the booking's end time
  const handleMouseMove = (roomName: string, time: dayjs.Dayjs) => {
    // End the dragging if selecting through already booked slots
    if (isTimeBooked(roomName, time)) {
      setTimeout(() => {
        setSelectingBooking(false);
        setBookingSelection({
          ...bookingSelection,
          endTime: null,
        });
      }, 100);
      return;
    }
    if (
      !(
        bookingSelection.endTime &&
        bookingSelection.startTime &&
        !isWeekend &&
        isAcademicHour(bookingSelection.endTime.subtract(1, 'hour')) &&
        isAcademicHour(bookingSelection.startTime)
      ) &&
      (user?.userType == "regularUser")
    ) {
      setBookingSelection({
        ...bookingSelection,
        startTime: bookingSelection.startTime,
        endTime: bookingSelection.endTime,
      });
      return;
    }
    if (roomName === bookingSelection.roomName) {
      console.log('end time', bookingSelection.endTime?.format('HH:mm'));
      if (time.isAfter(bookingSelection.startTime)) {
        setBookingSelection({
          ...bookingSelection,
          endTime: time.add(1, 'hour'),
        });
      } else {
        setBookingSelection({ ...bookingSelection, startTime: time });
      }
    }
    // End booking if selecting through different rooms
    else {
      setSelectingBooking(false);
      setBookingSelection({
        ...bookingSelection,
        roomName: null,
      });
      // setTimeout(() => {
      //   setSelectingBooking(false);
      //   setBookingSelection({
      //     ...bookingSelection,
      //     roomName: null,
      //   });
      // }, 100);
      return;
    }
  };

  // End the booking selection
  // If the start time and end time are valid, user is redricted to the booking page
  const handleMouseUp = () => {
    setSelectingBooking(false);

    // If the selected time is beyond allowed time. Set the allowed time as selected time
    bookingSelection.endTime = ((user?.userType == "regularUser") && bookingSelection.endTime?.isAfter(endTimeDay))?endTimeDay:bookingSelection.endTime;
    bookingSelection.startTime = ((user?.userType == "regularUser") && bookingSelection.startTime?.isBefore(startTimeDay))?startTimeDay:bookingSelection.startTime;

    if (
      !(
        bookingSelection.endTime &&
        bookingSelection.startTime &&
        !isWeekend
        // isAcademicHour(bookingSelection.endTime) &&
        // isAcademicHour(bookingSelection.startTime)
      ) &&
      (user?.userType == "regularUser")
    ) {
      setBookingSelection({
        ...bookingSelection,
        startTime: startTimeDay,
        endTime: endTimeDay,
      });
    }
    if (
      !(
        bookingSelection.startTime === bookingSelection.endTime ||
        bookingSelection.startTime === null ||
        bookingSelection.endTime === null ||
        bookingSelection.roomName === null
      ) &&
      isAuthenticated && isFuture
    ) {
      setShowBookingForm(true);
    }
  };

  const isCellSelected = (
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
      selectingBooking &&
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
                          (user?.userType == "regularUser") && (!isAcademicHour(time) || isWeekend)
                            ? roomIndex % 2 === 0
                              ? 'bg-red-100  border-red-100'
                              : 'bg-red-80 border-red-80'
                            : ''
                        }
                        ${
                          isAuthenticated &&
                          isCellSelected(roomName, time, currentDateObj)
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
                  // console.log(time)
                  return (
                    booking.room.roomName === roomName &&
                    bookingStart.isSame(time, 'hour')
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
