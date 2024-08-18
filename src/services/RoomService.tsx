import axios from "axios";

const GET_ALL_ROOMS = "http://localhost:8082/room/all";

export const getAllRooms = () => axios.get(GET_ALL_ROOMS);