import axios from 'axios';
import api from '../utils/api'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SIGNIN_URL = 'http://localhost:8082/auth/login';
const LOGOUT_URL = 'http://localhost:8082/logout';

export const loginWithGoogle = async (googleToken: string) => {
  const response = await api.post('/api/auth/google', { token: googleToken });
  return response.data;
};

export const logout1 = async () => {
  try {
    await api.post('/auth/logout',{},{
      withCredentials: true
    });
  
    // Remove access token from localStorage
    localStorage.removeItem("accessToken");
  
    window.location.href = '/booking/month';
  } catch (error) {
    console.error('Logout failed:', error);
    // Force cleanup anyway
    localStorage.removeItem('accessToken');
    window.location.href = '/booking/month';
  }
  
};

export const refreshToken = async () => {
  const response = await api.get('/auth/refresh',{
    withCredentials: true
  });
  console.log(response)
  return response.data.token;
};

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
