const LoginErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Login Error</h1>
        <p className="text-gray-700 mb-4">
          Your account is currently inactive. Please contact the administration
          to activate your account.
        </p>
        <p className="text-gray-700 mb-6">
          If you need assistance, reach out to the AR office .
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => (window.location.href = '/info')} // Redirect to contact page
        >
          Info Page
        </button>
      </div>
    </div>
  );
};

export default LoginErrorPage;
