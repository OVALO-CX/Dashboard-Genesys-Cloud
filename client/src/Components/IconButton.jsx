import React, { useState } from "react"
import {IconButton, Slider} from "@mui/material";
import {  Close as CloseIcon, Refresh as RefreshIcon, Download as DownloadIcon, FormatSize as FormatSizeIcon } from "@mui/icons-material";

import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const CustomIconButton =({ onClick, color = "gray", icon: Icon }) => {
return (
    <IconButton
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onClick(event);
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

 
  
export const ExportButton = ({ data, columns }) => { 

    const [anchorEl, setAnchorEl] = useState(null);
    console.log("📦 Données reçues dans ExportButton :", data);
    console.log("📦 Colonnes visibles reçues dans ExportButton:", columns);

    // 🔹 Ouvrir le menu
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    // 🔹 Fermer le menu
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    // 🔹 Exporter en JSON
    const exportJSON = () => {
      console.log("📦 Données reçues dans ExportButton  (exportJSON):", data);
      const jsonString = JSON.stringify(data, null, 2);
      console.log("📦 JSON String dans ExportButton :", jsonString);
      const blob = new Blob([jsonString], { type: "application/json" });
      saveAs(blob, "table_data.json");
      handleClose();
    };
  
    // 🔹 Exporter en CSV
    const exportCSV = () => {
      //if (!data.length || !columns.length) {
        if (!data.length) {
        console.warn("⚠️ Aucune donnée ou colonne à exporter !");
        return; 
      }

      const header = Object.keys(data[0]).join(",");
      //const header = columns.map((col) => col.header).join(",");
      const csvRows = data.map((row) =>
        Object.values(row).join(",")
        //columns.map((col) => row[col.accessorKey] || "").join(",")
      );
      const csvContent = [header, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "table_data.csv");
      handleClose();
    };
  
    // 🔹 Exporter en PDF
    const exportPDF = () => {

      if (!data.length) {
        console.warn("Aucune donnée à exporter !");
        return;
      }
      const doc = new jsPDF({orientation:'l'});
      doc.text("Tableau Exporté", 10, 10);
  
      // Récupérer les clés des objets (colonnes dynamiques)
      const tableHeaders = [Object.keys(data[0])];
      const tableData = data.map((row) =>
        Object.values(row)
      );
      /*const tableData = data.map((row) =>
        columns.map((col) => row[col.accessorKey] || "")
      );
      const tableHeaders = [columns.map((col) => col.header)];
  */
      autoTable(doc, {
        head: tableHeaders,
        body: tableData,
        startY: 20,
      });
  
      doc.save("table_data.pdf");
      handleClose();
    };
  
    return (
      <div>
        {/* Icône d'export avec tooltip */}
        <Tooltip title="Exporter les données">
          <CustomIconButton onClick={(event) => handleClick(event)} icon={DownloadIcon} />
          {/*<IconButton onClick={handleClick} color="primary">
            <FileDownloadIcon />
          </IconButton>*/}
        </Tooltip>
  
        {/* Menu déroulant */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={exportJSON}>Exporter en JSON</MenuItem>
          <MenuItem onClick={exportCSV}>Exporter en CSV</MenuItem>
          <MenuItem onClick={exportPDF}>Exporter en PDF</MenuItem>
        </Menu>
      </div>
    );
  };

  
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
   
