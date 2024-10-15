import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:8082/user';

// Endpoints
const GET_USERS = `${BASE_URL}/all`;
const ADD_USER = `${BASE_URL}/add-user`;
const DELETE_USER = (userId: number) => `${BASE_URL}/delete-user/${userId}`;

export const getAllUsers = () => axios.get(GET_USERS);

export const addUser = (user: any) => {
  return axios.post(ADD_USER, user, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteUser = (userId: number) => axios.delete(DELETE_USER(userId));
