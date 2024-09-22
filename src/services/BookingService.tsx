import axios from "axios";

// Base URL for the API
const BASE_URL = "http://localhost:8082/booking";

// Endpoints
const ADD_BOOKING = (roomName: string, userId: number) => `${BASE_URL}/add-booking/${roomName}/${userId}`;
const UPDATE_BOOKING = (bookingId: number, userId: number) => `${BASE_URL}/update-booking/${bookingId}/${userId}`;
const DELETE_BOOKING = (bookingId: number) => `${BASE_URL}/delete-booking/${bookingId}`;

export const getAllBookings = () => axios.get(`${BASE_URL}/all`);

export const addBooking = (roomName: string, userId: number, booking: any) => {
    return axios.post(ADD_BOOKING(roomName, userId), booking, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateBooking = (bookingId: number, userId: number, booking: any) => {
    return axios.put(UPDATE_BOOKING(bookingId, userId), booking, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const deleteBooking = (bookingId: number) => {
    return axios.delete(DELETE_BOOKING(bookingId));
}