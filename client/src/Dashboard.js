// Dashboard.js
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '@mui/joy/Card';
//import DropZone from './Components/DropZone';
import DropZone from "./Components/DragDropZone";
import DraggableItem from './Components/DraggableItem';
import AuthToken from './AuthToken';
import GetUserTable from './UserTable';
import GetUserPie from './UserPie';
import Grid from './Components/Grid';

import { Button } from "@mui/joy";

import { HiMiniTableCells } from "react-icons/hi2";
import { FaChartPie } from "react-icons/fa";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { IoBarChart } from "react-icons/io5";


const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;


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
  const [cards, setCards] = useState([]);
  //const [showUserTable, setShowUserTable] = useState(false);
  //const [showPieChart, setShowPieChart] = useState(false);
  

  // Fonction pour recevoir le token
  const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };

  const handleDrop = (itemName) => {
    setCards([
      ...cards,
      {
        id: cards.length + 1,
        name: itemName,
        initialLeft: snapToGrid(50),
        initialTop: snapToGrid(50),
        width: snapToGrid(150),
        height: snapToGrid(100),
      },
    ]);
    
    /*if (itemName === 'User Table') {
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

  const addCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };
  /*const addCard = ({ left, top }) => {
    setCards((prevCards) => [
      ...prevCards,
      {
        id: prevCards.length + 1,
        initialLeft: snapToGrid(left),
        initialTop: snapToGrid(top),
        width: snapToGrid(150), // Largeur par défaut
        height: snapToGrid(100), // Hauteur par défaut
      },
    ]);
  };*/

  const moveCard = (id, left, top) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, initialLeft: left, initialTop: top } : card
      )
    );
  };

  const resizeCard = (id, width, height) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, width, height } : card
      )
    );
  };

  const deleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };




  return (
    <DndProvider backend={HTML5Backend}>
      <AuthToken onTokenReceived={handleTokenReceived} />
      <div>
        <h6>Draggable Items</h6>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Table" onDrop={handleDrop} selectedIcon={HiMiniTableCells} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User PieChart" onDrop={handleDrop} selectedIcon={FaChartPie} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data2" onDrop={handleDrop} selectedIcon={PiChartBarHorizontalFill} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data 3 " onDrop={handleDrop} selectedIcon={IoBarChart} />
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        
        <DropZone cards={cards} moveCard={moveCard} resizeCard={resizeCard} deleteCard={deleteCard} onAddCard={addCard}
        //droppedItems={droppedItems}
        //renderDroppedItem={renderDroppedItem}
        />
      </div>
    </DndProvider>
  );
};

export default Dashboard;




     /* <DropZone onDrop={handleDrop} droppedItems={droppedItems} renderDroppedItem={renderDroppedItem} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={12} sx={{ flexGrow: 1 }}>
        {droppedItems.map((item, index) => (
          <Grid item xs={6} sm={6} md={6} key={index}>
            {renderDroppedItem(item, index)}
          </Grid>
        ))}
      </Grid> */