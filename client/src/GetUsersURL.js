import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Composant pour récupérer les données depuis une API en utilisant le token
function GetUsersURL({ token }) {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchDataWithToken = async () => {
      try {
        const response = await axios.get('https://api.mypurecloud.de/api/v2/scim/users', {
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
      
        {/*<h2>Profils récupérés :</h2>*/}
        {/*<ul>
            {Array.isArray(data.Resources) && data.Resources.length > 0 ? (
            data.Resources.map((entity, index) => (
              <tr key={index}>
                <td>{entity.userName}</td>
                <td>{entity.displayName}</td>
                <td>{entity.title}</td>
                <td>
                {entity.phoneNumbers && entity.phoneNumbers.length > 0 ? (
                  entity.phoneNumbers.map((phoneNumber, index) => (
                    <div key={index}>{phoneNumber.value}</div>
                  ))
                ) : (
                  <div>N/A</div>
                )}
                </td>
            </tr>


          /*
          <div key={index}>
            <li>{entity.displayName}</li>
            <li>{entity.title}</li>
          </div>
          *
            
            ))
            ) : (
            <li>Aucune donnée disponible</li>
            )}
          </ul>*/}

      <table>
      <thead>
        <tr>
          <th>Nom d'utilisateur</th>
          <th>Nom</th>
          <th>Titre</th>
          <th>Numéro de téléphone</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data.Resources) && data.Resources.length > 0 ? (
          data.Resources.map((entity, index) => (
            <tr key={index}>
              <td>{entity.userName}</td>
              <td>{entity.displayName}</td>
              <td>{entity.title}</td>
              <td>
                {entity.phoneNumbers && entity.phoneNumbers.length > 0 ? (
                  entity.phoneNumbers.map((phoneNumber, index) => (
                    <div key={index}>
                      <div>{phoneNumber.value}</div>
                      <div>{phoneNumber.type}</div>
                    </div>
                  ))
                ) : (
                  <div>N/A</div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">Aucune donnée disponible</td>
          </tr>
        )}
      </tbody>
      </table>




    </div>
  );
}

export default GetUsersURL;
