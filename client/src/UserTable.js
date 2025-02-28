import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CustomTable from "./Components/MuiTable";
import { useAuth } from "./context/AuthProvider";

function GetUserTable({ fontSize }) {
  const { token } = useAuth(); // 🔥 Récupérer le token via le contexte d'authentification
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!token) {
      console.warn("❌ Aucun token disponible, impossible de récupérer les données.");
      return;
    }

    console.log("📡 Token reçu dans UserTable :", token);
    console.log("📡 Envoi de la requête API à Genesys Cloud...");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.mypurecloud.de/api/v2/users?pageSize=200&pageNumber=1&expand=presence,routingStatus",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 Utilisation du token
            },
          }
        );

        console.log("✅ Réponse reçue dans UserTable :", response.data);
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
        console.error("❌ Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [token]); // 🔥 Refaire la requête si le token change

  // Vérification après mise à jour de `data`
  /*useEffect(() => {
    console.log("📊 Données mises à jour dans UserTable :", data);
  }, [data]);
*/
  const titles = useMemo(
    () => [
      { accessorKey: "name", header: "Nom", size: 120 },
      { accessorKey: "title", header: "Titre", size: 120 },
      { accessorKey: "email", header: "Email", size: 120 },
      { accessorKey: "state", header: "État", size: 120 },
      { accessorKey: "department", header: "Département", size: 120 },
      { accessorKey: "presence", header: "Présence", size: 120 },
      { accessorKey: "routingStatus", header: "Statut", size: 120 },
      { accessorKey: "divisionName", header: "Division", size: 120 },
      { accessorKey: "phoneNumber", header: "Téléphone", size: 120 },
      { accessorKey: "mediaType", header: "Type Média", size: 120 },
      { accessorKey: "type", header: "Type", size: 120 },
      { accessorKey: "countryCode", header: "Code Pays", size: 120 },
    ],
    []
  );

  return (
    <div>
      <CustomTable data={data} titles={titles} fontSize={fontSize} token={token} />
    </div>
  );
}

export default GetUserTable;
