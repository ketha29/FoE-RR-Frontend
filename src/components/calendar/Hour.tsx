import dayjs from "dayjs"

interface HourProps {
    hour: dayjs.Dayjs;
}

const Hour = ({hour}: HourProps) => {
  return (
    <div className="flex felx-col">
        <header className='flex flex-col items-center'>
            <p>{hour.format("HH:mm")}</p>
        </header>
    </div>
  )
}

export default Hour