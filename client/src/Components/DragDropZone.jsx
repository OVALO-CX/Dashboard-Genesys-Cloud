import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, Typography, Button } from "@mui/joy";
import { ExportButton, RefreshButton, DeleteButton, ResizeButton } from "./IconButton";


const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableResizableCard = ({ id, initialLeft, initialTop, width, height, 
  onMove, onResize, onDelete, onRefresh, onExport, data }) => {


  const resizingRef = useRef(false);
  const positionRef = useRef({ left: initialLeft, top: initialTop });
  const [fontSize, setFontSize] = useState(16);
  const [showSlider, setShowSlider] = useState(false);

  const [, drag] = useDrag({
    type: "CARD",
    item: { id },
    canDrag: () => !resizingRef.current,
  });
  

  const handleMouseDownResize = (event) => {
    event.stopPropagation();
    resizingRef.current = true;

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = width;
    const startHeight = height;

    const handleMouseMove = (moveEvent) => {
      const newWidth = snapToGrid(startWidth + moveEvent.clientX - startX);
      const newHeight = snapToGrid(startHeight + moveEvent.clientY - startY);
      onResize(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      resizingRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDownDrag = (event) => {
    if (resizingRef.current) return;
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = positionRef.current.left;
    const startTop = positionRef.current.top;

    const handleMouseMove = (moveEvent) => {
      const newLeft = snapToGrid(startLeft + (moveEvent.clientX - startX));
      const newTop = snapToGrid(startTop + (moveEvent.clientY - startY));
      positionRef.current = { left: newLeft, top: newTop };
      onMove(id, newLeft, newTop);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeFont = (newFontSize) => {
    setFontSize(newFontSize); // Met à jour la taille locale
  };

  return (
    <div
      ref={drag}
      onMouseDown={handleMouseDownDrag}
      style={{
        position: "absolute",
        left: positionRef.current.left,
        top: positionRef.current.top,
        width,
        height,
        cursor: "grab",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          height: "100%",
          p: 2,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between", fontSize: `${fontSize}px`, }}>
        <Typography level="h6">{data?.name || `Card ${id}`}</Typography>

        </CardContent>
        <div style={{position: "absolute", top:0, right:0, display:"flex", alignItems: "flex-start", flexDirection: "row",}}>

        <ExportButton onClick={() => onExport(id)} />
        <RefreshButton onClick={() => onRefresh(id)} />
        <ResizeButton onResize={handleResizeFont} />
        <DeleteButton onClick={() => onDelete(id)} />
        
      
     
        </div>
        
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "15px",
            height: "15px",
            cursor: "nwse-resize",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
          onMouseDown={handleMouseDownResize}
        />
      </Card>
    </div>
  );
};

const DropZone = ({ cards, moveCard, resizeCard, deleteCard, 
  onAddCard, onRefresh, onExport, data }) => {
  const [, drop] = useDrop({ 
    accept: "CARD" ,
    drop: (item, monitor) => {
        console.log('item bien deposé', item);
        if (monitor) {
          const dropOffset = monitor.getSourceClientOffset() || { x: 0, y: 0 };
          const left = snapToGrid(dropOffset.x);
          const top = snapToGrid(dropOffset.y);
  
          // Ajout d'une nouvelle carte dans la liste
          const newCard = {
            id: cards.length + 1,
            name: item.name, // Le nom vient de DraggableItem
            initialLeft: left,
            initialTop: top,
            width: snapToGrid(150), // Largeur par défaut
            height: snapToGrid(100), // Hauteur par défaut
            data: data // Ajout des données à la carte
          };
          onAddCard(newCard); // ✅ Utilisation du callback
        }
      },
});

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        border: "1px solid black",
        backgroundColor: "#F0F0F2",
      }}
    >
      {cards.map((card) => (
        <DraggableResizableCard
          key={card.id}
          {...card}
          onMove={moveCard}
          onResize={resizeCard}
          onDelete={deleteCard}
          onRefresh={onRefresh} // Pass the refresh function
          onExport={onExport} // Pass the export function
          data={card.data} // Passer les données associées à la carte
        />
      ))}
    </div>
  );
};

export default DropZone;