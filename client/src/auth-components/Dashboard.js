import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h2>Bienvenue, {user?.name || 'Utilisateur'}</h2>
      <p>Email : {user?.email}</p>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
};

export default Dashboard;
