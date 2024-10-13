import dayjs from 'dayjs';
import React, { useContext } from 'react';
import Day from './Day';
import GlobalContext from '../../../context/GlobalContext';
import BookingForm from '../BookingForm';

interface MothProps {
  month: dayjs.Dayjs[][];
}

const Month = ({ month }: MothProps) => {
  const { showBookingForm } = useContext(GlobalContext);
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
      <div>{showBookingForm && <BookingForm />}</div>
    </div>
  );
};

export default Month;
