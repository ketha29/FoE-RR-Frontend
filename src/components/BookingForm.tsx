import { useContext, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { addBooking } from "../services/BookingService";

const recurrenceTypes = ['None', 'Daily', 'Weekly']

const BookingForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const { setShowBookingForm, daySelected } = useContext(GlobalContext);
    const navigator = useNavigate();
    const closeBookingForm = () => {
        setShowBookingForm(false);
        navigator('/home');
    }
    const [booking, setBooking] = useState({
        room: '',
        purpose: '',
        startTime: '',
        endTime: '',
        date: '',
        recurrenceType: 'None',
        recurrencePeriod: 0,
    });

    const handleRecurrenceType = (event: any) => setBooking({...booking, recurrenceType: event.target.value})

    const onSubmit = (data: FieldValues) => {
        const sanitizedData = {
            room: data.room,
            purpose: data.purpose,
            startTime: data.startTime,
            endTime: data.endTime,
            date: data.date,
            recurrenceType: data.recurrenceType,
            recurrencePeriod: data.recurrencePeriod,
        };
    
        addBooking(sanitizedData);
    };  

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="flex justify-center items-center h-screen bg-gray-300">
            <div className="sm:w-2/3 w-full h-auto justify-center p-7 shadow-xl rounded-md bg-white">
                <header className="flex bg-gray-100 px-4 py-4 justify-between items-center">
                    <h1 className="text-xl font-semibold">Add Booking</h1>
                    <button onClick={closeBookingForm} 
                        className="text-gray-400 hover:bg-gray-200 rounded-full">
                        <CloseIcon />
                    </button>
                </header>

                <div className="mt-5">
                    {/* Room */}
                    <div className="mt-4">
                        <label htmlFor="room" className="text-lg font-medium">Room</label>
                        <input
                            {...register('room', {required: true})} id="room" type="string"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Select the room to make booking"
                        />
                        {errors.startTime?.type === 'required' && <p className="text-red-600">Room field is required</p>}
                    </div>

                    {/* Booking Purpose */}
                    <div className="mt-4">
                        <label htmlFor="purpose" className="text-lg font-medium">Purpose</label>
                        <input
                            id="purpose" type="string"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Enter the purpose or subject of booking"
                        />
                    </div>

                    <div className="mt-4 flex gap-x-4">
                        {/* Start time */}
                        <div className="flex-1">
                            <label htmlFor="startTime" className="text-lg font-medium">Start Time</label>
                            <input
                                {...register('startTime', {required: true})} id="startTime" type="time"
                                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Select the start time"
                            />
                            {errors.startTime?.type === 'required' && <p className="text-red-600">Start time field is required</p>}
                        </div>

                        {/* End time */}
                        <div className="flex-1">
                            <label htmlFor="endTime" className="text-lg font-medium">End Time</label>
                            <input
                                {...register('endTime', {required: true})} id="endTime" type="time"
                                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Select the end time"
                            />
                            {errors.endTime?.type === 'required' && <p className="text-red-600">End time field is required</p>}
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="mt-4">
                        <label htmlFor="date" className="text-lg font-medium">Start Date</label>
                        <input
                            {...register('date', {required: true})} id="date" type="date"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Select the room to make booking"
                            defaultValue={daySelected.format('YYYY-MM-DD')}
                        />
                        {errors.date?.type === 'required' && <p className="text-red-600">Start date field is required</p>}
                    </div>

                    {/* Recurrence Type Radio Buttons */}
                    <div className="mt-4 flex space-x-3">
                        <div><p className="text-lg font-medium">Recurrence Type:</p></div>
                        <div>
                            {recurrenceTypes.map(type => (
                                <div className="flex flex-col space-y-2" key={type}>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value={type}
                                            checked={booking.recurrenceType === type}
                                            onClick={handleRecurrenceType}
                                            {...register('recurrenceType')}
                                            className="hidden"
                                        />
                                        <div
                                        className={`w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2 cursor-pointer 
                                            ${booking.recurrenceType === type 
                                                ? 'bg-blue-600 border-blue-600' 
                                                : 'bg-white'
                                            }`}
                                        >
                                            {booking.recurrenceType === type && (
                                                <div className="w-1 h-1 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recurrence Period */}
                    <div className="mt-4 space-x-3">
                        <label htmlFor="recurrencePeriod" className="text-lg font-medium">Reccurrence Period:</label>
                            <input
                                {...register('recurrencePeriod', {required: true})} id="recurrencePeriod" type="number"
                                className="w-16 border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Select the room to make booking"
                            /> 
                    </div>

                    <div></div>
                    {/* Submit button */}
                    <button
                        onClick={onSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 border border-blue-700 rounded-md mt-4">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </form>
  )
}

export default BookingForm