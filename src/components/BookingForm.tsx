import { useContext } from "react";
import { FieldValues, useForm } from "react-hook-form";
import GlobalContext from "../context/GlobalContext";

const BookingForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    
    const onSubmit = (data: FieldValues) => console.log(data);  
    const {setShowBookingForm} = useContext(GlobalContext);

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
        <div className="flex justify-center items-center h-screen bg-gray-300">
            <div className="w-2/3 p-7 shadow-xl rounded-md bg-white">
                <h1 className="text-2xl font-semibold">Add Booking</h1>
                <hr className="mt-2" />
                <div className="mt-5">
                    <div>
                        <label htmlFor="startTime" className="text-lg font-medium">Start Time</label>
                        <input
                            {...register('startTime', {required: true})} id="startTime" type="time"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Select the start time"
                        />
                        {errors.startTime?.type === 'required' && <p className="text-red-600">Start time field is required</p>}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="endTime" className="text-lg font-medium">End Time</label>
                        <input
                            id="endTime" type="time"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Select the end time"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="room" className="text-lg font-medium">Room</label>
                        <input
                            id="room" type="string"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Select the room to make booking"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="purpose" className="text-lg font-medium">Purpose</label>
                        <input
                            id="purpose" type="string"
                            className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                            placeholder="Enter the purpose or subject of booking"
                        />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 border border-blue-700 rounded-md mt-4">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </form>
  )
}

export default BookingForm