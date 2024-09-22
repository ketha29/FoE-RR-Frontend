interface DeleteConfirmationProps {
  deleteItem: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConformation = ({ deleteItem, onConfirm, onCancel }: DeleteConfirmationProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50'>
      <div className='bg-white rounded-md shadow-xl' style={{minWidth: '500px', maxWidth: '500px'}}>
        <h1 className='text-xl p-4'>Delete Confirmation</h1>
        <hr className='mb-1 border-gray-300'/>
        <div className='p-4'>
          <div className='bg-red-200 text-red-900 opacity-80 rounded-md p-2'>Are you sure want to delete the '{deleteItem}' ?</div>
        </div>
        <hr className='mt-1 mb-3 border-gray-300'/>
        {/* Delete and cancel delete buttons */}
        <div className='flex justify-end p-4 space-x-2'>
            <button
              onClick={onCancel}
              className='bg-red-white border border-gray-500 px-3 py-1 rounded-md text-gray-500 hover:bg-gray-500 hover:text-white'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className='bg-red-white border border-red-500 px-3 py-1 rounded-md text-red-500 hover:bg-red-500 hover:text-white'
            >
              Delete
            </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConformation
