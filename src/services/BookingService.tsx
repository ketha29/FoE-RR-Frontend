import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8082/booking/all";
const ADD_BOOKING = (roomName: string, userId: number) => `http://localhost:8082/booking/add-booking/${roomName}/${userId}`;
const UPDATE = (bookingId: number, userId: number) => `http://localhost:8082/booking/update-booking/${bookingId}/${userId}`;

export const getAllBookings = () => axios.get(REST_API_BASE_URL);

// export const getBooking = ()

export const addBooking = (roomName: string, userId: number, booking: any) => {
    return axios.post(ADD_BOOKING(roomName, userId), booking, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateBooking = (bookingId: number, userId: number, booking: any) => {
    return axios.put(UPDATE(bookingId, userId), booking, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}