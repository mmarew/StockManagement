import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Button } from "@mui/material";
import { DateFormatter } from "../Body/Date/currentDate";

function MyComponent() {
  const [businesses, setBusinesses] = useState([]);
  let serverAddress = localStorage.getItem("targetUrl");
  useEffect(() => {
    axios
      .get(serverAddress + "admin/get__businesses") // Replace '/api/businesses' with your actual API endpoint
      .then((response) => {
        setBusinesses(response.data.data);
      })
      .catch((error) => {});
  }, []);
  const getBusinessTransactions = async (business) => {
    try {
      const response = await axios.get(
        serverAddress + "getBusinessTransactions",
        {
          params: {
            business: business,
          },
        }
      );
      // Handle the response data here
    } catch (error) {
      // Handle any errors here
    }
  };
  return (
    <div>
      <Table>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Business Name</TableCell>
          <TableCell>Created Date</TableCell>
          <TableCell>Detail</TableCell>
        </TableRow>
        {businesses.map((business, index) => (
          <TableRow key={"Business_" + index}>
            <TableCell>{index}</TableCell>
            <TableCell>{business.employeeName}</TableCell>
            <TableCell>{business.BusinessName}</TableCell>
            <TableCell>{DateFormatter(business.createdDate)}</TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  getBusinessTransactions(business);
                }}
              >
                View Detailes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
export default MyComponent;
