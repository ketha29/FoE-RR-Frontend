import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/booking/all";

export const getAllBookings = () => axios.get(REST_API_BASE_URL);