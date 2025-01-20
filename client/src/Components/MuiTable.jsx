import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const CustomTable = ({ data, titles }) => {
  // should be memoized or stable
  const columns = useMemo(
    () =>
      titles.map(title => ({
        accessorKey: title.accessorKey,
        header: title.header,
        size: title.size,
      })),
    [titles]
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

  const table = useMaterialReactTable({
    columns,
    data: tableData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default CustomTable;
