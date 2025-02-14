// Dashboard.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '@mui/joy/Card';
<<<<<<< Updated upstream
import DropZone from './Components/DropZone';
=======

import DropZone from "./Components/DropZone";
>>>>>>> Stashed changes
import DraggableItem from './Components/DraggableItem';
import GetUserTable from './UserTable';
import GetUserPie from './UserPie';
<<<<<<< Updated upstream
import Grid from './Components/Grid';
=======
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
  //const [showUserTable, setShowUserTable] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
=======
  const [cards, setCards] = useState([]);
>>>>>>> Stashed changes
  

  // Fonction pour recevoir le token
  const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };


  const handleDrop = (itemName) => {
<<<<<<< Updated upstream
    setDroppedItems([...droppedItems, itemName]);
   /* if (itemName === 'User Table') {
        setShowUserTable(true); // Afficher GetUserTable lorsque Item 1 est déposé
      }
      else 
      if (itemName === 'User PieChart') {
        setShowPieChart(true); // Afficher GetUserPie lorsque Item 1 est déposé
      }*/
=======
    console.log("Item dropped:", itemName);
    setCards((prevCards) => [
      ...prevCards,
      {
        id: prevCards.length + 1,
        name: itemName,
        initialLeft: snapToGrid(50),
        initialTop: snapToGrid(50),
        width: snapToGrid(150),
        height: snapToGrid(100),
        componentName: itemName,
      }
    ]);
    
>>>>>>> Stashed changes
      
  };

  const renderDroppedItem = (itemName, index) => {
    const CardStyle = {
      padding: '20px',
      width: '100%',
      height: '100%', // Hauteur fixe pour toutes les cartes
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };

    const ComponentToRender = componentMap[itemName]; // Récupérer le composant en fonction du nom
    console.log("Rendering item:", itemName, ComponentToRender);
    if (!ComponentToRender) {
      console.error(`Aucun composant trouvé pour ${itemName}`);  // Ajout d'une vérification dans la console
    }
    
    return (
      <div key={index} style={{ position: 'absolute', left: cards[index].initialLeft, top: cards[index].initialTop, width: '100%', height: '100%' }}>
        <Card style={CardStyle}>
          <h6>{itemName}</h6>
          {ComponentToRender ? (
            <ComponentToRender token={token} expiryDate={expiryDate}/>
          ) : (
            <div>Aucun composant associé</div> // Message par défaut si le composant n'est pas trouvé
          )}
        </Card>
      </div>
    );};

<<<<<<< Updated upstream
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
=======
  const addCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };
  

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
>>>>>>> Stashed changes



  return (
    <DndProvider backend={HTML5Backend}>
      
      <div>
        <h6>Draggable Items</h6>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '2rem' }}>
<<<<<<< Updated upstream
            <DraggableItem name="User Table" selectedIcon={HiMiniTableCells} />
=======
            <DraggableItem name='User Table' onDrop={handleDrop} selectedIcon={HiMiniTableCells} />
>>>>>>> Stashed changes
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User PieChart" selectedIcon={FaChartPie} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data2" selectedIcon={PiChartBarHorizontalFill} />
          </div>
          <div style={{ marginRight: '2rem' }}>
<<<<<<< Updated upstream
            <DraggableItem name="User Data 3 " selectedIcon={IoBarChart} />
          </div>
        </div>
      </div>
      <DropZone
        onDrop={handleDrop}
        droppedItems={droppedItems}
        renderDroppedItem={renderDroppedItem}
      />
=======
            <DraggableItem name="User Data 3" onDrop={handleDrop} selectedIcon={IoBarChart} />
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        
      <DropZone 
        cards={cards} 
        moveCard={moveCard} 
        resizeCard={resizeCard} 
        deleteCard={deleteCard} 
        onAddCard={addCard}/>
      </div>
>>>>>>> Stashed changes
    </DndProvider>
  );
}
export default Dashboard;

<<<<<<< Updated upstream



     /* <DropZone onDrop={handleDrop} droppedItems={droppedItems} renderDroppedItem={renderDroppedItem} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={12} sx={{ flexGrow: 1 }}>
        {droppedItems.map((item, index) => (
          <Grid item xs={6} sm={6} md={6} key={index}>
            {renderDroppedItem(item, index)}
          </Grid>
        ))}
      </Grid>*/
=======
/*
<GetUserTable
        token={token}
        expiryDate={expiryDate}
      />
*/
>>>>>>> Stashed changes
