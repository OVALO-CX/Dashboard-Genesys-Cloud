import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, Typography, Button} from "@mui/joy";
import { Slider } from "@mui/material";
import {  Close as CloseIcon, Refresh as RefreshIcon, Download as DownloadIcon, FormatSize as FormatSizeIcon } from "@mui/icons-material";
import {IconButton} from "@mui/material";

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableResizableCard = ({ id, initialLeft, initialTop, width, height, onMove, onResize, onDelete, onRefresh, onExport, token }) => {
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
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography level="h6" sx={{ fontSize: `${fontSize}px` }}>
          Card {id}
        </Typography>
      </CardContent>

      {/* Zone d'icônes */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <IconButton onMouseDown={(e) => e.stopPropagation()} onClick={() => onExport(id)} color="gray" variant="soft">
          <DownloadIcon fontSize="small" />
        </IconButton>

        <IconButton onMouseDown={(e) => e.stopPropagation()} onClick={() => onRefresh(id)} color="gray" variant="soft">
          <RefreshIcon fontSize="small" />
        </IconButton>

        <IconButton onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowSlider(!showSlider)} color="gray" variant="soft">
          <FormatSizeIcon fontSize="small" />
        </IconButton>

        <IconButton onMouseDown={(e) => e.stopPropagation()} onClick={() => onDelete(id)} color="gray" variant="soft">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Slider de taille de police */}
      {showSlider && (
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 10,
            background: "white",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Slider
            value={fontSize}
            onChange={(e, newValue) => setFontSize(newValue)}
            min={10}
            max={30}
            step={1}
            size="small"
            sx={{ width: 100 }}
          />
        </div>
      )}
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

const DropZone = ({ cards, moveCard, resizeCard, deleteCard, onAddCard, onRefresh, onExport, token }) => {
  const [, drop] = useDrop({ 
    accept: "CARD" ,
    drop: (item, monitor) => {
        console.log('item bien deposé');
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
          token={token}
        />
      ))}
    </div>
  );
};

export default DropZone;