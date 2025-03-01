import { Tooltip } from '@mui/material';
import GlobalContext from '../context/GlobalContext';
import { useContext } from 'react';

interface DeleteConfirmationProps {
  deleteItem: string;
  onDeleteOne: () => void;
  onCancel: () => void;
  onDeleteAll?: () => void;
}

const DeleteConfirmation = ({
  deleteItem,
  onDeleteAll,
  onDeleteOne,
  onCancel,
}: DeleteConfirmationProps) => {
  const { selectedDeleteBooking } =
    useContext(GlobalContext);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm z-40">
      <div
        className="bg-white rounded-lg shadow-2xl transition-transform transform hover:scale-105 duration-300"
        style={{ minWidth: '400px', maxWidth: '90%' }}>
        <h1 className="text-2xl font-semibold text-gray-800 p-5 border-b border-gray-200">
          Delete Confirmation
        </h1>
        <div className="p-6">
          <div className="bg-red-100 text-red-700 font-medium rounded-lg p-3 text-center">
            Are you sure you want to delete{' '}
            <span className="font-bold">{deleteItem}</span>?
          </div>
        </div>

        {/* Delete and cancel buttons */}
        <div className="flex justify-end px-6 pb-6 space-x-4">
          <Tooltip title="Cancel">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200">
              Cancel
            </button>
          </Tooltip>

          {selectedDeleteBooking.isRecurrence && (
            <Tooltip title="Delete all recurring bookings">
              <button
                onClick={onDeleteAll}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-200">
                Delete All
              </button>
            </Tooltip>
          )}
          <Tooltip title="Delete current Booking">
            <button
              onClick={onDeleteOne}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
              Delete
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
