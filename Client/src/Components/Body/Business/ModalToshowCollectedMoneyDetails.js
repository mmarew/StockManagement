import React, { useState } from "react";
import { ConsumeableContext } from "../UserContext/UserContext";
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DateFormatter } from "../Date/currentDate";
import CurrencyFormatter from "../../utility/Utility";

function ModalToshowCollectedMoneyDetails({
  setShowMoneyDetailModal,
  ShowMoneyDetailModal,
}) {
  let { collectedMoney } = ConsumeableContext();
  let { Detail } = collectedMoney;
  console.log("collectedMoney", collectedMoney);
  const handleOpen = () => {
    setShowMoneyDetailModal(true);
  };

  const handleClose = () => {
    setShowMoneyDetailModal(false);
  };

  return (
    <div>
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={ShowMoneyDetailModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            // backgroundColor: "white",
            // padding: "40px",
            // borderRadius: "10px",
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            // justifyContent: "center",
            // maxWidth: "90%",
            // maxHeight: "80vh", // Set a maximum height for the modal content
            // overflow: "auto", // Enable scrolling when content overflows
          }}
        >
          <h2 id="modal-title">Details of collected money</h2>
          <Box id="modal-description">
            {console.log(collectedMoney.Detail)}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Sales Qty</TableCell>
                    <TableCell align="right">Collected amount</TableCell>{" "}
                    <TableCell align="right">Sales date</TableCell>
                    <TableCell align="right">Collection date</TableCell>
                    <TableCell align="right">Sales Way</TableCell>{" "}
                    <TableCell align="right">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Detail.map((product, index) => (
                    <TableRow key={"DetailesOfModal_" + index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell align="right">
                        {CurrencyFormatter(product.productsUnitPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {product.creditsalesQty}
                      </TableCell>
                      <TableCell align="right">
                        {CurrencyFormatter(product.collectionAmount)}
                      </TableCell>
                      {product.registrationSource == "Total" ? (
                        <TableCell>
                          {DateFormatter(product.registeredTime)}
                        </TableCell>
                      ) : (
                        <TableCell>
                          {DateFormatter(product.registeredTimeDaily)}
                        </TableCell>
                      )}

                      <TableCell>
                        {DateFormatter(product.collectionDate)}
                      </TableCell>
                      <TableCell align="right">
                        {product.registrationSource}
                      </TableCell>
                      <TableCell>{product.Description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
export default ModalToshowCollectedMoneyDetails;
