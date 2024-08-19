import axios from "axios";

const GET_ALL_ROOM = "http://localhost:8082/room/all";
const ADD_ROOM = "http://localhost:8082/room/add"

export const getAllRooms = () => axios.get(GET_ALL_ROOM);

export const addRoom = (room: any) => axios.post(ADD_ROOM, room, {
    headers: {
        'Content-Type': 'application/json',
    }
});
