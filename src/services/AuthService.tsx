import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SIGNIN_URL = 'http://localhost:8082/auth/login';
const LOGOUT_URL = 'http://localhost:8082/logout';

export const isAuthenticated = () => {
  return localStorage.getItem('userId') ? true : false;
};

export const isSuperAdmin = () => {
  const role = localStorage.getItem('userType');
  return role === 'superAdmin';
};

export const isAdmin = () => {
  const role = localStorage.getItem('userType');
  return role === 'admin';
};

export const isRegularUser = () => {
  const role = localStorage.getItem('userType');
  return role === 'regularUser';
};

export const logout = () => {
  axios.get(LOGOUT_URL, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};

export const startOAuth2Flow = () => {
  window.location.href = 'http://localhost:8082/oauth2/authorization/google'; // Redirects to Google OAuth
};

const login = async () => {
  const response = await axios.get(SIGNIN_URL, { withCredentials: true });
  localStorage.setItem('userType', response.data.userType);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userId', response.data.userId);
  return response.status;
};

const LoginUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const loginUser = async () => {
      const resposeStatus = await login();
      if (resposeStatus === 200) {
        // Force re-rendering
        navigate('/booking/day');
      } else {
        navigate('/booking/month');
      }
      navigate('/booking/month');
    };
    loginUser();
  }, []);
  return <></>;
};

export default LoginUser;
