import axios from 'axios';
import qs from 'qs';

const GET_ALL_ROOM = "http://localhost:8082/room/all";
const ADD_ROOM = "http://localhost:8082/room/add";

export const getAllRooms = () => axios.get(GET_ALL_ROOM);

export const addRoom = (room: any) => {
  return axios.post(ADD_ROOM, qs.stringify(room), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
