import React, { useState } from "react"
import {IconButton, Slider} from "@mui/material";
import {  Close as CloseIcon, Refresh as RefreshIcon, Download as DownloadIcon, FormatSize as FormatSizeIcon } from "@mui/icons-material";


const CustomIconButton =({ onClick, color = "gray", icon: Icon }) => {
return (
    <IconButton
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      sx={{
        minWidth: "24px",
        height: "24px",
        borderRadius: "25%",
        display: "flex",
        alignItems: "center",
        padding: 0,
      }}
      color={color}
      variant="soft"
    >
      <Icon fontSize="small" />
    </IconButton>
);

};

export const ExportButton = ({ onClick }) => (
    <CustomIconButton onClick={onClick} icon={DownloadIcon} />
  );
  
export const RefreshButton = ({ onClick }) => (
    <CustomIconButton onClick={onClick} icon={RefreshIcon} />
  );
  
export const DeleteButton = ({ onClick }) => (
    <CustomIconButton onClick={onClick} icon={CloseIcon} />
  );

export const ResizeButton = ({ onResize }) => {
    const [showSlider, setShowSlider] = useState(false);
    const [fontSize, setFontSize] = useState(16);
  
    const handleResizeClick = () => {
      setShowSlider(!showSlider);
    };
  
    const handleFontSizeChange = (e, newValue) => {
      setFontSize(newValue);
      if (onResize) {
        onResize(newValue); // Appelle la fonction passée en prop avec la nouvelle taille
      }
    };

  return (
    <div style={{ position: "relative" }}>
      {/* Bouton principal */}
      <CustomIconButton onClick={handleResizeClick} icon={FormatSizeIcon} />

      {/* Slider pour ajuster la taille */}
      {showSlider && (
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 0,
            background: "white",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
          onMouseDown={(e) => e.stopPropagation()} // Empêche la fermeture accidentelle
        >
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange} // Met à jour la taille de la police
            min={10}
            max={30}
            step={1}
            size="small"
            sx={{ width: 100 }}
          />
        </div>
      )}
    </div>
  );

}
   
