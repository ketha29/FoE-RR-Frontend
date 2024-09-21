import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const AddBookingButton = () => {
    const { setShowBookingForm } = useContext(GlobalContext)
    // const [booking, setBooking] = useState([]);
    const navigator = useNavigate();

    const addBooking = () => {
        navigator("/booking/add-booking");
        setShowBookingForm(true);
    }

    return (
        <div>
            <button 
                className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={addBooking}
            >
            Add Booking
            </button>
        </div>
    )
}

export default AddBookingButton