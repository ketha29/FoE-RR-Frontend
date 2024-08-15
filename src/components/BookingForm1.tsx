import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import GlobalContext from '../context/GlobalContext';

const BookingForm1 = () => {
    // const {setShowBookingForm} = useContext(GlobalContext);
    return (
        <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
        <form className="bg-white rounded-lg shadow-2xl w-1/4">
            <header className="bg-gray-100 px-4 py-2 justify-between items-center">
                <button onClick={() => console.log("closed")
                } className="ml-96 text-gray-400 hover:bg-gray-200 rounded-full">
                    <CloseIcon />
                </button>
            </header>
        </form>
        </div>
    )
}

export default BookingForm1