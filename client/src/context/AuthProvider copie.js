import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  // 🔹 Fonction de connexion : Redirige vers Genesys Cloud
  const login = () => {
    //const authUrl = `${process.env.REACT_APP_GENESYS_AUTH_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI)}&scope=openid profile`;
    const authUrl = `${process.env.REACT_APP_GENESYS_AUTH_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI)}&scope=users`;
    window.location.href = authUrl; // Redirige l'utilisateur vers Genesys Cloud
  };
  

  // 🔹 Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // 🔹 Échange le code d'autorisation contre un token d'accès
  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post(process.env.REACT_APP_GENESYS_TOKEN_URL, new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        code,
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);

      fetchUserProfile(access_token);
    } catch (error) {
      console.error("Erreur lors de l'échange du code :", error);
    }
  };

  // 🔹 Récupérer le profil de l'utilisateur connecté
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v2/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Erreur de récupération du profil utilisateur :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, exchangeCodeForToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
