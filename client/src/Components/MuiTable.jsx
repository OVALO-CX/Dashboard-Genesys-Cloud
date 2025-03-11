import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useAuth } from '../context/AuthProvider';

//const CustomTable = ({ data, titles, fontSize, token }) => {
const CustomTable = ({ data, titles, fontSize, token, onColumnVisibilityChange }) => {
    
  
  //const [visibleColumns, setVisibleColumns] = useState(titles.reduce((acc, col) => ({ ...acc, [col.accessorKey]: true }), {}) );

  const { token: AuthToken }  = useAuth();
  const finalToken = token || AuthToken;

  console.log("📡 Token reçu dans MuiTable :", token);
  console.log("🔑 Token utilisé dans MuiTable :", finalToken);

  console.log("Token : ", token);
  // should be memoized or stable
  const columns = useMemo(
    () =>
      titles.map(title => ({
        accessorKey: title.accessorKey,
        header: title.header,
        size: title.size,
        muiTableBodyCellProps: {
          sx: { fontSize: `${fontSize}px` }, // 🖌️ Appliquer la taille de police
        },
        muiTableHeadCellProps: {
          sx: { fontSize: `${fontSize + 2}px`, fontWeight: 'bold' },
        },
        flexGrow: 1,
      })),
    [titles, fontSize]
  );

  const tableData = useMemo(
    () =>
      data.map(row =>
        columns.reduce((acc, column) => {
          acc[column.accessorKey] = row[column.accessorKey];
          return acc;
        }, {})
      ),
    [data, columns]
  );

    // 🔹 Mettre à jour les colonnes visibles lorsqu'un changement se produit
    /*useEffect(() => {
      const filteredColumns = titles.filter((col) => visibleColumns[col.accessorKey]);
      if (JSON.stringify(filteredColumns) !== JSON.stringify(titles))
      onColumnVisibilityChange(filteredColumns);
    }, [visibleColumns, titles, onColumnVisibilityChange]);
  */


  const table = useMaterialReactTable({
    columns,
    data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  /*return <MaterialReactTable table={table} token={finalToken} columns={titles} data={data} state={{ columnVisibility: visibleColumns}}
      onColumnVisibilityChange={ setVisibleColumns } //mettre a jour l'état des colonnes visibles
      enableColumnResizing // 🛠️ Permet à l'utilisateur de redimensionner les colonnes
      muiTableBodyRowProps={{
      sx: { height: `${Math.max(fontSize * 2, 25)}px` }, // 🔥 Hauteur dynamique des lignes
     }}
  />;
  */
  return <MaterialReactTable table={table} token={finalToken} columns={titles} data={data} 
      enableColumnResizing // 🛠️ Permet à l'utilisateur de redimensionner les colonnes
      muiTableBodyRowProps={{
      sx: { height: `${Math.max(fontSize * 2, 25)}px` }, // 🔥 Hauteur dynamique des lignes
     }}
  />;


/*// 🔹 Mettre à jour les colonnes visibles lorsqu'un changement se produit
  useEffect(() => {
    const filteredColumns = titles.filter((col) => visibleColumns[col.accessorKey]);
    onColumnVisibilityChange(filteredColumns); // ✅ Envoi des colonnes visibles à `UserTable.js`
  }, [visibleColumns, titles, onColumnVisibilityChange]);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    state: { columnVisibility: visibleColumns },
    onColumnVisibilityChange: setVisibleColumns, // ✅ Mise à jour de l'état
    enableColumnResizing: true, // 🛠️ Permet à l'utilisateur de redimensionner les colonnes
    muiTableBodyRowProps: {
      sx: { height: `${Math.max(fontSize * 2, 25)}px` }, // 🔥 Hauteur dynamique des lignes
    },
  });

  return <MaterialReactTable table={table} 
  enableColumnResizing // 🛠️ Permet à l'utilisateur de redimensionner les colonnes
  muiTableBodyRowProps={{
  sx: { height: `${Math.max(fontSize * 2, 25)}px` }, // 🔥 Hauteur dynamique des lignes
 }}
/>;*/

};

export default CustomTable;
