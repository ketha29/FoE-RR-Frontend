import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/booking/month');
    } else {
      navigate('/login-error');
    }
  }, [searchParams, navigate]);

  return <div>Processing login...</div>;
};

export default OAuthSuccess;