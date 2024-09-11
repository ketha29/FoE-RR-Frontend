import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { getAllBookings } from "../../services/BookingService";

dayjs.extend(isBetween);

interface HourProps {
    hour: dayjs.Dayjs;
    roomName: string;
    date: string;
}

interface Booking {
  startTime: string;
  endTime: string;
  date: string;
  details: string;
  recurrence: string;
  recurrencePeriod: number;
  room: {
    roomName: string;
  };
}

const Hour = ({ hour, roomName, date }: HourProps) => {
  const [hourBooking, setHourBooking] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllBookings();
      const bookings = response.data.bookingList;
      const currentHourBookings = bookings.filter((booking: Booking) => {
        const bookingDate = dayjs(booking.date).format('YYYY-MM-DD');
        const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
        // const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);
        return (
          bookingDate === date &&
          booking.room.roomName === roomName &&
          bookingStart.isSame(hour, 'hour')
          // hour.isBetween(bookingStart, bookingEnd, null, '[)')
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
        // console.log(bookingStart.format('YYYY-MM-DD-HH:mm'), ' ',  bookingEnd.format('YYYY-MM-DD-HH:mm'));
        
        const startOffsetMinutes = bookingStart.diff(dayjs(`${date} 00:00`), 'minute');
        const spanMinutes = bookingEnd.diff(bookingStart, 'minute');

        const leftPercentage = ((startOffsetMinutes / 60) - bookingStart.hour()) * 100;
        const widthPercentage = (spanMinutes / 60) * 101;
        // console.log('Left Percentage:', leftPercentage);
        // console.log('Width Percentage:', widthPercentage);
        
        return (
          startOffsetMinutes >= 0 && (
            <div
              className="absolute bg-blue-300 text-gray-600 text-xs rounded-md h-full flex justify-start items-center hover:bg-blue-400 transition-transform ease-in-out group"
              key={idx}
              style={{
                top: 0,
                left: `${leftPercentage}%`,
                width: `${widthPercentage}%`,
                height: "85%",
              }}
            >
              <div className="absolute">
                {booking.details} <br />
                {dayjs(bookingStart).format('h:mma')} - {dayjs(bookingEnd).format('h:mma')}
              </div>
              {/* <div className="absolute bottom-full mb-1 bg-blue-500 transform text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                {dayjs(bookingStart).format('h:mm a')} - {dayjs(bookingEnd).format('h:mm a')} <br />
                Recurrence: {booking.recurrence} <br />
                Period: {booking.recurrencePeriod}
              </div> */}
            </div>
          )
        );
      })}
    </div>
  );

  // return (
  //   <div className="h-full w-full">
  //     {hourBooking.map((booking, idx) => (
  //       <div
  //         className="bg-sky-200 text-gray-500 text-sm rounded h-full w-full flex items-center justify-center hover:bg-sky-300 hover:scale-105 transition-transform ease-in-out"
  //         key={idx}
  //       >
  //         <div className="truncate w-20">
  //           {booking.details}
  //         </div>
  //         <div className='absolute bottom-full mb-1 bg-sky-400 transform text-white px-2 py-1 rounded'>
  //           {booking.details}
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
}

export default Hour;
