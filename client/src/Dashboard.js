// Dashboard.js
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '@mui/joy/Card';
import DropZone from './Components/DropZone';
import DraggableItem from './Components/DraggableItem';
import AuthToken from './AuthToken';
import GetUserTable from './UserTable';
import GetUserPie from './UserPie';
import Grid from './Components/Grid';

import { HiMiniTableCells } from "react-icons/hi2";
import { FaChartPie } from "react-icons/fa";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { IoBarChart } from "react-icons/io5";


// Mappage des composants
const componentMap = {
  'User Table': GetUserTable,
  'User PieChart': GetUserPie,
  // Ajout d'autres mappages 
};

function Dashboard() {
  const [token, setToken] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [droppedItems, setDroppedItems] = useState([]);
  //const [showUserTable, setShowUserTable] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  

  // Fonction pour recevoir le token
  const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };

  const handleDrop = (itemName) => {
    setDroppedItems([...droppedItems, itemName]);
   /* if (itemName === 'User Table') {
        setShowUserTable(true); // Afficher GetUserTable lorsque Item 1 est déposé
      }
      else 
      if (itemName === 'User PieChart') {
        setShowPieChart(true); // Afficher GetUserPie lorsque Item 1 est déposé
      }*/
      
  };

  const renderDroppedItem = (itemName, index) => {
    const CardStyle = {
      padding: '0.01%',
      width: '100%',
      height: '100%', // Hauteur fixe pour toutes les cartes
    };

    const ComponentToRender = componentMap[itemName]; // Récupérer le composant en fonction du nom
    return (
      <div key={index} style={{ width: '100%', height: '100%' }}>
        <Card style={CardStyle}>
          <h6>{itemName}</h6>
          {ComponentToRender ? (
            <ComponentToRender token={token} expiryDate={expiryDate} />
          ) : (
            <div>Aucun composant associé</div> // Message par défaut si le composant n'est pas trouvé
          )}
        </Card>
      </div>
    );};

  /*const renderDroppedItem = (itemName, index) => {
    switch (itemName) {
      case 'User Table':
        return (
          <div key={index}>
            <Card style={{ padding: '0.01%', width: '100%', height: '100%' }}>
              <h6>{itemName}</h6>
              <GetUserTable token={token} expiryDate={expiryDate} />
            </Card>
          </div>
        );
      case 'User PieChart':
        return (
          <div key={index}>
            <Card style={{ padding: '0.01%', width: '100%', height: '100%' }}>
              <h6>{itemName}</h6>
              <GetUserPie token={token} expiryDate={expiryDate} />
            </Card>
          </div>
        );
      default:
        return null;
    }
  };*/




  return (
    <DndProvider backend={HTML5Backend}>
      <AuthToken onTokenReceived={handleTokenReceived} />
      <div>
        <h6>Draggable Items</h6>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Table" selectedIcon={HiMiniTableCells} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User PieChart" selectedIcon={FaChartPie} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data2" selectedIcon={PiChartBarHorizontalFill} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data 3 " selectedIcon={IoBarChart} />
          </div>
        </div>
      </div>
      <DropZone
        onDrop={handleDrop}
        droppedItems={droppedItems}
        renderDroppedItem={renderDroppedItem}
      />
    </DndProvider>
  );
}
export default Dashboard;




     /* <DropZone onDrop={handleDrop} droppedItems={droppedItems} renderDroppedItem={renderDroppedItem} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={12} sx={{ flexGrow: 1 }}>
        {droppedItems.map((item, index) => (
          <Grid item xs={6} sm={6} md={6} key={index}>
            {renderDroppedItem(item, index)}
          </Grid>
        ))}
      </Grid>*/