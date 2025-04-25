import axios from 'axios';
import api from '../utils/api'

// Base URL for the API
const USER_ENDPOINT = 'user';

// Endpoints
const GET_USERS = `${USER_ENDPOINT}/all`;
const ADD_USER = `${USER_ENDPOINT}/add-user`;
const GET_USERS_BY_NAME = (name:string) => `${USER_ENDPOINT}/get-by-name/${name}`
const DELETE_USER = (userId: number) => `${USER_ENDPOINT}/delete-user/${userId}`;

export const getAllUsers = () =>
  api.get(GET_USERS, {
    withCredentials: true,
  });

export const addUser = (user: any) => {
  return api.post(ADD_USER, user, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getUserByName = (name:string) => api.get(GET_USERS_BY_NAME(name),{
  withCredentials: true,
});

export const deleteUser = (userId: number) => api.delete(DELETE_USER(userId),{
  withCredentials: true,
});
