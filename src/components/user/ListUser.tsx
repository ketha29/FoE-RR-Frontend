import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const ListUser = () => {
  return (
    <div className="relative overflow-x-auto sm:rounded-lg mt-20 px-10 py-6 bg-gray-100">
      <div className="flex flex-col">
        <div className="px-8 flex items-center justify-start mb-5 space-x-8">
          <div className="text-2xl font-semibold text-gray-800">
            User details
          </div>

          {/* <Add user button /> */}
          <div>
            <button className="ml-10 rounded-md bg-indigo-600 px-3 py-1 h-9 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Add User
            </button>
          </div>
        </div>

        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 shadow-xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-300">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    First name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Last name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Contact info
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    User type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                    first name
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                    last name
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                    username
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                    contact info
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                    user type
                  </td>
                  <td>
                    <button className="text-indigo-600 hover:bg-indigo-500 hover:text-white p-0.5 w-8 h-8 rounded-full">
                      <EditOutlinedIcon fontSize="small" />
                    </button>
                    <button className="ml-4 text-red-600 hover:bg-red-500 hover:text-white p-0.5 w-8 h-8 rounded-full">
                      <DeleteOutlinedIcon
                        className="font-bold"
                        fontSize="small"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUser;
