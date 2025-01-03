import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:8082/user';


// Endpoints
const GET_USERS = `${BASE_URL}/all`;
const ADD_USER = `${BASE_URL}/add-user`;
const GET_USERS_BY_NAME = (name:string) => `${BASE_URL}/get-by-name/${name}`
const DELETE_USER = (userId: number) => `${BASE_URL}/delete-user/${userId}`;

export const getAllUsers = () =>
  axios.get(GET_USERS, {
    withCredentials: true,
  });

export const addUser = (user: any) => {
  return axios.post(ADD_USER, user, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getUserByName = (name:string) => axios.get(GET_USERS_BY_NAME(name),{
  withCredentials: true,
});

export const deleteUser = (userId: number) => axios.delete(DELETE_USER(userId),{
  withCredentials: true,
});
