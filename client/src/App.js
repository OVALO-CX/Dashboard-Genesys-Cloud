import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './context/AuthProvider';
import AuthCallback from './auth-components/AuthCallback';
//import { Dashboard } from './components/Dashboard';
import LoginButton from './auth-components/LoginButton';
//import { io } from 'socket.io-client';



//import AuthToken from './AuthToken'; // Importer le composant pour récupérer le jeton d'accès
//import RealTimeUpdates from './RealTimeUpdates';
//import GetUsers from './GetUsers';
import GetUsersURL from './GetUsersURL';
import GetUserTable from './UserTable';
import Dashboard from './Dashboard';
import PieChart from './Components/PieChart'

function App() {
/*  const [token, setToken] = useState('');
  const [socket, setSocket] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [droppedItems, setDroppedItems] = useState([]);

  // Fonction pour recevoir le token
  const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };
*/



  return (

    <AuthProvider>
    <Router>
      <div>
        {/*<AuthToken onTokenReceived={handleTokenReceived} /> {/* Appeler le composant pour récupérer le jeton d'accès */}
        {/* <RequestAPI token={token} /> {/* Appeler le composant pour afficher les données récupérées */}
        {/* <GetUsers token={token}/>*/}
        {/*<GetUsersURL token={token}/>*/}
        {/*<GetUserTable token={token} expiryDate={expiryDate}/>*/}
        
      </div>
      <div className="App">
        <h1>Application de test en temps réel</h1>
        {/*<RealTimeUpdates />*/}
      </div>
      {/* Utilisation de Routes à la place de Switch */}
        <DndProvider backend={HTML5Backend}> {/* Enveloppez votre application avec DndProvider */}
          <Routes>
            {/*<Route path="/" element={<Dashboard />} />*}
            {/*<Route path="/pie" element={<PieChart />} />*/}
            <Route path="/" element={<LoginButton />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard token/>} />
          </Routes>
        </DndProvider>
     
      
    </Router>
    </AuthProvider>
  );
}

export default App;
