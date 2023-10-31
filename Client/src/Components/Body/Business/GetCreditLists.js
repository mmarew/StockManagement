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
function GetCreditLists({ dateRange }) {
  let {
    accountRecivableAmt,
    setAccountRecivableAmt,
    unTimeRecivableCollected,
    setunTimeRecivableCollected,
    collectedMoney,
    setCollectedMoney,
  } = ConsumeableContext();
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [creditData, setCreditData] = useState({
    soldOnTotal_Oncredit: [],
    soldInDaily_SoldOncredits: [],
    soldInDaily_CreditPaied_maynotInTime: [],
    soldInDaily_CreditPaied: [],
  });

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
          BusinessId +
          "&&fromDate=" +
          dateRange.fromDate +
          "&&toDate=" +
          dateRange.toDate
      )
      .then((Responces) => {
        let {
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
        } = Responces.data;
        console.log("Responces.data = ", Responces.data);
        // 1 sold on credit we call it account recivable status on credit,,
        // 2 sold on credit and we have collected money in date range or not credit paied but selected in registrationtime range,
        // 3 sold on credit and we have collected money in time and selection is by credit payment date
        // console.log("dailyData", dailyData, "data ", data);
        setCreditData({
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
        });
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
    let {
      soldInDaily_SoldOncredits,
      soldOnTotal_Oncredit,
      soldInDaily_CreditPaied_maynotInTime,
      soldInDaily_CreditPaied,
    } = creditData;
    let totalMoney = 0;
    soldOnTotal_Oncredit?.map((data) => {
      totalMoney +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    soldInDaily_SoldOncredits?.map((data) => {
      totalMoney +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    setAccountRecivableAmt(totalMoney);
    let monyeCollectedInUnKnownTime = 0;
    soldInDaily_CreditPaied_maynotInTime?.map((data) => {
      monyeCollectedInUnKnownTime +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    console.log("monyeCollectedInUnKnownTime", monyeCollectedInUnKnownTime);
    setunTimeRecivableCollected(monyeCollectedInUnKnownTime);
    let accountRecivedMoney = 0;
    soldInDaily_CreditPaied?.map((data, index) => {
      accountRecivedMoney +=
        Number(data.creditsalesQty) * Number(data.productsUnitPrice);
    });
    setCollectedMoney(accountRecivedMoney);
  }, [creditData]);
  return (
    <div>
      <br />
      {creditData.soldOnTotal_Oncredit?.length > 0 ||
      creditData.soldInDaily_SoldOncredits?.length > 0 ? (
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
              {creditData.soldInDaily_SoldOncredits?.map((data, index) => {
                return (
                  <TableRow key={"indexOfGetData" + index}>
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
              {creditData.soldOnTotal_Oncredit?.map((data, index) => {
                return (
                  <TableRow>
                    <TableCell>{index}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.creditsalesQty}</TableCell>
                    <TableCell>{data.unitPrice}</TableCell>
                    <TableCell>
                      {data.unitPrice * (data.salesQty + data.creditsalesQty)}
                    </TableCell>
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
        <h1 style={{ margin: "10px" }}>No credit data</h1>
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
