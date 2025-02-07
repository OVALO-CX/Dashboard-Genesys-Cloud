const express = require('express')
const cors = require('cors')
const http = require("http")
const platformClient = require('purecloud-platform-client-v2');
const socketIo = require("socket.io");

const { URLSearchParams } = require('url');
const path = require('path');

const CLIENT_ID = 'c00eed13-9bbd-475e-8527-87f99693beec';
const CLIENT_SECRET = 'b1jMSjrejW1-6tGtP3iT4-Ht2miEOOwL0kDaVm1yp_Y'
/*'c0kaEYSkwsaiz-cVc6-rY-KFRhu3tMz8lSZO9Halo1c';*/


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "*"}});

let accessToken = null;
app.use(express.json());
app.use(cors());



// Route pour obtenir le jeton d'accès via API
app.get("/api", async (req, res) => {
    try {
        const client = platformClient.ApiClient.instance;
        client.setEnvironment(platformClient.PureCloudRegionHosts.eu_central_1);
        await client.loginClientCredentialsGrant(CLIENT_ID, CLIENT_SECRET);
        const tokenInfo = client.authData.accessToken;
        const tokenExpiry = client.authData.tokenExpiryTime;
        const expiryDate = new Date(tokenExpiry).toISOString();
        accessToken = tokenInfo; // Sauvegarde le token pour les WebSockets
        res.json({ access_token: tokenInfo, token_expiry: expiryDate });
        

    
    
    } catch (error) {
        console.error("Erreur lors de l'obtention du token :", error);
        res.status(500).json({ error: "Erreur lors de l'obtention du token" });
    }
});



// Configuration du WebSocket
io.on("connection", (socket) => {
    console.log("Client connecté au WebSocket");

    // Envoi de mises à jour périodiques (ou basées sur des événements de Genesys) au client
    const intervalId = setInterval(async () => {
        try {
            const client = platformClient.ApiClient.instance;
            client.setEnvironment(platformClient.PureCloudRegionHosts.eu_central_1);
            await client.loginClientCredentialsGrant(CLIENT_ID, CLIENT_SECRET);

            const usersApi = new platformClient.UsersApi();
            const usersData = await usersApi.getUsers();

            // Envoi des données mises à jour au client
            socket.emit("dataUpdate", usersData.entities);
        } catch (error) {
            console.error("Erreur lors de la récupération des données en temps réel :", error);
        }
    }, 21600000); // Intervalle de 5 secondes, ajustez selon les besoins

    
    socket.on("disconnect", () => {
        clearInterval(intervalId); // Stoppe les mises à jour lorsque le client est déconnecté
        console.log("Client déconnecté du WebSocket");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

module.exports = app;