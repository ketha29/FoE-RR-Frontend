export interface Room {
  roomId: number;
  capacity: number;
  roomName: string;
  description: string;
}

export interface Booking {
  bookingId: number;
  startTime: string;
  endTime: string;
  date: string;
  startDate: string;
  endDate: string;
  details: string;
  recurrence: string;
  recurrencePeriod: number;
  room: {
    roomName: string;
  };
  user: {
    firstName: string;
    lastName: string;
    userType: string;
  };
}