import React, {useState, useEffect} from "react";
import { useDrop } from "react-dnd";
import DraggableResizableCard from "./ResizableCard";

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DropZone = ({ cards, moveCard, resizeCard, deleteCard, onAddCard, onRefresh, onExport }) => {
    const [dropZoneDimensions, setDropZoneDimensions] = useState({ width: 0, height: 0 });
  // Référence pour mesurer la taille de la zone de dépôt
    const dropZoneRef = React.useRef(null);

    // Mettre à jour les dimensions de la zone de dépôt lorsque la fenêtre change

  
    const [, drop] = useDrop({
    accept: "CARD",
    drop: (item, monitor) => {
      const dropOffset = monitor.getSourceClientOffset() || { x: 0, y: 0 };
      const left = snapToGrid(dropOffset.x);
      const top = snapToGrid(dropOffset.y);

      const newCard = {
        id: cards.length + 1,
        name: item.name,
        initialLeft: left,
        initialTop: top,
        width: snapToGrid(600),
        height: snapToGrid(400),
        componentName: item.name, 
        //data: item.data || {} 
      };
      onAddCard(newCard);
    },
  });

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "800px",
        //border: "1px solid black",
        borderRadius : "1%",
        backgroundColor: "#F0F0F2",
      }}
    >
      {cards.map((card) => (
        <DraggableResizableCard
          key={card.id}
          {...card}
          id={card.id}
          onMove={moveCard}
          onResize={resizeCard}
          onDelete={deleteCard}
          onRefresh={onRefresh}
          onExport={onExport}
          data={card} // la carte est recuperée ici 
        />
      ))}
    </div>
  );
};

export default DropZone;