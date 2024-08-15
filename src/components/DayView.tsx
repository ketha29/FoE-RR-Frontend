import dayjs from "dayjs";
import CalendarHeader from "./CalendarHeader";
import CalendarHeaderDay from "./CalendarHeaderDay";
import Day from "./Day";

interface DayViewProps {
  day: dayjs.Dayjs[];
}

const DayView = ({ day }: DayViewProps) => {
  return (
    <>
    <div className="overflow-y-scroll flex-1 max-h-full pb-56">
      <div>
      {day.map((day, idx) => (
          <div className="flex h-12" key={idx}>
            <div className="w-24 h-full flex items-start justify-center border-r border-gray-300 text-gray-600">
              <time dateTime={day.format("yyyy-MM-dd")}
                className="-mt-3 select-none pr-2"
              >
                {idx === 0? "": day.format("h:mm A")}
              </time>
              {/* <Hour hour={hour} key={i} /> */}
            </div>
            <div
                className={`flex-1 relative border-gray-300 ${idx !== 0 && `border-t`}`} />
          </div>
        ))}
        </div>
      </div>
      </>
  );
};

export default DayView;
