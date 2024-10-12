import dayjs from 'dayjs';

interface TimeTableProps {
  day: dayjs.Dayjs[];
  currentDay: dayjs.Dayjs;
}

const TimeTable = ({ day, currentDay }: TimeTableProps) => {
  const today = dayjs();
  return (
    // Fixed Time column
    <div className="w-32 sticky left-0 bg-white z-30">
      <table className="border-r border-gray-200">
        <thead>
          <tr>
            <th className="border-b border-t text-sm text-gray-700 items-center justify-center border-gray-200 p-1 w-32 h-12">
              <span
                className={`px-2 py-1 rounded-full ${
                  currentDay.isSame(today, 'day')
                    ? 'bg-blue-600 text-white'
                    : ''
                }`}>
                {currentDay.format('DD')}{' '}
                {currentDay.format('ddd').toUpperCase()}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {day.map((time, i) => (
            <tr key={i}>
              <td className="select-none h-11 border border-gray-200 ">
                <div className="text-xs justify-center p-2 ml-1">
                  {time.format('hh A')} - {time.add(1, 'hour').format('hh A')}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
