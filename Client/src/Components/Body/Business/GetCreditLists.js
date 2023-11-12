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
import CurrencyFormatter, { ButtonProcessing } from "../../utility/Utility";
import GetCreditListEdit from "./GetCreditListEdit";
function GetCreditLists({ dateRange }) {
  const [Processing, setProcessing] = useState(false);
  let { fromDate, toDate } = dateRange;
  let {
    setAccountRecivableAmt,
    setCollectedMoney,
    collectedMoney,
    accountRecivableAmt,
  } = ConsumeableContext();
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [creditData, setCreditData] = useState({
    soldOnTotal_Oncredit: [],
    soldInDaily_SoldOncredits: [],
    soldInDaily_CreditPaied_maynotInTime: [],
    soldInDaily_CreditPaied: [],
    partiallyPaidInTotal: [],
  });

  let getUsersCreditList = () => {
    let BusinessId = localStorage.getItem("businessId");
    console.log("dateRange", dateRange);
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
          partiallyPaidInTotal,
          partiallyPaidInDailyNotInRegisteredDate,
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
        } = Responces.data;
        console.log("@getUsersCreditList Responces.data = ", Responces.data);
        // return;
        // 1 sold on credit we call it account recivable status on credit,,
        // 2 sold on credit and we have collected money in date range or not credit paied but selected in registrationtime range,
        // 3 sold on credit and we have collected money in time and selection is by credit payment date
        // console.log("dailyData", dailyData, "data ", data);
        setCreditData({
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
          partiallyPaidInDailyNotInRegisteredDate,
          partiallyPaidInTotal,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  useEffect(() => {
    getUsersCreditList();
  }, []);
  const [Collection, setCollection] = useState({
    creditPaymentDate: null,
    partialOrFull: "Partial",
  });
  let confirmPayments = async (data, salesWAy, e) => {
    e.preventDefault();
    let { collectedAmount, creditPaymentDate } = Collection;

    // return;
    if (
      isNaN(collectedAmount) ||
      collectedAmount == "" ||
      collectedAmount == null ||
      Number(collectedAmount) == 0
    ) {
      alert("paid amount should be > 0 value");
      return;
    }
    setOpenConfirmationModal((prevstate) => {
      return { ...prevstate, Open: false };
    });
    setProcessing(true);
    await axios
      .put(serverAddress + "confirmPayments", {
        data,
        salesWAy,
        businessName,
        token,
        ...Collection,
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
    setCollection({ creditPaymentDate: null, partialOrFull: "Partial" });
    setOpenConfirmationModal({ Open: false });
    setProcessing(false);
  };
  const [openConfirmationModal, setOpenConfirmationModal] = useState({
    Open: false,
  });
  // const [PartiallyCollectedAR, setPartiallyCollectedAR] = useState(0);
  function isDateBetween(fromDate, dateString, toDate) {
    const dateToCheck = new Date(dateString);
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    return dateToCheck >= fromDateObj && dateToCheck <= toDateObj;
  }

  useEffect(() => {
    // console.log("dateRange", dateRange);
    let {
      partiallyPaidInTotal,
      soldInDaily_SoldOncredits,
      soldOnTotal_Oncredit,
      partiallyPaidInDailyNotInRegisteredDate,
    } = creditData;
    let accountRecivableTotalMoney = 0,
      totalCollectedAmount = 0;
    // sold on total sales way and on credit
    let calculateCollectedMoney = (collectedMoneyData) => {
      console.log("collectedMoneyData", collectedMoneyData);
      // return;
      collectedMoneyData?.map((data) => {
        let {
          businessId,
          collectionAmount,
          collectionDate,
          collectionId,
          registrationSource,
          targtedProductId,
          transactionId,
          userId,
        } = data;
        totalCollectedAmount += Number(collectionAmount);
        // console.log("calculatePartiallyCollectedMoney,first", data);
      });
    };
    let calculateAccountRecivable = (datas) => {
      // console.log("calculateAccountRecivable", datas);
      datas?.map((data) => {
        let { creditsalesQty, productsUnitPrice } = data;
        accountRecivableTotalMoney +=
          Number(creditsalesQty) * Number(productsUnitPrice);
      });
    };

    calculateAccountRecivable(soldOnTotal_Oncredit);
    calculateAccountRecivable(soldInDaily_SoldOncredits);

    // calculateCollectedMoney(partiallyPaidInDailyNotInRegisteredDate);
    calculateCollectedMoney(partiallyPaidInTotal);

    ////////////////////////////
    setAccountRecivableAmt(accountRecivableTotalMoney);
    setCollectedMoney({
      Money: totalCollectedAmount,
      Detail: partiallyPaidInTotal,
    });
    ////////////////////////////
  }, [creditData]);

  /////////////////////////////////////////////
  let handleCollectionInfo = (e) => {
    setCollection((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  let calculatePartiallyCollectedMoney = (data) => {
    if (data == undefined) return 0;

    // console.log("calculatePartiallyCollectedMoney data", data);
    let partiallyPaidInfo = data;
    if (!Array.isArray(data)) partiallyPaidInfo = JSON.parse(data);

    if (partiallyPaidInfo?.length == 0) return 0;
    let totalCollectedMoney = 0;
    partiallyPaidInfo?.map((Info) => {
      let { collectedAmount, creditPaymentDate } = Info;
      if (fromDate == "notInDateRange" || toDate == "notInDateRange") {
        totalCollectedMoney += Number(collectedAmount);
      }
      if (isDateBetween(fromDate, creditPaymentDate, toDate)) {
        totalCollectedMoney += Number(collectedAmount);
      }
    });
    return totalCollectedMoney;
  };
  const [showCreditListDetails, setshowCreditListDetails] = useState({
    open: false,
    data: {},
    salesWay: "",
  });
  let getCollectedMoney = (data, salesRegistrationWay) => {
    if (data == undefined || data == null) return 0;
    let { transactionId, dailySalesId } = data;
    if (salesRegistrationWay == "Single") {
      transactionId = dailySalesId;
    }
    let Money = 0;
    let infos = creditData.partiallyPaidInTotal;
    infos.map((info) => {
      if (info.transactionId == transactionId) {
        let { collectionAmount } = info;
        Money += Number(collectionAmount);
      }
    });

    return Money;
  };
  return (
    <div>
      <br />

      {creditData.soldOnTotal_Oncredit?.length > 0 ||
      creditData.soldInDaily_SoldOncredits?.length > 0 ? (
        <TableContainer>
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "10px" }}
          >
            Transaction made by credits
          </Box>
          <Table sx={{ overflow: "scroll", width: "100%" }}>
            <TableHead sx={{ backgroundColor: "white" }}>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Sales Qty</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total money</TableCell>
                <TableCell>Partially Collected </TableCell>
                <TableCell>To be collected</TableCell>
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
                    <TableCell>
                      {CurrencyFormatter(data.productsUnitPrice)}
                    </TableCell>
                    <TableCell>
                      {CurrencyFormatter(
                        data.creditsalesQty * data.productsUnitPrice
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => {
                          setshowCreditListDetails({
                            transactionId: data.dailySalesId,
                            open: true,
                            data: creditData.partiallyPaidInTotal,
                            salesWay: "totalSales",
                          });
                        }}
                      >
                        {CurrencyFormatter(getCollectedMoney(data, "Single"))}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {CurrencyFormatter(
                        Number(data.creditsalesQty) *
                          Number(data.productsUnitPrice) -
                          getCollectedMoney(data, "Single")
                      )}
                    </TableCell>
                    <TableCell>{data.Description}</TableCell>
                    <TableCell>
                      {DateFormatter(data.creditPaymentDate)}
                    </TableCell>
                    <TableCell>
                      {DateFormatter(data.registeredTimeDaily)}
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
                  <TableRow key={"soldOnTotal_Oncredit" + index}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.creditsalesQty}</TableCell>
                    <TableCell>{CurrencyFormatter(data.unitPrice)}</TableCell>
                    <TableCell>
                      {CurrencyFormatter(
                        data.unitPrice * (data.salesQty + data.creditsalesQty)
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => {
                          setshowCreditListDetails({
                            transactionId: data.transactionId,
                            open: true,
                            data: creditData.partiallyPaidInTotal,
                            salesWay: "totalSales",
                          });
                        }}
                      >
                        {console.log("data collected", data)}

                        {CurrencyFormatter(getCollectedMoney(data))}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {console.log("data to be collected", data)}
                      {CurrencyFormatter(
                        Number(data.creditsalesQty) * Number(data.unitPrice) -
                          getCollectedMoney(data)
                      )}
                    </TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>{DateFormatter(data.creditDueDate)}</TableCell>
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
                <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                  Account recivable{" "}
                  {accountRecivableAmt.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </TableCell>

                <TableCell sx={{ textAlign: "center" }} colSpan={2}>
                  Collected Money {CurrencyFormatter(collectedMoney.Money)}
                </TableCell>

                <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                  Money to be collected{" "}
                  {CurrencyFormatter(
                    accountRecivableAmt - collectedMoney.Money
                  )}
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
        <DialogContent>
          {" "}
          {/* <Box>Account recivable=</Box>
          <Box>collected Money=</Box>
        */}
          <Box>
            Remain Amount={" "}
            {CurrencyFormatter(
              openConfirmationModal.data?.creditsalesQty *
                openConfirmationModal.data?.productsUnitPrice -
                getCollectedMoney(openConfirmationModal.data)
            )}
          </Box>
          <Box>When do you have recived your money?</Box>
        </DialogContent>
        <DialogActions>
          <form
            style={{ width: "90%", margin: "auto" }}
            onSubmit={(e) => {
              confirmPayments(
                openConfirmationModal.data,
                openConfirmationModal.salesWAy,
                e
              );
            }}
          >
            <TextField
              value={Collection.creditPaymentDate}
              fullWidth
              required
              name="creditPaymentDate"
              onChange={handleCollectionInfo}
              type="date"
            />

            <TextField
              sx={{ margin: "20px 0" }}
              type="number"
              name="collectedAmount"
              onChange={handleCollectionInfo}
              fullWidth
              label="paied Amount"
              value={Collection.collectedAmount}
            />

            <Box sx={{ margin: "10px auto", textAlign: "center" }}>
              <Button
                sx={{ marginRight: "20px" }}
                variant="contained"
                color="warning"
                onClick={() => {
                  setOpenConfirmationModal({ Open: false });
                }}
              >
                Cancel
              </Button>
              {!Processing ? (
                <Button type="submit" variant="contained" color="primary">
                  Confirm
                </Button>
              ) : (
                <ButtonProcessing />
              )}
            </Box>
          </form>
        </DialogActions>
      </Dialog>
      {showCreditListDetails.open && (
        <GetCreditListEdit
          getUsersCreditList={getUsersCreditList}
          showCreditListDetails={showCreditListDetails}
          setshowCreditListDetails={setshowCreditListDetails}
        />
      )}
    </div>
  );
}

export default GetCreditLists;
