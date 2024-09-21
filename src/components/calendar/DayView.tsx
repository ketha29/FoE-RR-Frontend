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
}

const DayView = ({ day }: DayViewProps) => {
  const authenticated = isAuthenticated();
  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const navigator = useNavigate();
  const { dayIndex, setDaySelected, setShowBookingForm } = useContext(GlobalContext);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  // Indicates whether user is currently selecting a time range
  const [selecting, setSelecting] = useState<boolean>(false);
  // Tracks the booking details (room name, start time and end time)
  const { bookingSelection ,setBookingSelection } = useContext(GlobalContext);

  const currentDateObj = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex));
  const currentDate = currentDateObj.format('YYYY-MM-DD');
  const startTimeDay = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex, 8, 0));
  const endTimeDay = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex, 17, 0));
  const isWeekend = currentDateObj.day() === 0 || currentDateObj.day() === 6;
  const isAcademicHour = (hour: dayjs.Dayjs) => hour.isBetween(startTimeDay, endTimeDay, null, '[)');  
  
  // Fetch the room details and render the list of room names
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getAllRooms();
      const roomNameList = response.data.roomList.map((room: Room) => room.roomName);
      setRoomNames(roomNameList);
    }
    fetchRooms();
  }, []);
  
  // Starts the selection when user clicks on a cell
  // Set the intiial room name and time
  const handleMouseDown = (roomName: string, time: dayjs.Dayjs) => {
    setSelecting(true);
    !isWeekend && isAcademicHour(time) && regularUser && setBookingSelection({ roomName, startTime: time, endTime: time });
    (admin || superAdmin) && setBookingSelection({ roomName, startTime: time, endTime: time });
    setDaySelected(currentDateObj);
  };
  
  // Update the end time (when the user drags the mouse across the table and if still clicking the mouse)
  const handleMouseMove = (roomName: string, time: dayjs.Dayjs) => {
    if (selecting && roomName === bookingSelection.roomName) {
      if (time.isAfter(bookingSelection.startTime)) {
        setBookingSelection({ ...bookingSelection, endTime: time });
      } else {
        setBookingSelection({ ...bookingSelection, startTime: time });
      }
    }
  };
  
  // Ending the selection process
  const handleMouseUp = () => {
    setSelecting(false);
    // bookingSelection.startTime !== bookingSelection.endTime && authenticated && navigator("/booking/add-booking");
    if(!(bookingSelection.endTime && !isWeekend && isAcademicHour(bookingSelection.endTime)) && regularUser) {
      setBookingSelection({ ...bookingSelection, endTime: endTimeDay })
    }
    bookingSelection.startTime !== bookingSelection.endTime && (authenticated) && navigator("/booking/add-booking");
  };  

  const setIsCellSelected = (roomName: string, time: dayjs.Dayjs) => {
    const { roomName: selectedRoom, startTime, endTime } = bookingSelection;
    return (
      selectedRoom === roomName &&
      startTime !== null &&
      endTime !== null &&
      time.isBetween(startTime, endTime, null, '[)')
    );
  };

  const isStartOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return bookingSelection.roomName === roomName && bookingSelection.startTime?.isSame(time, 'minute');
  };
  
  const isEndOfSelection = (roomName: string, time: dayjs.Dayjs) => {
    return bookingSelection.roomName === roomName && bookingSelection.endTime?.isSame(time, 'minute');
  };
  
  return (
    <table className="h-full w-full overflow-y-scroll overflow-x-scroll bg-gray-50">
      <thead>
        <tr>
          <th className="border-b text-lg text-gray-700 border-gray-200 p-1">{ currentDateObj.format('dddd') }</th>
          {day.map((day, idx) => (
            <th key={idx} className="p-0 text-xs border-l border-t text-gray-700">
              {day.format("h A")} - {day.add(1, 'hour').format("h A")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody
        onMouseUp={handleMouseUp}
        onMouseMove={(event) => {
          const target = event.target as HTMLTableCellElement;
          const rowIndex = parseInt(target.dataset.rowIndex || "-1");
          const colIndex = parseInt(target.dataset.colIndex || "-1");
          if (rowIndex !== -1 && colIndex !== -1) {
            const time = day[colIndex];
            const roomName = roomNames[rowIndex];
            if (time && roomName) {
              handleMouseMove(roomName, time);
            }
          }
        }}
      >
          {roomNames.map((roomName, i) => (
            <tr key={i}>
              <td 
                className="border-t border-b border-r border-l border-gray-200 px-1"
                style={{ minWidth: "140px", maxWidth: "140px" }}
              >
                <div className='ml-1 text-gray-700 text-base'><b>{roomName}</b></div>
              </td>
              {day.map((time, idx) => (
                <td 
                  key={`${i}-${idx}`} 
                  className={
                    `relative border-t border-b border-r border-l border-gray-200 w-24
                    ${regularUser && isWeekend ? 'absolute border-red-100 bg-red-100' : ''}
                    ${regularUser && !isAcademicHour(time) ? 'absolute border-red-100 bg-red-100' : ''}
                    ${authenticated && setIsCellSelected(roomName, time) ? 'bg-blue-300 transition-all duration-300 ease-in-out' : ''}
                    ${isStartOfSelection(roomName, time) ? 'rounded-l-lg' : ''}
                    ${isEndOfSelection(roomName, time) ? 'rounded-r-lg' : ''}`
                  }
                  data-row-index={i}
                  data-col-index={idx}
                  onMouseDown={() => handleMouseDown(roomName, time)}
                >
                  <DayBookings hour={time} date={currentDate} roomName={roomName} key={idx} />
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DayView;
