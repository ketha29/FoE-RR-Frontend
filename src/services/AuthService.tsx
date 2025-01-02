import axios from "axios";

const SIGNIN_URL = "http://localhost:8082/auth/login";
const LOGOUT_URL = "http://localhost:8082/logout";


export const login = async () => {
    const response = await axios.get(SIGNIN_URL, { withCredentials: true })
    localStorage.setItem("userType", response.data.userType);
    localStorage.setItem("token", response.data.token);
}

export const isLoggedIn = () => {
    const loggedUser = !!localStorage.getItem('token') ? true : login();
    return !!loggedUser;
}

export const isAuthenticated = () => {
    const token = isLoggedIn() ? localStorage.getItem('token') : null;
    return !!token;
}

export const getToken = () => {
    const token = isAuthenticated() ? localStorage.getItem('token') : null;
    return token;
}

export const isSuperAdmin = () => {
    const role = localStorage.getItem('userType');
    return role === 'superAdmin';
}

export const isAdmin = () => {
    const role = localStorage.getItem('userType');
    return role === 'admin';
}

export const isRegularUser = () => {
    const role = localStorage.getItem('userType');
    return role === 'regularUser';
}

export const logout = () => {
    axios.get(LOGOUT_URL, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        }
    })
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
}