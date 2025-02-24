import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // 🔹 Fonction pour générer un `code_verifier` sécurisé
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  // 🔹 Fonction pour transformer le `code_verifier` en `code_challenge`
  const generateCodeChallenge = async (codeVerifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  // 🔹 Fonction pour rediriger vers Genesys Cloud avec PKCE
  const login = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Stocker `code_verifier` pour la prochaine étape
    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = `${process.env.REACT_APP_GENESYS_AUTH_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=users`;

    window.location.href = authUrl; // Redirige vers Genesys Cloud
  };

  // 🔹 Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('code_verifier');
    setToken(null);
    setUser(null);
  };

  // 🔹 Fonction pour échanger le `code` contre un `token`
  const exchangeCodeForToken = async (code) => {
    try {
      const codeVerifier = localStorage.getItem("code_verifier"); // Récupérer le `code_verifier` stocké
      if (!codeVerifier) throw new Error("Code Verifier introuvable.");

      const response = await axios.post(process.env.REACT_APP_GENESYS_TOKEN_URL, new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        code: code,
        code_verifier: codeVerifier, // 💡 Envoie le `code_verifier` à Genesys Cloud
      }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      setToken(access_token);
      fetchUserProfile(access_token);
    } catch (error) {
      console.error("Erreur lors de l'échange du code :", error);
    }
  };

  // 🔹 Fonction pour récupérer le profil utilisateur après authentification
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
