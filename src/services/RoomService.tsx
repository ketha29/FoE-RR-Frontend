// import axios from 'axios';
import api from '../utils/api'
import qs from 'qs';

// Base URL for the API
// const BASE_URL = 'http://localhost:8082/room';
const ROOM_ENDPOINT = '/room'

// Endpoints
const GET_ROOMS = `${ROOM_ENDPOINT}/all`;
const ADMIN_ONLY_ROOMS = `${ROOM_ENDPOINT}/only-admin-booking`;
const ADD_ROOM = `${ROOM_ENDPOINT}/add-room`;
const UPDATE_ROOM = (roomId: number) => `${ROOM_ENDPOINT}/update-room/${roomId}`;
const DELETE_ROOM = (roomId: number) => `${ROOM_ENDPOINT}/delete-room/${roomId}`;
const AVAILABLE_ROOMS = (date: string) =>
  `${ROOM_ENDPOINT}/available-rooms-by-date/${date}`;

export const getAllRooms = () => api.get(GET_ROOMS);

export const getAdminOnlyBookingRooms = () => api.get(ADMIN_ONLY_ROOMS);

export const addRoom = (room: any) => {
  return api.post(ADD_ROOM, qs.stringify(room), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const updateRoom = (roomId: number, room: any) => {
  return api.put(UPDATE_ROOM(roomId), room, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const deleteRoom = (roomId: number) => api.delete(DELETE_ROOM(roomId));

export const availableRooms = async (date: string) => {
  return await api.get(AVAILABLE_ROOMS(date));
};
