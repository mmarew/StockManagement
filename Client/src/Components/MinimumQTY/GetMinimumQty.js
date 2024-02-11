import axios from "axios";
import "./GetMinimumQty.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { ConsumeableContext } from "../Body/UserContext/UserContext";

function GetMinimumQty({ viewInTable, setFetchedDataLength }) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [MinimumQty, setMinimumQty] = useState({ progress: "wait", data: [] });

  let { setShowProgressBar, setProccessing } = ConsumeableContext();

  async function getQtyFromServer() {
    setShowProgressBar(true);
    let response = await axios.post(serverAddress + "GetMinimumQty/", {
      token,
      businessName,
      businessId,
    });
    setShowProgressBar(false);
    console.log("res from GetMinimumQty == ", response);
    let { data } = response.data;

    if (data === `you are not owner of this business`) {
      alert(data);
      data = [];
    }
    setFetchedDataLength(data.length);
    setMinimumQty({ ...MinimumQty, progress: "done", data });
  }

  useEffect(() => {
    getQtyFromServer();
  }, []);

  return (
    <div>
      <br />
      <h5 style={{ textAlign: "center" }}>Current Minimum Qty and Inventory</h5>
      {console.log("MinimumQty111", MinimumQty)}
      {MinimumQty.progress === "wait" ? (
        <h4>Please wait...</h4>
      ) : MinimumQty?.data?.length > 0 ? (
        <>
          {viewInTable ? (
            <Box style={{ padding: "10px" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Product&nbsp;&nbsp;&nbsp;Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Inventory</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Minimum&nbsp;&nbsp;Qty</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MinimumQty?.data?.map((item, index) => (
                      <TableRow key={"minimum_" + index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.inventoryItem}</TableCell>
                        <TableCell>{item.minimumQty}</TableCell>
                        <TableCell>
                          {item.inventoryItem > item.minimumQty ? (
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <TableContainer align="center">
              {console.log("MinimumQty", MinimumQty?.data?.length)}
              <Table sx={{ width: "100%" }}>
                <TableBody
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  {MinimumQty?.data?.map((item, index) => {
                    console.log(item);

                    return (
                      <TableRow
                        sx={{
                          padding: "10px ",
                          margin: "4px 10px",
                          width: "280px",
                        }}
                        component={Paper}
                        key={"minimum_" + index}
                      >
                        <TableCell>
                          <div>
                            <strong>Product Name:</strong> {item.productName}
                          </div>
                          <div>
                            <strong>Inventory:</strong> {item.inventoryItem}
                          </div>
                          <div>
                            <strong>Minimum Qty:</strong> {item.minimumQty}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            {item.inventoryItem > item.minimumQty ? (
                              <Chip
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  fontWeight: 600,
                                }}
                                label="GOOD"
                                color="primary"
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <div>
          <p>You haven't registered any transactions.</p>
          <p>To view minimum quantity, please register some transactions.</p>
        </div>
      )}
    </div>
  );
}
export default GetMinimumQty;
