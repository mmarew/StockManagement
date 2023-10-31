import axios from "axios";
import "./GetMinimumQty.css";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Chip } from "@material-ui/core";
function GetMinimumQty() {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [MinimumQty, setMinimumQty] = useState({ progress: "wait" });

  async function getQtyFromServer() {
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "GetMinimumQty/", {
      token,
      businessName,
    });
    $(".LinearProgress").css("display", "none");
    console.log("getQtyFromServer == ", responce);
    let data = responce.data.data;
    setMinimumQty({ ...MinimumQty, progress: "done", data });

    // if (data.length == 0) {
    //   alert("you havent transaction data");
    // }
  }
  useEffect(() => {
    getQtyFromServer();
  }, []);

  return (
    <div>
      <br />
      <h5>Current Minimum Qty</h5>
      {MinimumQty.progress == "wait" ? (
        <h4>please wait ...</h4>
      ) : MinimumQty.data.length > 0 ? (
        <TableContainer component={Paper} align="center">
          {console.log("MinimumQty", MinimumQty?.data?.length)}
          <Table sx={{ width: 100 + "%" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  Current Inventory List{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center"> Inventory</TableCell>
                <TableCell align="center"> Minimum qty</TableCell>
                <TableCell align="center"> Status</TableCell>
              </TableRow>
            </TableHead>
            {MinimumQty?.data?.map((item, index) => {
              console.log(item);
              return (
                <TableRow key={"minimum_" + index}>
                  <TableCell align="center">{item.productName}</TableCell>
                  <TableCell align="center">{item.Inventory}</TableCell>
                  <TableCell align="center">{item.minimumQty}</TableCell>
                  <TableCell align="center">
                    {item.Inventory > item.minimumQty ? (
                      <Chip
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          fontWeight: 600,
                        }}
                        label="GOOD"
                        color="success"
                        variant="contained"
                      />
                    ) : (
                      <Chip
                        label="TOO LOW"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </TableContainer>
      ) : (
        "You haven't registered any transaction to view minimum qty"
      )}
    </div>
  );
}

export default GetMinimumQty;
