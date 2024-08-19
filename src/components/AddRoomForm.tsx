import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import GlobalContext from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { FieldValue, FieldValues, useForm } from 'react-hook-form';
import { addRoom } from '../services/RoomService';

const AddRoomForm = () => {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const { setShowAddRoomForm } = useContext(GlobalContext);
    const navigator = useNavigate();
    const closeBookingForm = () => {
        setShowAddRoomForm(false);
        navigator('/room/all');
    }
    const onSubmit = (data: FieldValues) => {
        const sanitizedData = {
            roomName: data.roomName,
            capacity: data.capacity,
            description: data.description,
        }

        console.log(sanitizedData);
        
        addRoom(data).then((response) => {
        console.log(response.data);
    }).catch(error => {
        console.error("Error adding room:", error.response?.data || error.message);
    });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex justify-center items-center h-screen bg-gray-300'>
                <div className='sm:w-2/3 w-full h-auto justify-center p-7 shadow-xl rounded-md bg-white'>
                    <header className='flex bg-gray-100 px-4 py-4 justify-between items-center'>
                        <h1 className="text-xl font-semibold">Add Booking</h1>
                        <button onClick={closeBookingForm} 
                            className="text-gray-400 hover:bg-gray-200 rounded-full">
                            <CloseIcon />
                        </button>
                    </header>

                    {/* Room Name */}
                    <div className='mt-5'>
                        <div className="mt-4">
                            <label htmlFor="roomName" className="text-lg font-medium">Room Name</label>
                            <input
                                {...register('roomName', {required: true})} id="roomName" type="string"
                                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Enter the room name"
                            />
                            {errors.roomName?.type === 'required' && <p className="text-red-600">Room name field is required</p>}
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="mt-4 space-x-3">
                        <label htmlFor="capacity" className="text-lg font-medium">Capacity:</label>
                            <input
                                {...register('capacity')} id="capacity" type='number'
                                className="w-16 border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Enter the capacity of the room"
                            /> 
                    </div>

                    {/* Description */}
                    <div className='mt-5'>
                        <div className="mt-4">
                            <label htmlFor="descriptoin" className="text-lg font-medium">Room Descriptoin</label>
                            <input
                                {...register('description')} id="descriptoin" type='string'
                                className="w-full border-2 border-gray-100 rounded-md p-2 mt-1"
                                placeholder="Select the room to make booking"
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type='submit'
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 border border-blue-700 rounded-md mt-4">
                        Submit
                    </button>
                </div>
            </div>
        </form>      
    )
}

export default AddRoomForm
