import { useContext, useState } from 'react'
import GlobalContext from '../context/GlobalContext'
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BookingForm from './BookingForm';
import { getDay } from '../util';

interface CalendarHeaderDayProps {
  view: String;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

function CalendarHeaderDay({view, setView}: CalendarHeaderDayProps) {
  const {dayIndex, setDayIndex} = useContext(GlobalContext);
  const handlePrevDay = () => setDayIndex(dayIndex - 1);
  const handleNextDay = () => setDayIndex(dayIndex + 1);
  const handleToday = () => setDayIndex(dayjs().date());
  const handleBooking = () => {console.log("clicked")};

  const [currentDay, setCurretDay] = useState(getDay());

  return (
    <header className='flex px-5 py-3 items-center justify-between'>
      <h2 className='m1-4 text-xl text-grey-500 font-bold'>
        {dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)).format("DD MMMM YYYY")}
      </h2>
      <div className="flex items-center">
        <button 
          className='px-3 py-1 text-lg font-semibold rounded-md bg-white border border-grey-300 text-gray-900 hover:bg-gray-50 focus:relative md:block'
          onClick={() => setView("day")}
        >
          Day view
        </button>
        <button 
          className='mr-6 px-3 py-1 text-lg font-semibold rounded-md bg-white border border-grey-300 text-gray-900 hover:bg-gray-50 focus:relative md:block'
          onClick={() => setView("month")}
        >
          Month view
        </button>
        <div className='relative flex items-center rounded-md bg-white shadow-sm md:items-stretch'>
          <button className="right-arrow" onClick={handlePrevDay}>
            <ChevronLeftIcon />
          </button>
          <button onClick={handleToday} className="hidden border-y border-gray-300 px-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
            Today
          </button>
          <button className='left-arrow' onClick={handleNextDay}>
            <ChevronRightIcon />
          </button>
        </div>
        <div className="ml-6 h-6 w-px bg-gray-300"></div>
        <button 
          className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleBooking}
        >
          Add Booking
        </button>
      </div>
    </header>
  )
}

export default CalendarHeaderDay
