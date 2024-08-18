import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/booking/all";
const ADD_BOOKING = "http://localhost:8082/booking/ADD-BOOKING"

export const getAllBookings = () => axios.get(REST_API_BASE_URL);

export const addBooking = (booking: any) => axios.post(ADD_BOOKING, booking);