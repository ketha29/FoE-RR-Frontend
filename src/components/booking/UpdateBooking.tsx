import { useLocation } from 'react-router-dom';
import {
  isAdmin,
  isRegularUser,
  isSuperAdmin,
} from '../../services/AuthService';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { updateBooking } from '../../services/BookingService';
import { AxiosError } from 'axios';

const recurrenceTypes = ['none', 'daily', 'weekly'];

const UpdateBooking = () => {
  const regularUser = isRegularUser();
  const admin = isAdmin();
  const superAdmin = isSuperAdmin();
  const location = useLocation();
  const { booking } = location.state || {};
  const [recurrenceType, setRecurrenceType] = useState(
    booking.recurrence || 'none'
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRecurrenceType = (type: string) => {
    setRecurrenceType(type);
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      const formattedBooking = {
        ...data,
        recurrence: 'none',
        recurrencePeriod: admin || superAdmin ? data.recurrencePeriod : 0,
        room: {
          roomName: data.roomName,
        },
      };
      console.log(formattedBooking);

      const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? parseInt(userIdString) : -1;
      const response = await updateBooking(
        booking.bookingId,
        userId,
        formattedBooking
      );
      // setErrorMessage(null);
      console.log('Booking updated successfully: ', response.data);
      // closeBookingForm();
    } catch (error) {
      console.error(
        'Error adding booking:',
        (error as AxiosError).response?.data || (error as AxiosError).message
      );
      // setErrorMessage((error as AxiosError).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="sm:w-2/3 w-full h-auto justify-center p-7 shadow-xl rounded-md bg-white">
          <header className="flex bg-gray-100 p-4 justify-between items-center rounded-lg">
            <h1 className="text-xl font-semibold">Update Booking</h1>
          </header>

          {/* Room name */}
          <div className="mt-5">
            <div className="mt-4">
              <label htmlFor="roomName" className="text-lg font-medium">
                Room
              </label>
              <input
                {...register('roomName', { required: true })}
                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                defaultValue={booking.room.roomName}
              />
            </div>
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
              className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
              defaultValue={booking.details}
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
              <label htmlFor="startTime" className="text-lg font-medium">
                Start Time
              </label>
              <input
                {...register('startTime', { required: true })}
                id="startTime"
                type="time"
                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                defaultValue={booking.startTime}
              />
              {/* {errors.startTime?.type === 'required' && <p className="text-red-600">Start time field is required</p>} */}
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
                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                defaultValue={booking.endTime}
              />
              {/* {errors.endTime?.type === 'required' && <p className="text-red-600">End time field is required</p>} */}
            </div>
          </div>

          {/* Start Date */}
          <div className="mt-4">
            {regularUser && (
              <label htmlFor="date" className="text-lg font-medium">
                Booking Date
              </label>
            )}
            {(admin || superAdmin) && (
              <label htmlFor="date" className="text-lg font-medium">
                Start Date
              </label>
            )}
            <input
              {...register('date', { required: true })}
              id="date"
              type="date"
              className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
              defaultValue={booking.date}
            />
            {/* {errors.date?.type === 'required' && <p className="text-red-600">Start date field is required</p>} */}
          </div>

          {/* Recurrence Type Radio Buttons */}
          {(admin || superAdmin) && (
            <div className="mt-4 flex space-x-3">
              <div>
                <p className="text-lg font-medium">Recurrence Type:</p>
              </div>
              <div>
                {recurrenceTypes.map((type) => (
                  <div className="flex flex-col space-y-2" key={type}>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        checked={booking.recurrence === type}
                        onClick={() => handleRecurrenceType(type)}
                        className="hidden"
                        defaultValue={booking.recurrence}
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2 cursor-pointer 
                                            ${
                                              recurrenceType === type
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'bg-white'
                                            }`}>
                        {recurrenceType === type && (
                          <div className="w-1 h-1 rounded-full bg-white"></div>
                        )}
                      </div>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recurrence Period */}
          {(admin || superAdmin) && (
            <div className="mt-4 space-x-3">
              <label htmlFor="recurrencePeriod" className="text-lg font-medium">
                Reccurrence Period:
              </label>
              <input
                {...register('recurrencePeriod', { required: true })}
                id="recurrencePeriod"
                type="number"
                className="w-16 border-2 border-gray-100 rounded-md p-2 mt-1"
                placeholder="Select the room to make booking"
                defaultValue={booking.recurrencePeriod}
              />
            </div>
          )}

          <div></div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 border border-blue-700 rounded-md mt-4">
            Update
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateBooking;
