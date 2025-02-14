import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Composant pour récupérer le jeton d'accès depuis le backend
function AuthToken({ onTokenReceived }) {
  const [accessToken, setAccessToken] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [realTimeData, setRealTimeData] = useState(null); // Stocke les données en temps réel


  useEffect(() => {
    // Récupérer le jeton d'accès
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('http://localhost:8080/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const { access_token, token_expiry } = data;
        //const expiryDate = new Date(token_expiry).toISOString();
        
        setAccessToken(access_token);
        setExpirationDate(token_expiry);
        onTokenReceived({ access_token, token_expiry }); // Appeler la fonction avec le token et la date d'expiration une fois reçus
      } catch (error) {
        console.error('Erreur lors de la récupération du token :', error);
      }
    };
    fetchAccessToken(); // Appel de la fonction pour récupérer le jeton d'accès lors du montage du composant
  


    // Connexion au WebSocket
    const socket = io("http://localhost:8080");

    // Écoute des mises à jour de données en temps réel depuis le serveur
    socket.on("dataUpdate", (data) => {
        setRealTimeData(data); // Stockage de la donnée mise à jour
        console.log("Données en temps réel reçues :", data);
    });

    return () => {
        socket.disconnect(); // Déconnexion lors du démontage
    };
    
  
  
  }, []); // Le tableau vide en tant que second argument signifie que ce useEffect s'exécutera une seule fois lors du montage

  return null;
}

export default AuthToken;
