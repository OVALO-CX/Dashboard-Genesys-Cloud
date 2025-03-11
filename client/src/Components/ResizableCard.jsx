import React, { useRef, useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Card, CardContent, Typography } from "@mui/joy";
import { ExportButton, RefreshButton, DeleteButton, ResizeButton } from "./IconButton";
import GetUserTable from '../UserTable'; // Import your component here
//import AuthToken from '../AuthToken';

const GRID_SIZE = 20;

const snapToGrid = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const DraggableResizableCard = ({ id, initialLeft, initialTop, width, height, 
  onMove, onResize, onDelete, onRefresh, onExport, data, token }) => {

    //const [token, setToken] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardWidth, setCardWidth] = useState(width);
    const [cardHeight, setCardHeight] = useState(height);
    const [isFirstCard, setIsFirstCard] = useState(false);

    const resizingRef = useRef(false);
    const positionRef = useRef({ left: initialLeft, top: initialTop });
    const [fontSize, setFontSize] = useState(16);

    // Etat pour stocker les données récupérées
    const [ tableData, setTableData ] = useState([]);
    //const [ tableColumns, setTableColumns ] = useState([]);
    //const [ visibleColumns, setVisibleColumns ] = useState([]);

  const [, drag] = useDrag({
    type: "CARD",
    item: { id },
    canDrag: () => !resizingRef.current,
  });

  useEffect(() => {
    // Set the first card position at top left corner
    if (isFirstCard) {
      positionRef.current.left = 0;
      positionRef.current.top = 0;
      onMove(id, 0, 0);
    }
  }, [isFirstCard]);


  // Function to receive the token
  /*const handleTokenReceived = ({access_token, token_expiry}) => {
    setToken(access_token);
    setExpiryDate(token_expiry);
  };*/

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

      setCardWidth(newWidth);
      setCardHeight(newHeight);
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
    setFontSize(newFontSize); // Update the local font size
  };

 /* //Fonction pour recevoir les données de GetUserTable
  const handleDataReceived = (data, columns) => {
    console.log("📊 Données reçues dans ResizableCard :", data);
    setTableData(data);
    setTableColumns(columns);
    setVisibleColumns(columns);
  } 
    */
     // 🔹 Fonction pour recevoir les données complètes
    const handleDataReceived = (receivedData) => {
      console.log("📥 Données reçues dans ResizableCard:", receivedData);
      setTableData(receivedData);
    };

    useEffect(() => {
      console.log("📊 Données mises à jour dans ResizableCard:", tableData);
    }, [tableData]);


/*      // 🔹 Vérification que `tableData` est bien mis à jour
      useEffect(() => {
        console.log("📊 Données mises à jour dans ResizableCard:", tableData);
        console.log("📊 Colonnes visibles mises à jour dans ResizableCard:", visibleColumns);
      }, [tableData, visibleColumns]);
*/
    // 🔹 Fonction pour recevoir les données et colonnes visibles
    /*
    const handleDataReceived = (receivedData, receivedColumns) => {
      console.log("📥 Données reçues dans ResizableCard:", receivedData);
      console.log("📥 Colonnes visibles reçues dans ResizableCard:", receivedColumns);
      
      if (receivedColumns.length > 0) { // 🔥 Vérifier si les colonnes ne sont pas vides
        setTableData(receivedData);
        setVisibleColumns(receivedColumns);
      } else {
        console.warn("⚠️ Aucune colonne visible reçue, les données ne seront pas exportées.");
      }
    };
    */

    /*
    useEffect(() => {
      console.log("📊 Données mises à jour dans ResizableCard:", tableData);
      console.log("📊 Colonnes visibles mises à jour dans ResizableCard:", visibleColumns);
    }, [tableData, visibleColumns]);
    */


  // Dynamically select the component to render based on the card data
  const renderComponent = () => {
    if (!data || !data.componentName) 
      return <Typography level="body1">No data provided</Typography>;
    
    switch (data.componentName) {
      case 'User Table':
        return (
        <>
          {/*<AuthToken onTokenReceived={handleTokenReceived} />*/}
          <div style={{ 
            overflow: "auto", 
            maxWidth: "100%", 
            maxHeight: "calc(50% - 80px)" 
          }}>
            
          {/*<GetUserTable data={data} token={token} expiryDate={expiryDate} fontSize={fontSize} onDataReceived={handleDataReceived}/>;*/}
          <GetUserTable data={data} token={token} expiryDate={expiryDate} fontSize={fontSize} onDataReceived={handleDataReceived}/>;
          </div>
        </>
        );
      case 'User PieChart':
        return <Typography level="body1">le contenu du PieChart</Typography>;
      case 'User Data2':
        return <Typography level="body1">le contenu du User Data2</Typography>;
      case 'User Data3':
        return <Typography level="body1">le contenu du User Data3</Typography>;

        // Add other cases here for other components
      default:
        return <Typography level="body1">No component found</Typography>;
    }
  };

  return (
    <div
      ref={drag}
      onMouseDown={handleMouseDownDrag}
      style={{
        position: "absolute",
        left: positionRef.current.left,
        top: positionRef.current.top,
        width: cardWidth,
        height: cardHeight,
        cursor: "grab",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between", fontSize: `${fontSize}px`, }}>
          <Typography level="h6">{data?.name || `Card ${id}`}</Typography>

        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "flex-start", flexDirection: "row", }}>
          <ExportButton data={tableData} />          
          {/*<ExportButton onClick={() => onExport(id)}/>*/}
          {/*<ExportButton data={tableData} columns={tableColumns} />*/}
          {/*<ExportButton data={tableData} columns={visibleColumns} />*/}
          <RefreshButton onClick={() => onRefresh(id)} />
          <ResizeButton onResize={handleResizeFont} />
          <DeleteButton onClick={() => onDelete(id)} />
        </div>

        <div style={{}}>
          {renderComponent()}
        </div>
        </CardContent>
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

export default DraggableResizableCard;