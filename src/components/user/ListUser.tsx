import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { useContext, useEffect, useState } from 'react';
import { User } from '../Interfaces';
import { deleteUser, getAllUsers } from '../../services/UserService';
import { Tooltip } from '@mui/material';
import GlobalContext from '../../context/GlobalContext';
import AddUserForm from './AddUserForm';
import DeleteConformation from '../DeleteConfirmation';
import { useAuth } from '../../context/AuthContext';

const ListUser = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [showDeleteConformation, setShowDeleteConformation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { showAddUserForm, setShowAddUserForm } = useContext(GlobalContext);

  const authContext = useAuth();
    
      if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
    
      const { user } = authContext;
      
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
    const filtered = userList.filter((logUser) => {
      const firstName = logUser.firstName ? logUser.firstName.toLowerCase() : '';
      const lastName = logUser.lastName ? logUser.lastName.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      return firstName.includes(query) || lastName.includes(query);
    });
    setFilteredUsers(filtered);
  }, [searchQuery, userList]);

  // Delete the selected room details
  const handleDelete = async (logUser: User) => {
    try {
      await deleteUser(logUser.userId);
      fetchUsers();
    } catch (error) {
      //   setErrorMessage((error as AxiosError).message);
      console.log('Error in getting the users:', error);
    }
  };

  // Show the conformation dialog box
  const confirmDelete = (logUser: User) => {
    setShowDeleteConformation(true);
    setSelectedUser(logUser);
  };

  // Cancel deletion action
  const cancelDelete = () => {
    setShowDeleteConformation(false);
  };

  // Proceed with deletion
  const proceedDelete = () => {
    setShowDeleteConformation(false);
    selectedUser && handleDelete(selectedUser);
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg mt-20 px-10 py-6 bg-gray-100">
      <div className="flex flex-col">
        <div className="px-8 flex items-center justify-start mb-5 space-x-8">
          <div className="text-2xl font-semibold text-gray-800">
            User details
          </div>

          {/* <Add User button /> */}
          {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
            <div>
              <button
                className="ml-10 rounded-md bg-indigo-600 px-3 py-1 h-9 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => setShowAddUserForm(true)}>
                Add User
              </button>
            </div>
          )}

          {/* Get the search query */}
          <input
            type="text"
            value={searchQuery}
            // Update search query
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search user..."
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
                  {/* {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
                    <th
                      scope="col"
                      className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Username
                    </th>
                  )} */}
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Contact info
                  </th>
                  {((user?.userType == "admin") || (user?.userType == "superAdmin")) &&(
                    <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    User type
                  </th>)}
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-gray-700 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((logUser) => (
                    <tr
                      key={logUser.userId}
                      className="hover:bg-blue-50 transition duration-200 ease-in-out">
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                        {logUser.firstName}
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-600">
                        {logUser.lastName}
                      </td>
                      {/*{((user?.userType == "admin") || (user?.userType == "superAdmin")) && (
                        <td className="whitespace-nowrap text-sm text-gray-600">
                          {logUser.userName}
                        </td>
                      )} */}
                      <td className="whitespace-nowrap text-sm text-gray-600">
                        {logUser.email} <br />
                        {/* {user.phoneNo} */}
                      </td>
                      {((user?.userType == "admin") || (user?.userType == "superAdmin")) && (<td className="whitespace-nowrap text-sm text-gray-600">
                        {logUser.userType}
                      </td>)}

                      <td className="whitespace-nowrap text-right text-sm font-medium">
                        {(((user?.userType == "admin") && logUser.userType === 'regularUser') ||
                          (user?.userType == "superAdmin")) && (
                          <span className="px-6">
                            <Tooltip title="Edit" arrow>
                              <button className="text-indigo-600 hover:bg-indigo-500 hover:text-white p-0.5 w-8 h-8 rounded-full">
                                <EditOutlinedIcon fontSize="small" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <button
                                className="ml-4 text-red-600 hover:bg-red-500 hover:text-white p-0.5 w-8 h-8 rounded-full"
                                onClick={() => confirmDelete(logUser)}>
                                <DeleteOutlinedIcon fontSize="small" />
                              </button>
                            </Tooltip>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-start text-sm text-red-500">
                      User found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showAddUserForm && <AddUserForm onUserAddition={fetchUsers} />}

      {/* Show the deletion confiramation component */}
      {showDeleteConformation && (
        <DeleteConformation
          deleteItem={`User ${
            selectedUser?.firstName
          } ${selectedUser?.lastName.charAt(0)} (${selectedUser?.userName})`}
          onDeleteOne={proceedDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default ListUser;
