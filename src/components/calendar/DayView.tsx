import dayjs from "dayjs";
import Hour from "./Hour";
import { useContext, useEffect, useState } from "react";
import { getAllRooms } from "../../services/RoomService";
import GlobalContext from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";

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
  const navigator = useNavigate();
  const { dayIndex, setDaySelected, setShowBookingForm } = useContext(GlobalContext);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  // Indicates whether user is currently selecting a time range
  const [selecting, setSelecting] = useState<boolean>(false);
  // Tracks the booking details (room name, start time and end time)
  const { bookingSelection ,setBookingSelection } = useContext(GlobalContext);

  const currentDate = dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)).format('YYYY-MM-DD')  
  
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
    setBookingSelection({ roomName, startTime: time, endTime: time });
    setDaySelected(dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)));
  };

  // Update the end time (when the user drags the mouse across the table and if still clicking the mouse)
  const handleMouseMove = (roomName: string, time: dayjs.Dayjs) => {
    if(selecting && roomName === bookingSelection.roomName) {
      setBookingSelection({ ...bookingSelection, endTime: time });
      console.log('Selected range: ', bookingSelection);
    }
  };

  // Ending the selection process
  const handleMouseUp = () => {
    setSelecting(false);
    navigator("/add-booking");
    setShowBookingForm(true);
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
    <table className="h-full w-full overflow-y-scroll">
      <thead>
        <tr>
          <th className="border-b border-gray-200 p-1"></th> 
          {day.map((day, idx) => (
            <th key={idx} className="border-b border-gray-200 p-1 space-x-4">
              {day.format("HH:mm")}              
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
                {roomName}
              </td>
              {day.map((time, idx) => (
                <td 
                  key={`${i}-${idx}`} 
                  className={
                    `relative border-t border-b border-r border-l border-gray-200 w-24
                    ${setIsCellSelected(roomName, time) ? 'bg-blue-300 transition-all duration-300 ease-in-out' : ' '}
                    ${isStartOfSelection(roomName, time) ? 'rounded-l-lg' : ''}
                    ${isEndOfSelection(roomName, time) ? 'rounded-r-lg' : ''}`
                  }
                  data-row-index={i}
                  data-col-index={idx}
                  onMouseDown={() => handleMouseDown(roomName, time)}
                >
                  <Hour hour={time} date={currentDate} roomName={roomName} key={idx} />
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DayView;
