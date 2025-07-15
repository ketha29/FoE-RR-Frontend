import { useContext, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import GlobalContext from '../../context/GlobalContext';
import CloseIcon from '@mui/icons-material/Close';
import { addBooking } from '../../services/BookingService';
import { AxiosError } from 'axios';
import { getAllRooms } from '../../services/RoomService';
import { Room, User } from '../Interfaces';
import { Autocomplete, TextField } from '@mui/material';
import { getUserByName } from '../../services/UserService';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const recurrenceTypes = ['none', 'daily', 'weekly'];

const BookingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roomNames, setRoomNames] = useState<string[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);

  const {
    setShowBookingForm,
    daySelected,
    bookingSelection,
    setBookingSelection,
    setFetch,
  } = useContext(GlobalContext);

  const authContext = useAuth();
  
    if (!authContext) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    const { user } = authContext;

  const closeBookingForm = () => {
    setBookingSelection({
      roomName: null,
      startTime: null,
      endTime: null,
      details: null,
    });
    setShowBookingForm(false);
  };

  const [booking, setBooking] = useState({
    bookedForUser: null,
    roomName: '',
    details: '',
    startTime: '',
    endTime: '',
    date: daySelected.format('YYYY-MM-DD'),
    recurrence: 'none',
    recurrencePeriod: 0,
  });

  const handleRecurrenceType = (event: any) =>
    setBooking({ ...booking, recurrence: event.target.value });

  // Fetch room details
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getAllRooms();
      const roomNameList = response.data.roomList.map(
        (room: Room) => room.roomName
      );
      setRoomNames(roomNameList);
    };
    fetchRooms();
  }, []);

  const fetchUserSuggestions = async (name: string) => {
    const response = await getUserByName(name);
    console.log(response.data.userList);
    const userSuggestions: User[] = response.data.userList;
    setUserSuggestions(userSuggestions);
  };

  // Add the seconds to the time as the time is stored in hh:mm:ss format
  const formatTime = (time: string) => {
    if (!time) return null;
    return `${time}:00`;
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const formattedBooking = {
        ...data,
        startTime: formatTime(data.startTime),
        endTime: formatTime(data.endTime),
        recurrence: (user?.userType == "admin") || (user?.userType == "superAdmin") ? data.recurrence : 'none',
        recurrencePeriod: (user?.userType == "admin") || (user?.userType == "superAdmin") ? data.recurrencePeriod : 0,
      };
      console.log(formattedBooking);
      const response = await addBooking(data.roomName, formattedBooking);
      setErrorMessage(null);
      console.log('Booking added successfully: ', response.data);
      setBookingSelection({
        roomName: null,
        startTime: null,
        endTime: null,
        details: null,
      });
      setShowBookingForm(false);
      setFetch(true);
    } catch (error) {
      const errorMessage =
        (error as AxiosError).response?.data?.message ||
        'Error in adding booking';
      setErrorMessage(errorMessage);
      console.error(errorMessage);
    }
    notify();
  };

  const notify = () => {
    if (errorMessage) {
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-70 backdrop-blur-sm z-40">
        <div className="sm:w-1/2 w-full max-w-2xl overflow-y-auto p-7 shadow-xl rounded-lg bg-white transition-transform transform duration-300">
          {/* Header section of the booking form */}
          <header className="flex justify-between items-center border-b pb-3">
            <h1 className="text-xl font-semibold text-gray-800">Add Booking</h1>
            {/* Close booking form button */}
            <button
              onClick={closeBookingForm}
              className="text-gray-400 hover:bg-gray-200 rounded-full p-1 transition duration-200">
              <CloseIcon />
            </button>
          </header>

          <div className="mt-5">
            <div className="mt-4 flex gap-x-4">
              {/* Room name dropdown */}
              <div className="flex-1">
                <label htmlFor="roomName" className="text-lg font-medium">
                  Room
                </label>
                <div className="relative">
                  <select
                    {...register('roomName', { required: true })}
                    id="roomName"
                    defaultValue={bookingSelection.roomName || ''}
                    className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400">
                    <option>
                      {bookingSelection.roomName
                        ? bookingSelection.roomName
                        : 'Select a room'}
                    </option>
                    {roomNames.map((roomName) => (
                      <option key={roomName} value={roomName}>
                        {roomName}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.roomName?.type === 'required' && (
                  <p className="text-red-600">Room field is required</p>
                )}
              </div>

              {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
                <div className="flex-1">
                  {/* Book for User */}
                  <label
                    htmlFor="bookedForUser"
                    className="text-lg font-medium">
                    Book for User
                  </label>
                  <div className="relative mt-1">
                    <Controller
                      name="bookedForUser"
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { onBlur, onChange, value, ref } }) => (
                        <Autocomplete
                          size="small"
                          options={userSuggestions}
                          getOptionLabel={(userSuggestion) =>
                            `${userSuggestion.firstName} ${userSuggestion.lastName}`
                          }
                          onBlur={onBlur}
                          value={userSuggestions.find((user) => {
                            return user.userId == value;
                          })}
                          onChange={(e: any, newValue) => {
                            onChange(newValue ? newValue : null);
                          }}
                          onInputChange={(e: any, newInputValue) => {
                            newInputValue
                              ? fetchUserSuggestions(newInputValue)
                              : null;
                          }}
                          isOptionEqualToValue={(userSuggestion, value) =>
                            userSuggestion.userId == value?.userId
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputRef={ref}
                              id="bookedForUser"
                              className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Booking Purpose */}
            <div className="mt-4">
              <label htmlFor="details" className="text-lg font-medium">
                Purpose
              </label>
              <input
                {...register('details', { required: true })}
                id="details"
                type="string"
                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter the purpose or subject of booking"
                defaultValue={
                  bookingSelection.details ? bookingSelection.details : ''
                }
              />
              {errors.details?.type === 'required' && (
                <p className="text-red-600">
                  Description for the booking is required
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-x-4">
              {/* Start time */}
              <div className="flex-1">
                <label
                  htmlFor="startTime"
                  className="block text-lg font-medium">
                  Start Time
                </label>
                <input
                  {...register('startTime', { required: true })}
                  id="startTime"
                  type="time"
                  className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                  defaultValue={
                    bookingSelection.startTime
                      ? bookingSelection.startTime.format('HH:mm')
                      : ''
                  }
                />
                {errors.startTime?.type === 'required' && (
                  <p className="text-red-600">Start time field is required</p>
                )}
              </div>

              {/* End time */}
              <div className="flex-1">
                <label htmlFor="endTime" className="text-lg font-medium">
                  End Time
                </label>
                <input
                  {...register('endTime', { required: true })}
                  id="endTime"
                  type="time"
                  className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                  defaultValue={
                    bookingSelection.endTime
                      ? bookingSelection.endTime?.format('HH:mm')
                      : ''
                  }
                />
                {errors.endTime?.type === 'required' && (
                  <p className="text-red-600">End time field is required</p>
                )}
              </div>
            </div>

            {/* Booking Date */}
            <div className="mt-4">
              <label htmlFor="date" className="text-lg font-medium">
                Booking Date
              </label>
              <input
                {...register('date', { required: true })}
                id="date"
                type="date"
                min={new Date().toISOString().split('T')[0]} // Disable past dates
                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                placeholder="Select the room to make booking"
                defaultValue={booking.date}
              />
              {errors.date?.type === 'required' && (
                <p className="text-red-600">Start date field is required</p>
              )}
            </div>

            {/* Recurrence Type Radio Buttons */}
            {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
              <div className="mt-4">
                <label className="block text-lg font-medium">
                  Recurrence Type
                </label>
                <div className="flex space-x-4 mt-1">
                  {recurrenceTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={type}
                        checked={booking.recurrence === type}
                        onClick={handleRecurrenceType}
                        {...register('recurrence')}
                      />
                      <span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Recurrence Period */}
            {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
              <div className="mt-4">
                <label
                  htmlFor="recurrencePeriod"
                  className="block text-lg font-medium">
                  Recurrence Period (No. of Days)
                </label>
                <input
                  {...register('recurrencePeriod')}
                  type="number"
                  defaultValue={1}
                  className="w-full border-2 border-gray-100 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Save booking and cancel buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeBookingForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
                Save Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
