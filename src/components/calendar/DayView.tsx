import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { getAllRooms } from "../../services/RoomService";
import GlobalContext from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, isRegularUser, isSuperAdmin } from "../../services/AuthService";
import DayBookings from "../DayBookings";

interface DayViewProps {
  day: dayjs.Dayjs[];
}

type Room = {
  roomId: number;
  capacity: number;
  roomName: string;
  description: string;
};

const DayView = ({ day }: DayViewProps) => {
  const authenticated = isAuthenticated();
  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const navigator = useNavigate();
  const { dayIndex, setDaySelected } = useContext(GlobalContext);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const [selecting, setSelecting] = useState<boolean>(false);
  const { bookingSelection, setBookingSelection } = useContext(GlobalContext);  

  const currentDateObj = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex));
  const currentDate = currentDateObj.format("YYYY-MM-DD");
  const startTimeDay = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex, 8, 0));
  const endTimeDay = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex, 17, 0));
  const isWeekend = currentDateObj.day() === 0 || currentDateObj.day() === 6;
  const isAcademicHour = (hour: dayjs.Dayjs) => hour.isBetween(startTimeDay, endTimeDay, null, "[)");

  // Fetch room details
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getAllRooms();
      const roomNameList = response.data.roomList.map((room: Room) => room.roomName);
      setRoomNames(roomNameList);
    };
    fetchRooms();
  }, []);

  // Triggers the start of the selection process. Sets the initial time for booking
  const handleMouseDown = (roomName: string, time: dayjs.Dayjs) => {
    setSelecting(true);
    if (!isWeekend && isAcademicHour(time) && regularUser) {
      setBookingSelection({ roomName, startTime: time, endTime: time });
    } else if (admin || superAdmin) {
      setBookingSelection({ roomName, startTime: time, endTime: time.add(1, 'hour') });
    }
    setDaySelected(currentDateObj);
  };

  // When dragging the mouse, function updates the booking's end time
  const handleMouseMove = (roomName: string, time: dayjs.Dayjs) => {
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
    if (!(bookingSelection.endTime && !isWeekend && isAcademicHour(bookingSelection.endTime)) && regularUser) {
      setBookingSelection({ ...bookingSelection, endTime: endTimeDay });
    }
    if (bookingSelection.startTime !== bookingSelection.endTime && authenticated) {
      navigator("/booking/add-booking");
    }
  };
  // console.log('end time: ', (bookingSelection.endTime)?.format('h'), 'start time', (bookingSelection.startTime)?.format('h'));

  const setIsCellSelected = (roomName: string, time: dayjs.Dayjs) => {
    const { roomName: selectedRoom, startTime, endTime } = bookingSelection;
    // console.log(startTime?.format("HH:mm"), endTime?.format("HH:mm")); 
    return selectedRoom === roomName && startTime && endTime && time.isBetween(startTime, endTime, null, "[)");
  };

  const isStartOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return bookingSelection.roomName === roomName && bookingSelection.startTime?.isSame(time, "minute");
  };

  const isEndOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return bookingSelection.roomName === roomName && bookingSelection.endTime?.isSame(time.add(1, "hour"), "minute");
  };

  return (
    <div className="h-full w-full flex">
      {/* Fixed Time column */}
      <div className="w-28">
        <table className="border-r border-gray-200">
          <thead>
            <tr>
              <th className="border-b border-t text-sm text-gray-700 items-center justify-center border-gray-200 p-1 w-32">{currentDateObj.format("dddd")}</th>
            </tr>
          </thead>
          <tbody>
            {day.map((time, i) => (
              <tr key={i}>
                <td className="select-none h-11 border border-gray-200 ">
                  <div className="text-xs justify-center p-2 ml-1">
                    {/* <span className="text-gray-600 text-xs ml-14 mr-2.5">
                      {time.format("hh A")}
                    </span>
                    <hr className="flex-1 border-gray-200" /> */}
                    {time.format("hh A")} - {time.add(1, "hour").format("hh A")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scrollable Room Columns */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-max bg-gray-50">
          <thead>
            <tr>
              {roomNames.map((roomName, idx) => (
                <th key={idx} className="border-t border-b border-r border-l select-none p-1 w-28">
                  <div className="text-gray-600 text-sm">
                    {roomName}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody onMouseUp={handleMouseUp}>
            {day.map((time, i) => (
              <tr key={i}>
                {roomNames.map((roomName, idx) => (
                  <td
                    key={`${i}-${idx}`}
                    className={`relative w-36 h-11
                      ${regularUser && isWeekend ? "absolute border-red-100 bg-red-100" : ""}
                      ${regularUser && !isAcademicHour(time) ? "absolute border-red-100 bg-red-100" : ""}
                      ${authenticated && setIsCellSelected(roomName, time) ? "bg-blue-300 transition-all duration-300 ease-in-out border-none z-20" : "border-b border-r border-l border-gray-200"}
                      ${isStartOfSelection(roomName, time) ? "rounded-t-lg" : ""}
                      ${isEndOfSelection(roomName, time) ? "rounded-b-lg" : ""}`}
                    data-row-index={idx}
                    data-col-index={i}
                    onMouseDown={() => handleMouseDown(roomName, time)}
                    onMouseMove={() => handleMouseMove(roomName, time)}
                  >
                    <DayBookings hour={time} date={currentDate} roomName={roomName} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayView;
