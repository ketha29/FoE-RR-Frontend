import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://localhost:8082/user';

// Endpoints
const GET_USERS = `${BASE_URL}/all`;

export const getAllUsers = () => axios.get(GET_USERS);
