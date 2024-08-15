import { useContext } from 'react'
import GlobalContext from '../context/GlobalContext'
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddBookingButton from './AddBookingButton';

interface CalendarHeaderProps {
  view: String;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

function CalendarHeader({ setView }: CalendarHeaderProps) {
  const {monthIndex, setMonthIndex} = useContext(GlobalContext);
  const handlePrevMonth = () => setMonthIndex(monthIndex - 1);
  const handleNextMonth = () => setMonthIndex(monthIndex + 1);
  const handleToday = () => setMonthIndex(dayjs().month());

  return (
    <header className='flex px-5 py-3 items-center justify-between'>
      <h2 className='m1-4 text-xl text-grey-500 font-bold'>
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
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
          <button className="right-arrow" onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </button>
          <button onClick={handleToday} className="hidden border-y border-gray-300 px-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
            Today
          </button>
          <button className='left-arrow' onClick={handleNextMonth}>
            <ChevronRightIcon />
          </button>
        </div>
        <div className="ml-6 h-6 w-px bg-gray-300"></div>
        <AddBookingButton />
      </div>
    </header>
  )
}

export default CalendarHeader
