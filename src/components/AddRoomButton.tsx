import { useContext } from 'react'
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const AddRoomButton = () => {
    const { setShowAddRoomForm } = useContext(GlobalContext)
    const navigator = useNavigate();

    const addRoom = () => {
        navigator("/add-room");
        setShowAddRoomForm(true);
    }

    return (
        <div>
            <button 
                className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={addRoom}
            >
                Add Room
            </button>
        </div>
    )
}

export default AddRoomButton