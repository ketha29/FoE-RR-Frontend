import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { useEffect, useState } from 'react';
import { User } from '../Interfaces';
import { getAllUsers } from '../../services/UserService';
import { Tooltip } from '@mui/material';

const ListUser = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all user details from backend
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUserList(response.data.userList);
    } catch (error) {
      console.log(error);
    }
  };

  // Render user details once when the page is loaded
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users according to the search query
  useEffect(() => {
    const filtered = userList.filter((user) => {
      const firstName = user.firstName ? user.firstName.toLowerCase() : '';
      const lastName = user.lastName ? user.lastName.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      return firstName.includes(query) || lastName.includes(query);
    });
    setFilteredUsers(filtered);
  }, [searchQuery, userList]);

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

          {/* Get the search query */}
          <input
            type="text"
            value={searchQuery}
            // Update search query
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name..."
            className="border border-gray-300 rounded-md w-72 h-9 shadow-lg"
          />
        </div>

        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border border-gray-200 shadow-xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-300">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    First name
                  </th>
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Last name
                  </th>
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Contact info
                  </th>
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    User type
                  </th>
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-blue-50 transition duration-200 ease-in-out">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.firstName}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {user.lastName}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {user.userName}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {user.email} <br />
                      {/* {user.phoneNo} */}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {user.userType}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <Tooltip title="Edit" arrow>
                        <button className="text-indigo-600 hover:bg-indigo-500 hover:text-white p-0.5 w-8 h-8 rounded-full">
                          <EditOutlinedIcon fontSize="small" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <button className="ml-4 text-red-600 hover:bg-red-500 hover:text-white p-0.5 w-8 h-8 rounded-full">
                          <DeleteOutlinedIcon fontSize="small" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUser;
