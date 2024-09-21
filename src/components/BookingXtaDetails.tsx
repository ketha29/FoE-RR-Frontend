import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface BookingXtaDetailsProps {
    booking: any;
    closeBookingDetails: () => void;
    editBookingDetails: () => void;
}

const BookingXtaDetails = ({ booking, closeBookingDetails, editBookingDetails }: BookingXtaDetailsProps) => {
    const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
    const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Prevent the click event from reaching the parent component
        event.stopPropagation();
    }
    return (
        <div
            onClick={handleClick}
            className="absolute bottom-full mb-1 bg-white shadow-2xl shadow-gray-600 text-gray-800 px-1 py-1 rounded-lg"
            style={{
                minWidth: "200px",
                maxWidth: "200px",
                minHeight: "100px",
            }}
        >

            {/* Close, delete and edit icons */}
            <div className='flex justify-end items-center space-x-1 mb-2'>
                <button
                    onClick={editBookingDetails}
                    className="text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-gray-700 rounded-full"
                >
                    <EditOutlinedIcon fontSize='small' />
                </button>
                <button 
                    className='font-bold text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-red-400 rounded-full'
                >
                    <DeleteOutlinedIcon className='font-bold' fontSize='small' />
                </button>
                <button
                    onClick={closeBookingDetails}
                    className="text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-gray-700 rounded-full"
                >
                    <CloseIcon fontSize='small' />
                </button>
            </div>

            {/* Booking details */}
            <div className='text-gray-700 text-sm'>
                {booking.details} <br />
                {dayjs(bookingStart).format('h:mm a')} - {dayjs(bookingEnd).format('h:mm a')} <br />
                {booking.user.firstName} {booking.user.lastName}
            </div>
        </div>
    );
}

export default BookingXtaDetails;
