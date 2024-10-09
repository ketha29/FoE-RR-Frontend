import { useContext, useState } from 'react';
import GlobalContext from '../../context/GlobalContext';
import dayjs from 'dayjs';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AddBookingButton from '../AddBookingButton';
import {
  isAdmin,
  isAuthenticated,
  isRegularUser,
  isSuperAdmin,
} from '../../services/AuthService';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CalendarHeaderDay = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const {
    dayIndex,
    setDayIndex,
    weekIndex,
    setWeekIndex,
    monthIndex,
    setMonthIndex,
    view,
    setView,
  } = useContext(GlobalContext);
  // Throttle state is to prevent rapid clicks
  const [isThrottled, setIsThrottled] = useState(false);
  const todayIndex = dayjs().date();
  const [animationDirection, setAnimationDirection] = useState<
    'next' | 'prev' | null
  >(null);

  const weekStart = dayjs()
    .week(weekIndex)
    .startOf('week')
    .format('DD MMM YYYY');
  const weekEnd = dayjs().week(weekIndex).endOf('week').format('DD MMM YYYY');

  const handlePrevDay = () => {
    if (!isThrottled) {
      setAnimationDirection('prev');
      view == 'Day' && setDayIndex(dayIndex - 1);
      view == 'Week' && setWeekIndex(weekIndex - 1);
      setIsThrottled(true);
      setTimeout(() => {
        setIsThrottled(false);
        setAnimationDirection(null);
      }, 300);
    }
    console.log(dayIndex, weekIndex);
  };

  const handleNextDay = () => {
    if (!isThrottled) {
      setAnimationDirection('next');
      // if (view == 'Day') {
      //   dayIndex > 30 ? setDayIndex(0) : setDayIndex(dayIndex + 1) , setMonthIndex(monthIndex + 1);
      // }
      view == 'Day' && setDayIndex(dayIndex + 1);
      view == 'Week' && setWeekIndex(weekIndex + 1);
      view == 'Month' && setMonthIndex(monthIndex + 1);
      // view == 'Week' && setDayIndex(dayIndex + 7);
      setIsThrottled(true);
      setTimeout(() => {
        setIsThrottled(false);
        setAnimationDirection(null);
      }, 300);
    }
    console.log(dayIndex, weekIndex);
  };

  const handleToday = () => {
    setDayIndex(dayjs().date());
    setWeekIndex(dayjs().week());
    setMonthIndex(dayjs().month());
    console.log(weekIndex);
  };

  const transitionClass =
    animationDirection === 'next'
      ? 'transform translate-x-full opacity-0 transition-transform duration-300'
      : animationDirection === 'prev'
      ? 'transform -translate-x-full opacity-0 transition-transform duration-300'
      : 'opacity-100 transition-opacity duration-300';

  return (
    <>
      <header className="flex px-5 py-3 items-center justify-between bg-white border-b border-gray-400 fixed top-14 left-0 right-0 z-50">
        <div className="flex items-center space-x-10">
          <h2
            className={`m1-4 text-xl text-grey-500 w-60 font-bold ${transitionClass}`}>
            {view === 'Day' &&
              dayjs(new Date(dayjs().year(), dayjs().month(), dayIndex)).format(
                'DD MMMM YYYY'
              )}
            {view === 'Week' && `${weekStart} - ${weekEnd}`}
            {view === 'Month' && dayjs().month(monthIndex).format('MMMM YYYY')}
          </h2>
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              className={`right-arrow ${
                regularUser &&
                (dayIndex <= todayIndex ? 'opacity-50 cursor-not-allowed' : '')
              }`}
              onClick={handlePrevDay}
              disabled={dayIndex <= todayIndex && regularUser}>
              <ChevronLeftIcon />
            </button>
            <button
              onClick={handleToday}
              className="hidden border-y border-gray-300 px-2 text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">
              Today
            </button>
            <button className="left-arrow" onClick={handleNextDay}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          {/* Drop down for calendar view */}
          <Menu as="div" className="relative ml-3">
            {({ close }) => (
              <>
                <div>
                  <MenuButton className="flex items-center justify-between mr-6 px-3 py-0.5 text-lg font-semibold rounded-md bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:outline-none">
                    <span className="mr-1">{view} View</span>
                    <ArrowDropDownOutlinedIcon className="w-5 h-5 text-gray-500" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-6 z-20 mt-1 w-28 origin-top-right rounded-md bg-gray-100 py-0 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                  {view !== 'Day' && (
                    <MenuItem>
                      <a
                        className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                        onClick={() => {
                          setView('Day');
                          close();
                        }}>
                        Day View
                      </a>
                    </MenuItem>
                  )}
                  {view !== 'Week' && (
                    <MenuItem>
                      <a
                        className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                        onClick={() => {
                          setView('Week');
                          close();
                        }}>
                        Week View
                      </a>
                    </MenuItem>
                  )}
                  {view !== 'Month' && (
                    <MenuItem>
                      <a
                        className="block py-0 text-base font-medium text-gray-900 data-[focus]:bg-gray-100"
                        onClick={() => {
                          setView('Month');
                          close();
                        }}>
                        Month View
                      </a>
                    </MenuItem>
                  )}
                </MenuItems>
              </>
            )}
          </Menu>

          {authenticated && <div className="ml-0 h-6 w-px bg-gray-300"></div>}
          {authenticated && <AddBookingButton />}
        </div>
      </header>
    </>
  );
};

export default CalendarHeaderDay;
