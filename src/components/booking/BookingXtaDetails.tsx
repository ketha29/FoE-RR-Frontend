import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import {
  isRegularUser,
  isAdmin,
  isSuperAdmin,
} from '../../services/AuthService';
import GlobalContext from '../../context/GlobalContext';

interface BookingXtaDetailsProps {
  booking: any;
  closeBookingDetails: () => void;
  editBookingDetails: () => void;
  deleteBookingDetails: () => void;
}

const BookingXtaDetails = ({
  booking,
  closeBookingDetails,
  editBookingDetails,
  deleteBookingDetails,
}: BookingXtaDetailsProps) => {
  const { setShowDeleteConfirmation } =
    useContext(GlobalContext);

  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const bookingStart = dayjs(`${booking.date} ${booking.startTime}`);
  const bookingEnd = dayjs(`${booking.date} ${booking.endTime}`);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the click event from reaching the parent component
    event.stopPropagation();
  };
  // const [showDeleteConfirmation, setShowDeleteConformation] = useState(false);
  // Show the conformation dialog box
  const showConformation = () => {
    deleteBookingDetails();
    setShowDeleteConfirmation(true);
  };

  // Edit and delete booking access
  const accessible =
    (dayjs(new Date(booking.date)).isAfter(dayjs(new Date()))) && (superAdmin ||
      (admin &&
        (booking.user.userType === 'regularUser' ||
          (booking.user.userType === 'admin' &&
            booking.user.userId === Number(localStorage.getItem('userId'))))) ||
      (regularUser &&
        booking.user.userId === Number(localStorage.getItem('userId'))));

  return (
    <>
      <div
        onClick={handleClick}
        className="absolute bottom-full mb-1 bg-blue-50 shadow-lg shadow-gray-300 p-2 rounded-lg z-30"
        style={{
          minWidth: '200px',
          maxWidth: '200px',
          minHeight: '100px',
        }}>
        {/* Close, delete and edit icons */}
        <div className="flex justify-end items-center space-x-1 mb-1">
          {accessible && (
            <button
              onClick={editBookingDetails}
              className="text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-gray-700 rounded-full">
              <EditOutlinedIcon fontSize="small" />
            </button>
          )}
          {accessible && (
            <button
              onClick={showConformation}
              className="font-bold text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-red-400 rounded-full">
              <DeleteOutlinedIcon className="font-bold" fontSize="small" />
            </button>
          )}
          <button
            onClick={closeBookingDetails}
            className="text-gray-600 hover:bg-gray-200 p-0.5 w-8 h-8 hover:text-gray-700 rounded-full">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Booking details */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            {booking.details}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {dayjs(bookingStart).format('h:mm a')} -{' '}
            {dayjs(bookingEnd).format('h:mm a')} <br />
            {dayjs(booking.startDate).format('DD MMM')} -{' '}
            {dayjs(booking.endDate).format('DD MMM')} ({booking.recurrence}){' '}
            <br />
            Booked by: {booking.user.firstName}{' '}
            {booking.user.lastName.charAt(0)}
          </p>
        </div>

        {/* <div className="">
          {showDeleteConfirmation && (
            <DeleteConformation
              deleteItem={`Booking`}
              onDeleteAll={proceedDeleteAll}
              onDeleteOne={proceedDeleteOne}
              onCancel={cancelDelete}
              isBookingReccurrenceType={reccurrenceTypeBooking}
            />
          )}
        </div> */}
      </div>
    </>
  );
};

export default BookingXtaDetails;
