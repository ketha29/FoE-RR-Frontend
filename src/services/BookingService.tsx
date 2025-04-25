// import axios from 'axios';
import api from '../utils/api'

// Base URL for the API
// const BASE_URL = 'http://localhost:8082/booking';
const BOOKING_ENDPOINT = '/booking';

// Endpoints
const GET_DAY_BOOKING = (date: string) => `${BOOKING_ENDPOINT}/day/${date}`;
const GET_WEEK_BOOKING = (weekStartDate: string, weekEndDate: string) =>
  `${BOOKING_ENDPOINT}/week/${weekStartDate}/${weekEndDate}`;
const ADD_BOOKING = (roomName: string) =>
  `${BOOKING_ENDPOINT}/add-booking/${roomName}`;
const UPDATE_BOOKING = (bookingId: number, userId: number) =>
  `${BOOKING_ENDPOINT}/update-booking/${bookingId}/${userId}`;
const DELETE_BOOKING = (bookingId: number, isDeleteOne: boolean) =>
  `${BOOKING_ENDPOINT}/delete-booking/${bookingId}/${isDeleteOne}`;
const CHECK_ROOM_AVAILABILITY = (date: string, roomName: string) =>
  `${BOOKING_ENDPOINT}/is-room-available/${date}/${roomName}`;

export const getAllBookings = () => api.get(`${BOOKING_ENDPOINT}/all`);

export const getDayBookings = async (date: string) => {
  return await api.get(GET_DAY_BOOKING(date));
};

export const getWeekBookings = async (
  weekStartDate: string,
  weekEndDate: string
) => {
  return await api.get(GET_WEEK_BOOKING(weekStartDate, weekEndDate));
};

export const addBooking = (roomName: string, booking: any) => {
  return api.post(ADD_BOOKING(roomName), booking, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateBooking = (
  bookingId: number,
  userId: number,
  booking: any
) => {
  return api.put(UPDATE_BOOKING(bookingId, userId), booking, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteBooking = (bookingId: number, isDeleteOne: boolean) => {
  return api.delete(DELETE_BOOKING(bookingId, isDeleteOne),{
    withCredentials:true
  });
};

export const isRoomAvailable = async (date: string, roomName: string) => {
  return await api.get(CHECK_ROOM_AVAILABILITY(date, roomName));
};
