import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  colors,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { DateFormatter } from "../Date/currentDate";

function CheckIfUnreportedData() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [unreportedData, setUnreportedData] = useState([]);

  let BusinessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");

  let getUnreportedDataToTotalSales = async () => {
    let results = await axios.post(serverAddress + "CheckIfUnreportedData", {
      BusinessId,
      businessName,
    });
    console.log("results CheckIfUnreportedData", results.data.data);
    setUnreportedData(results.data.data);
  };

  useEffect(() => {
    getUnreportedDataToTotalSales();
  }, []);

  return (
    <div>
      {unreportedData?.length > 0 && (
        <TableContainer>
          <h6 style={{ color: "red" }}>
            You have unreported data in your daily sales journal. please report
            it first
          </h6>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Sales Quantity</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unreportedData?.map((data) => (
                <TableRow key={data.dailySalesId}>
                  <TableCell>
                    {JSON.parse(data.itemDetailInfo).productName}
                  </TableCell>
                  <TableCell> {DateFormatter(data.registrationDate)}</TableCell>
                  <TableCell>
                    {JSON.parse(data.itemDetailInfo).productsUnitPrice}
                  </TableCell>
                  <TableCell>{data.purchaseQty}</TableCell>
                  <TableCell>{data.Description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default CheckIfUnreportedData;
