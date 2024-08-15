import React, { useEffect, useState } from 'react'
import { getAllBookings } from '../services/BookingService'
import dayjs from 'dayjs';

type Booking = {
    bookingId: number;
    startTime: string;
    endTime: string;
    date: string;
    recurrence: string;
    recurrencePeriod: number;
}

const ListBooking = () => {
    const [bookingList, setBookingList] = useState<Booking[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllBookings();
            setBookingList(response.data.bookingList)
            console.log(response.data.bookingList);            
        }
        fetchData();
    }, []);

  return (
    <div>
        <h2>List of Booking</h2>
        <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Start time</th>
                    <th>End time</th>
                    <th>Date</th>
                    <th>recurrence</th>
                    <th>recurrence period</th>
                </tr>
            </thead>
            <tbody>
                {
                    bookingList.map(booking => 
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.startTime}</td>
                            <td>{booking.endTime}</td>
                            <td>{booking.date}</td>
                            <td>{booking.recurrence}</td>
                            <td>{booking.recurrencePeriod}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>
  )
}

export default ListBooking
