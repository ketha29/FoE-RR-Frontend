type BookingType = {
  userType: string;
  bookingType: string;
  color: string;
};

const bookingColors: BookingType[] = [
  { userType: 'Regular User', bookingType: 'One day', color: 'bg-yellow-300' },
  { userType: 'Admin', bookingType: 'One day', color: 'bg-amber-400' },
  { userType: 'Admin', bookingType: 'Daily', color: 'bg-blue-400' },
  { userType: 'Admin', bookingType: 'Weekly', color: 'bg-red-400' },
  { userType: 'Super admin', bookingType: 'One day', color: 'bg-orange-400' },
  { userType: 'Super admin', bookingType: 'Daily', color: 'bg-blue-600' },
  { userType: 'Super admin', bookingType: 'Weekly', color: 'bg-red-600' },
];

const InfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 mt-14">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto shadow-lg rounded-2xl p-10 bg-orange-50">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10 mt-5 py-5">
            <h1 className="text-3xl font-bold text-amber-600 text-center">
              Welcome to the Room Booking System
            </h1>
            <h2 className="text-lg text-gray-600 text-center">
              Faculty of Engineering, University of Peradeniya
            </h2>
            <p className="mt-5 text-gray-700 leading-relaxed text-center">
              This platform offers a seamless way to reserve rooms within the
              faculty. Using a click-and-drag feature, users can easily book
              rooms for specific dates and time slots. Designed primarily for
              lecturers and non-academic staff, this system minimizes scheduling
              conflicts and manual effort. Users can check room availability in
              real-time, modify bookings, and receive instant confirmations.
            </p>
          </div>

          {/* Booking Procedure */}
          <div className="container mx-auto px-6 py-5 mt-5">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10">
              <h2 className="text-2xl font-semibold text-gray-800">
                How to Place a Booking
              </h2>

              {/* Regular Users */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">
                  For Academic Staff Members:
                </h3>
                <ul className="mt-2 text-gray-600 space-y-2">
                  <li>
                    1. Log in using your .eng account. If you encounter any
                    issues logging in, please contact an administrator for
                    assistance.
                  </li>
                  <li>
                    2. Navigate to the booking page and select your preferred
                    view from the dropdown menu.
                  </li>
                  <li>
                    3. In the month view, available time slots are highlighted
                    in green, while occupied slots are marked in red.
                  </li>
                  <li>
                    4. To book a room, click on a specific date in the month
                    view or use the dropdown to switch to the day view.
                  </li>
                  <li>
                    5. Use the "Add Booking" button or click and drag over your
                    desired time slot to make a reservation.
                  </li>
                  <li>
                    6. Please note that red-marked slots are unavailable for
                    booking. If you require assistance with unavailable slots,
                    kindly contact an administrator.
                  </li>
                </ul>
              </div>

              {/* Outsiders */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">
                  For External Users:
                </h3>
                <p className="mt-2 text-gray-600">
                  You are welcome to view all available bookings; however, only
                  authorized academic staff members can place bookings. <br />{' '}
                  If you require a reservation, please reach out to an
                  administrator for further assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Colors Legend */}
          <div className="container mx-auto px-6 py-5">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Booking types and corresponding colors
              </h2>

              {/* Booking Categories */}
              {['Regular User', 'Admin', 'Super admin'].map((userType) => (
                <div key={userType} className="mb-3">
                  <h3 className="text-lg font-medium text-gray-700">
                    {userType}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {bookingColors
                      .filter((booking) => booking.userType === userType)
                      .map((booking, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-100 rounded-lg p-2 shadow">
                          <span
                            className={`w-6 h-6 rounded-full mr-2 ${booking.color}`}></span>
                          <p className="text-gray-700">{booking.bookingType}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-50 text-gray-700 text-center py-4">
        Developed by a team of students as part of their second-year project
        under the supervision of
        <a
          href="https://people.ce.pdn.ac.lk/staff/academic/isuru-nawinne/"
          className="font-semibold hover:text-amber-600">
          {' '}
          Dr. Isuru Nawinne
        </a>
        .
      </footer>
    </div>
  );
};

export default InfoPage;
