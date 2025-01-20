
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BasicPie from './Components/PieChart';
import Grid from '@mui/joy/Grid';


// Composant pour récupérer les données depuis une API en utilisant le token
function GetUserPie({ token, expiryDate }) {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
      if (token && new Date(expiryDate) >= new Date()) {
       
      console.log("Token encore valide", token);
        axios.get('https://api.mypurecloud.de/api/v2/users?pageSize=200&pageNumber=1&expand=presence,routingStatus', {
          headers: {
            Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête Authorization
          }
        }).then(response=>{
            console.log(response.data.entities);

          // Filtrer les données pour compter le nombre d'utilisateurs disponibles et hors ligne
        const availableUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Available');
        const busyUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Busy');
        const awayUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Away');
        const mealUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Meal');
        const meetingUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Meeting');
        const trainingUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Training');
        const breakUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Break');
        const offlineUsers = response.data.entities.filter(user => user.presence && user.presence.presenceDefinition.systemPresence === 'Offline'); 
        const pieChartData = [
            { id: 0, value: availableUsers.length, label: 'Available', color: 'green' },
            { id: 1, value: busyUsers.length, label: 'Busy', color: 'orange' },
            { id: 2, value: awayUsers.length, label: 'Away', color: 'yellow' },
            { id: 3, value: mealUsers.length, label: 'Meal', color: 'brown' },
            { id: 4, value: meetingUsers.length, label: 'Meeting', color: 'red' },
            { id: 5, value: trainingUsers.length, label: 'Training', color: '#0000FF' },
            { id: 6, value: breakUsers.length, label: 'Break', color: 'purple' },
            { id: 7, value: offlineUsers.length, label: 'Offline', color: 'gray' },
          ];
        setData1(pieChartData);

        const statusOnUsers = response.data.entities.filter(user => user.routingStatus && user.routingStatus.status !== 'OFF_QUEUE');
        const statusOffUsers = response.data.entities.filter(user => user.routingStatus && user.routingStatus.status === 'OFF_QUEUE');
   
        const pieChartData2 = [
            { id: 0, value: statusOnUsers.length, label: 'on'},
            { id: 1, value: statusOffUsers.length, label: 'off' }
          ];
        
        setData2(pieChartData2);

        }).catch (error => {
          console.error('Erreur lors de la récupération Data :', error);
        }) 
      }else {
        console.log("Token expiré : ", token , "La date d'expiration : ", expiryDate);

      }

  }, [token]); // Exécuter useEffect à chaque changement du token



  return (
    <Grid item xs={6} sm={6} md={6}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>           
        <BasicPie data1={data1} data2={data2} title="User Availability" />
    </div>
  </Grid>
  );
}

export default GetUserPie;
