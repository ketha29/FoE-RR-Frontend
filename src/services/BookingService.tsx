import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/booking/all";
const ADD_BOOKING = (roomId: string, userId: number) => `http://localhost:8082/booking/add-booking/${roomId}/${userId}`;

export const getAllBookings = () => axios.get(REST_API_BASE_URL);

export const addBooking = (roomId: string, userId: number, booking: any) => {
    return axios.post(ADD_BOOKING(roomId, userId), booking, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
