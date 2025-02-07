import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, Typography, Button } from "@mui/joy";
import {  Close as CloseIcon, Refresh as RefreshIcon, Download as DownloadIcon } from "@mui/icons-material";
import {IconButton} from "@mui/material";

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableResizableCard = ({ id, initialLeft, initialTop, width, height, onMove, onResize, onDelete, onRefresh, onExport }) => {
  const resizingRef = useRef(false);
  const positionRef = useRef({ left: initialLeft, top: initialTop });

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
          <Typography level="h6">Card {id}</Typography>
        </CardContent>
        <div style={{position: "absolute", top:0, right:0, display:"flex", alignItems: "flex-start", flexDirection: "row",}}>
        <IconButton
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onExport(id);
          }}
          sx={{
            minWidth: "24px",
            height: "24px",
            borderRadius: "25%",
            display: "flex",
            alignItems: "center",
            //justifyContent: "center",
            padding: 0,
          }}
          color="gray"
          variant="soft"
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
        <IconButton
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onRefresh(id);
          }}
          sx={{
            minWidth: "24px",
            height: "24px",
            borderRadius: "25%",
            display: "flex",
            alignItems: "center",
            //justifyContent: "center",
            padding: 0,
          }}
          color="gray"
          variant="soft"
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
        <IconButton
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
            sx={{
              minWidth: "24px",
              height: "24px",
              borderRadius: "25%",
              display: "flex",
              alignItems: "center",
              //justifyContent: "center",
              padding: 0,
            }}
            color="gray"
            variant="soft"
          >
            <CloseIcon fontSize="small" />
        </IconButton>
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

const DropZone = ({ cards, moveCard, resizeCard, deleteCard, onAddCard, onRefresh, onExport }) => {
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
        />
      ))}
    </div>
  );
};

export default DropZone;