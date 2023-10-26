import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
  Box,
  TableContainer,
} from "@mui/material";
import { DateFormatter } from "../Date/currentDate";
import { ConsumeableContext } from "../UserContext/UserContext";
function GetCreditLists() {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [creditData, setCreditData] = useState({ data: [], dailyData: [] });
  let {
    accountRecivableAmt,
    setAccountRecivableAmt,
    collectedMoney,
    setCollectedMoney,
    accountRecivableCollected,
    setAccountRecivableCollected,
  } = ConsumeableContext();
  let getUsersCreditList = () => {
    let BusinessId = localStorage.getItem("businessId");
    axios
      .get(
        serverAddress +
          "getUsersCreditList?token=" +
          token +
          "&&businessName=" +
          businessName +
          "&&businessId=" +
          BusinessId
      )
      .then((Responces) => {
        let { dailyData, data } = Responces.data;
        console.log("dailyData", dailyData, "data ", data);
        setCreditData({ data, dailyData });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  useEffect(() => {
    getUsersCreditList();
  }, []);
  const [CollectionDate, setCollectionDate] = useState(null);
  let paymentConfirmed = (data, salesWAy) => {
    console.log(data, CollectionDate);
    // return;
    axios
      .put(serverAddress + "paymentConfirmed", {
        data,
        salesWAy,
        businessName,
        token,
        CollectionDate,
      })
      .then((Responces) => {
        getUsersCreditList();
        console.log(Responces.data.data);
        let Message = Responces.data.data;
        console.log("Message", Message);
        alert(Message);
      })
      .catch((error) => {
        alert("error no 13");
        console.log(error);
      });
  };
  const [openConfirmationModal, setOpenConfirmationModal] = useState({
    Open: false,
  });
  useEffect(() => {
    let totalMoney = 0;
    creditData.data?.map((data) => {
      console.log("creditData.data", data);
      totalMoney +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    creditData.dailyData?.map((data) => {
      console.log("creditData.dailyData", creditData.dailyData);

      totalMoney +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    setAccountRecivableAmt(totalMoney);
  }, [creditData]);

  // .length > 0 || creditData.dailyData?.length > 0 ?
  return (
    <div>
      {creditData.data?.length > 0 || creditData.dailyData?.length > 0 ? (
        <TableContainer>
          <Table sx={{ overflow: "scroll", width: "100%" }}>
            <TableHead sx={{ backgroundColor: "white" }}>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Sales Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total money</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Credit Payment Date</TableCell>
                <TableCell>Registered Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Confirm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditData.dailyData.map((data, index) => {
                return (
                  <TableRow>
                    <TableCell>{index}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.creditsalesQty}</TableCell>
                    <TableCell>{data.productsUnitPrice}</TableCell>
                    <TableCell>
                      {data.creditsalesQty * data.productsUnitPrice}
                    </TableCell>
                    <TableCell>{data.Description}</TableCell>
                    <TableCell>
                      {DateFormatter(data.creditPaymentDate)}
                    </TableCell>
                    <TableCell>
                      {DateFormatter(data.registrationDate)}
                    </TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setOpenConfirmationModal({
                            salesWAy: "singleSales",
                            Open: true,
                            data: data,
                          });
                        }}
                      >
                        Confirm Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", backgroundColor: "transparent" }}
                  colSpan={14}
                >
                  From Total sales
                </TableCell>
              </TableRow>
              {creditData.data.map((data, index) => {
                return (
                  <TableRow>
                    <TableCell>{index}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.salesQty}</TableCell>
                    <TableCell>{data.unitPrice}</TableCell>
                    <TableCell>{data.unitPrice * data.salesQty}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>{data.creditPayementdate}</TableCell>
                    <TableCell>{DateFormatter(data.registeredTime)}</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setOpenConfirmationModal({
                            salesWAy: "totalSales",
                            Open: true,
                            data: data,
                          });
                        }}
                      >
                        Confirm Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={10}>
                  Total items sold in account recivable = {accountRecivableAmt}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h1>No credit data</h1>
      )}
      <Dialog
        open={openConfirmationModal.Open}
        onClose={() => {
          setOpenConfirmationModal({ Open: false });
        }}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>When do you have recived your money?</DialogContent>
        <DialogActions>
          <form
            style={{ width: "90%", margin: "auto" }}
            onSubmit={(e) => {
              e.preventDefault();
              paymentConfirmed(
                openConfirmationModal.data,
                openConfirmationModal.salesWAy
              );
              setOpenConfirmationModal((prevstate) => {
                return { ...prevstate, Open: false };
              });
            }}
          >
            <TextField
              fullWidth
              required
              onChange={(e) => {
                setCollectionDate(e.target.value);
              }}
              type="date"
            />

            <Box sx={{ margin: "10px auto" }}>
              <Button
                onClick={() => {
                  setOpenConfirmationModal({ Open: false });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Confirm
              </Button>
            </Box>
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GetCreditLists;
