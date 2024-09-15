import { useContext, useState } from 'react'
import GlobalContext from '../../context/GlobalContext'
import dayjs from 'dayjs';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AddBookingButton from '../AddBookingButton';
import { isAdmin, isAuthenticated, isSuperAdmin } from '../../services/AuthService';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// interface CalendarHeaderDayProps {
//   view: String;
//   setView: React.Dispatch<React.SetStateAction<string>>;
// }

const CalendarHeaderDay = () => {
  // const [view, setView] = useState('Day');
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const { dayIndex, setDayIndex, view, setView } = useContext(GlobalContext);
  const handlePrevDay = () => (admin || superAdmin) && setDayIndex(dayIndex - 1);
  const handleNextDay = () => setDayIndex(dayIndex + 1);
  const handleToday = () => setDayIndex(dayjs().date());

  return (
    <header className='flex px-5 py-3 items-center justify-between'>
      <h2 className='m1-4 text-xl text-grey-500 font-bold'>
        {view === 'Day' && dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)).format("DD MMMM YYYY")}
        {view === 'Month' && dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)).format("MMMM YYYY")}
      </h2>
      <div className="flex items-center">
        {/* Drop down for calendar view */}
        <Menu as="div" className="relative ml-3">
          <div>
          <MenuButton className="flex items-center justify-between mr-6 px-3 py-0.5 text-lg font-semibold rounded-md bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:outline-none">
              <span className='mr-1'>{view} View</span>
              <ArrowDropDownOutlinedIcon className="w-5 h-5 text-gray-500" />
            </MenuButton>
          </div>
          <MenuItems 
            transition
            className="absolute right-6 z-0 mt-1 w-28 origin-top-right rounded-md bg-gray-100 py-0 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            {view !== 'Day' && <MenuItem>
              <a
                className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                onClick={() => setView('Day')}
              >
                Day View
              </a>
            </MenuItem>}
            {view !== 'Week' && <MenuItem>
              <a
                className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                onClick={() => setView('Week')}
              >
                Week View
              </a>
            </MenuItem>}
            {view !== 'Month' && <MenuItem>
              <a
                className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                onClick={() => setView('Month')}
              >
                Month View
              </a>
            </MenuItem>}
          </MenuItems>
        </Menu>
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
        <AddBookingButton />
      </div>
    </header>
  )
}

export default CalendarHeaderDay
