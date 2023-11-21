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
  Paper,
} from "@mui/material";
import "./GetCreditLists.css";
import { DateFormatter } from "../Date/currentDate";
import { ConsumeableContext } from "../UserContext/UserContext";
import CurrencyFormatter, { ButtonProcessing } from "../../utility/Utility";
import GetCreditListEdit from "./GetCreditListEdit";
import { Typography } from "@material-ui/core";
function GetCreditLists({ dateRange, Notifications, viewInTable }) {
  let numberOfNotifications, setNumberOfNotifications;
  if (
    Notifications != undefined &&
    Notifications != "undefined" &&
    Notifications != null &&
    Notifications != "null"
  ) {
    numberOfNotifications = Notifications.numberOfNotifications;
    setNumberOfNotifications = Notifications.setNumberOfNotifications;
  }

  const [Processing, setProcessing] = useState(false);
  let { fromDate, toDate } = dateRange;
  let {
    setAccountRecivableAmt,
    setCollectedMoney,
    collectedMoney,
    accountRecivableAmt,
    setShowProgressBar,
    setProccessing,
  } = ConsumeableContext();
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let businessId = localStorage.getItem("businessId");

  const [creditData, setCreditData] = useState({
    soldOnTotal_Oncredit: [],
    soldInDaily_SoldOncredits: [],
    soldInDaily_CreditPaied_maynotInTime: [],
    soldInDaily_CreditPaied: [],
    partiallyPaidInTotal: [],
  });

  let getUsersCreditList = async () => {
    console.log("dateRange", dateRange);
    setShowProgressBar(true);
    await axios
      .get(
        serverAddress +
          "getUsersCreditList?token=" +
          token +
          "&&businessName=" +
          businessName +
          "&&businessId=" +
          businessId +
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
    setShowProgressBar(false);
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

    setShowProgressBar(true);
    setProcessing(true);
    await axios
      .put(serverAddress + "confirmPayments", {
        data,
        salesWAy,
        businessName,
        token,
        businessId,
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
    setOpenConfirmationModal((prevstate) => {
      return { ...prevstate, Open: false };
    });
    setCollection({ creditPaymentDate: null, partialOrFull: "Partial" });
    // setOpenConfirmationModal({ Open: false });
    setProcessing(false);
    setShowProgressBar(false);
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
    console.log(
      "salesRegistrationWay",
      salesRegistrationWay,
      "transactionId",
      transactionId
    );
    let Money = 0;
    let infos = creditData.partiallyPaidInTotal;
    // return console.log("creditData", creditData);
    infos.map((info) => {
      if (info.transactionId == transactionId) {
        let { collectionAmount } = info;
        Money += Number(collectionAmount);
      }
    });

    return Money;
  };
  useEffect(() => {
    if (
      setNumberOfNotifications != undefined &&
      setNumberOfNotifications != "undefined" &&
      setNumberOfNotifications != null &&
      setNumberOfNotifications != "null"
    )
      setNumberOfNotifications((prev) => {
        return {
          ...prev,
          Credits: creditData.soldInDaily_SoldOncredits?.length,
        };
      });
  }, [creditData]);

  return (
    <div>
      {creditData.soldInDaily_SoldOncredits?.length > 0 ? (
        <Box>
          {!viewInTable ? (
            <Box style={{ padding: "10px" }}>
              <Box>
                <Box style={{ display: "flex", flexWrap: "wrap" }}>
                  {creditData.soldInDaily_SoldOncredits?.map((data, index) => (
                    <Box
                      component={Paper}
                      key={"indexOfGetData" + index}
                      style={{
                        padding: "20px",
                        margin: "3px 6px",
                        width: "280px",
                      }}
                    >
                      <Box>
                        <div>
                          <strong>Number: </strong>
                          {index + 1}
                        </div>
                        <div>
                          <strong>Name: </strong>
                          {data.productName}
                        </div>
                        <div>
                          <strong>Credit sales qty: </strong>
                          {data.creditsalesQty}
                        </div>
                        <div>
                          <strong>Unit Price: </strong>
                          {CurrencyFormatter(data.productsUnitPrice)}
                        </div>
                        <div>
                          <strong>Sales Money In Credit: </strong>
                          {data.creditsalesQty * data.productsUnitPrice}
                        </div>
                        <div>
                          <strong>To Be collected: </strong>
                          {CurrencyFormatter(
                            Number(data.creditsalesQty) *
                              Number(data.productsUnitPrice) -
                              getCollectedMoney(data, "Single")
                          )}
                        </div>
                        <div>
                          <strong>Description: </strong>
                          {data.Description}
                        </div>
                        <div>
                          <strong> Credit Payment Date: </strong>
                          {DateFormatter(data.creditPaymentDate)}
                        </div>
                        <div>
                          <strong> Registration Date: </strong>
                          {DateFormatter(data.registeredTimeDaily)}
                        </div>

                        <strong>Collected Money </strong>
                        <Button
                          onClick={() => {
                            setshowCreditListDetails({
                              transactionId: data.dailySalesId,
                              open: true,
                              data: creditData.partiallyPaidInTotal,
                              salesWay: "singleSales",
                            });
                          }}
                        >
                          {CurrencyFormatter(getCollectedMoney(data, "Single"))}
                        </Button>
                        <div>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setOpenConfirmationModal({
                                salesWAy: "singleSales",
                                Open: true,
                                data: data,
                              });
                            }}
                          >
                            Collect Money
                          </Button>
                        </div>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Number</TableCell>
                    <TableCell>
                      Product&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name{" "}
                    </TableCell>
                    <TableCell>Credit&nbsp;&nbsp;&nbsp;&nbsp;Sales</TableCell>
                    <TableCell>Unit&nbsp;Price</TableCell>
                    <TableCell>Total&nbsp;Price</TableCell>
                    <TableCell>To Be collected </TableCell>
                    <TableCell>
                      Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </TableCell>
                    <TableCell>Collection&nbsp;Date</TableCell>
                    <TableCell>Sales&nbsp;&nbsp;Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Collected</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creditData.soldInDaily_SoldOncredits?.map((data, index) => (
                    <TableRow key={"indexOfGetData" + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.productName}</TableCell>
                      <TableCell>{data.creditsalesQty}</TableCell>
                      <TableCell>
                        {CurrencyFormatter(data.productsUnitPrice)}
                      </TableCell>
                      <TableCell>
                        {data.creditsalesQty * data.productsUnitPrice}
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
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setOpenConfirmationModal({
                              salesWAy: "singleSales",
                              Open: true,
                              data: data,
                            });
                          }}
                        >
                          Collect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box
            className="Summary_Container"
            component={Paper}
            style={{ width: "98%", marginRight: "auto" }}
          >
            <Typography variant="h6" style={{ textAlign: "center" }}>
              Summary
            </Typography>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flex: 1,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                }}
              >
                Receivable: {CurrencyFormatter(accountRecivableAmt)}
              </div>

              <div style={{}}>
                Collected: {CurrencyFormatter(collectedMoney.Money)}
              </div>

              <div style={{}} colSpan={4}>
                To Be Collected:{" "}
                {CurrencyFormatter(accountRecivableAmt - collectedMoney.Money)}
              </div>
            </div>
          </Box>
        </Box>
      ) : (
        <>
          {Processing ? (
            " Waiting ... "
          ) : (
            <h1 style={{ margin: "10px" }}> No credit data </h1>
          )}
        </>
      )}
      <Dialog
        open={openConfirmationModal.Open}
        // onClose={() => {
        //   setOpenConfirmationModal({ Open: false });
        // }}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Box>
            Remain Amount={" "}
            {CurrencyFormatter(
              Number(
                openConfirmationModal.data?.creditsalesQty *
                  openConfirmationModal.data?.productsUnitPrice
              ) -
                Number(getCollectedMoney(openConfirmationModal.data, "Single"))
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
