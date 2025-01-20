import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Remplacez par l'URL de votre serveur si nécessaire

const RealTimeUpdates = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Écouter les événements de mise à jour en temps réel
    socket.on("genesysUpdate", (update) => {
      console.log("Mise à jour en temps réel reçue :", update);
      setData(update);
    });

    // Nettoyer le socket à la fin du cycle de vie du composant
    return () => {
      socket.off("genesysUpdate");
    };
  }, []);

  return (
    <div>
      <h2>Données en temps réel de Genesys Cloud</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>En attente de mises à jour...</p>
      )}
    </div>
  );
};

export default RealTimeUpdates;
