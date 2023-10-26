import React from "react";
import { saveAs } from "file-saver";
import { exportTableToPDF, exportTableToExcel } from "./exportUtils";

const TableExport = () => {
  const tableRef = React.useRef(null);

  const handleExportToPDF = () => {
    exportTableToPDF(tableRef.current, "table.pdf");
  };

  const handleExportToExcel = () => {
    exportTableToExcel(tableRef.current, "table.xlsx");
  };

  return (
    <div>
      <h1>Table Export Example</h1>
      <table ref={tableRef}>{/* Your table content goes here */}</table>
      <button onClick={handleExportToPDF}>Export to PDF</button>
      <button onClick={handleExportToExcel}>Export to Excel</button>
    </div>
  );
};

export default TableExport;
