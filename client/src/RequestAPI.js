import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Composant pour récupérer les données depuis une API en utilisant le token
function RequestAPI({ token }) {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchDataWithToken = async () => {
      try {
        const response = await axios.get('https://api.mypurecloud.de/api/v2/authorization/divisions?pageSize=25&pageNumber=1', {
          headers: {
            Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête Authorization
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données avec le token :', error);
      }
    };

    if (token) {
      fetchDataWithToken(); // Appeler la fonction pour récupérer les données lors du montage du composant si le token est disponible
    }
  }, [token]); // Exécuter useEffect à chaque changement du token

  return (
    <div>
      
      <h2>Entités récupérées :</h2>
    <ul>
      {Array.isArray(data.entities) && data.entities.length > 0 ? (
        data.entities.map((entity, index) => (
          <li key={index}>{entity.name}</li>
        ))
      ) : (
        <li>Aucune donnée disponible</li>
      )}
    </ul>
    </div>
  );
}

export default RequestAPI;
