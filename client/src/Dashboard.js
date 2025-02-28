import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from '@mui/joy/Card';

import { useAuth } from './context/AuthProvider';
import { useNavigate } from 'react-router-dom';

import DropZone from "./Components/DropZone";
import DraggableItem from './Components/DraggableItem';
//import AuthToken from './AuthToken';
import GetUserTable from './UserTable';
import GetUserPie from './UserPie';

import { HiMiniTableCells } from "react-icons/hi2";
import { FaChartPie } from "react-icons/fa";
import { PiChartBarHorizontalFill } from "react-icons/pi";
import { IoBarChart } from "react-icons/io5";

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

// Map components
const componentMap = {
  'User Table': GetUserTable,
  'User PieChart': GetUserPie,
  // Add other mappings 
};

function Dashboard() {


  
  //const [token, setToken] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cards, setCards] = useState([]);

  //const { user, token, logout } = useAuth();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Token : ", token);

  // Function to receive the token
  /*const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };*/


  const handleDrop = (itemName) => {
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
        //data: { token, expiryDate } // Add data here
      }
    ]);
  };

  const retrieveToken = () => {
    localStorage.getItem('token');
  }

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

  return (
    <DndProvider backend={HTML5Backend}>
      {/*<AuthToken onTokenReceived={handleTokenReceived} />*/}

      <div>
        <h6>Draggable Items</h6>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name='User Table' onDrop={handleDrop} selectedIcon={HiMiniTableCells} token={token} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User PieChart" onDrop={handleDrop} selectedIcon={FaChartPie} token={token}/>
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data2" onDrop={handleDrop} selectedIcon={PiChartBarHorizontalFill} token={token}/>
          </div>
          <div style={{ marginRight: '2rem' }}>
            <DraggableItem name="User Data3" onDrop={handleDrop} selectedIcon={IoBarChart} token={token}/>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>

        <DropZone
          cards={cards}
          moveCard={moveCard}
          resizeCard={resizeCard}
          deleteCard={deleteCard}
          onAddCard={addCard}
          //onRefresh={handleTokenReceived}
          //onExport={handleTokenReceived}
          token={token}
        />
      </div>
    </DndProvider>
  );
};

export default Dashboard;