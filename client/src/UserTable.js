
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CustomTable from './Components/MuiTable';
import io from 'socket.io-client';



// Composant pour récupérer les données depuis une API en utilisant le token
function GetUserTable({ token, expiryDate, fontSize }) {
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);


  
  useEffect(() => {
    if (token && new Date(expiryDate) >= new Date()) {
      console.log("Token encore valide", token);

      const fetchData = async () => {
        try {
          const response = await axios.get('https://api.mypurecloud.de/api/v2/users?pageSize=200&pageNumber=1&expand=presence,routingStatus', {
            headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête Authorization
            }
          });

          setData(response.data.entities.map(user => ({
            ...user,
            presence: user.presence ? user.presence.presenceDefinition.systemPresence : null,
            routingStatus: user.routingStatus ? user.routingStatus.status : null,
            divisionName: user.division ? user.division.name : null,
            phoneNumber: user.addresses && user.addresses.length > 0 ? user.addresses[0].address : null,
            mediaType: user.addresses && user.addresses.length > 0 ? user.addresses[0].mediaType : null,
            type: user.addresses && user.addresses.length > 0 ? user.addresses[0].type : null,
            countryCode: user.addresses && user.addresses.length > 0 ? user.addresses[0].countryCode : null
          })));
        } catch (error) {
          console.error('Erreur lors de la récupération Data :', error);
        }
      };

      fetchData(); // Récupérer les données initiales


      // Initialiser le WebSocket
      const newSocket = io('http://localhost:5000'); // Remplacez par l'URL de votre serveur WebSocket

      newSocket.on('dataUpdate', (updatedUsers) => {
        // Mettre à jour les données avec les nouvelles informations en temps réel
        setData((prevData) =>
          prevData.map(user => {
            return user.id === updatedUsers.id ? { ...user, ...updatedUsers } : user; // Mettre à jour uniquement l'utilisateur concerné
          })
        );
    });
   
      setSocket(newSocket); // Sauvegarder le socket

      return () => {
        newSocket.disconnect(); // Déconnecter le WebSocket lors du démontage du composant
      };
    
    } else {
      console.log("Token expiré : ", token, "La date d'expiration : ", expiryDate);
    }
  }, [token, expiryDate]); // Exécuter useEffect à chaque changement du token
  
  const titles = useMemo(() => [
    { accessorKey: 'name', header: 'Name', size: 120 },
    { accessorKey: 'title', header: 'Title', size: 120 },
    { accessorKey: 'email', header: 'Email', size: 120 },
    { accessorKey: 'state', header: 'Stat', size: 120 },
    { accessorKey: 'department', header: 'Departement', size: 120 },

    { accessorKey: 'presence', header: 'Presence', size: 120 },
    { accessorKey: 'routingStatus', header: 'Status', size: 120 },
    { accessorKey: 'divisionName', header: 'Division', size: 120 },
    { accessorKey: 'phoneNumber', header: 'Telephone', size: 120 },
    { accessorKey: 'mediaType', header: 'Type Media', size: 120 },
    { accessorKey: 'type', header: 'Type', size: 120 },
    { accessorKey: 'countryCode', header: 'Code Pays', size: 120 }
  ], []);

  return (
    <div>            
        <CustomTable data={data} titles={titles} fontSize={fontSize}/>
    </div>
  );
}

export default GetUserTable;
