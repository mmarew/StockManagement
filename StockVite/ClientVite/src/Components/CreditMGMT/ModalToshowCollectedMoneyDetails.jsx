import React, { useState } from "react";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
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
import { DateFormatter } from "../Body/Date/currentDate";
import CurrencyFormatter from "../Utilities/Utility";

function ModalToshowCollectedMoneyDetails({
  setShowMoneyDetailModal,
  ShowMoneyDetailModal,
}) {
  let { collectedMoney } = ConsumeableContext();
  let { Detail } = collectedMoney;
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "90%",
            maxHeight: "80vh", // Set a maximum height for the modal content
            overflow: "auto", // Enable scrolling when content overflows
          }}
        >
          <h2 id="modal-title">Details of collected money</h2>
          <Box id="modal-description">
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="left">Unit Price</TableCell>
                    <TableCell align="left">Sales Qty</TableCell>
                    <TableCell align="left">Collected amount</TableCell>{" "}
                    <TableCell align="left">Sales date</TableCell>
                    <TableCell align="left">Collection date</TableCell>
                    <TableCell align="left">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Detail.map((product, index) => (
                    <TableRow key={"DetailesOfModal_" + index}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell align="left">
                        {CurrencyFormatter(product.productsUnitPrice)}
                      </TableCell>
                      <TableCell align="left">
                        {product.creditsalesQty}
                      </TableCell>
                      <TableCell align="left">
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
