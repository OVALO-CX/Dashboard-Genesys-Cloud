import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const { exchangeCodeForToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    console.log("code = " + code);
    if (code) {
      exchangeCodeForToken(code);
      navigate('/dashboard');
    }
  }, [searchParams, exchangeCodeForToken, navigate]);

  return <div>Connexion en cours...</div>;
};

export default AuthCallback;
