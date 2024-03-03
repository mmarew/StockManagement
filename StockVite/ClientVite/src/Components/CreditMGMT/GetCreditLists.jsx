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
import { IconButton, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

import "./GetCreditLists.css";
import { DateFormatter } from "../Body/Date/currentDate";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import CurrencyFormatter, { ButtonProcessing } from "../Utilities/Utility";
import GetCreditListEdit from "./GetCreditListEdit";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";
import SuccessOrError from "../Body/Others/SuccessOrError";
import HRTAG from "../Utilities/HRTAG";

export let getCollectedMoney = (data, salesRegistrationWay, infos) => {
  if (data == undefined || data == null) return 0;
  let { transactionId, dailySalesId } = data;
  if (salesRegistrationWay == "Single") {
    transactionId = dailySalesId;
  }
  let Money = 0;
  infos.map((info) => {
    if (info.transactionId == transactionId) {
      let { collectionAmount } = info;
      Money += Number(collectionAmount);
    }
  });

  return Money;
};
function GetCreditLists({
  dateRange,
  Notifications,
  randval,
  viewInTable,
  setFetchedDataLength,
}) {
  const [SuccessOrErrorsOnCredit, setSuccessOrErrorsOnCredit] = useState(null);
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
    setShowProgressBar(true);
    setProcessing(true);
    try {
      let Responces = await axios.get(
        serverAddress +
          "Credit/getUsersCreditList?token=" +
          token +
          "&&businessName=" +
          businessName +
          "&&businessId=" +
          businessId +
          "&&fromDate=" +
          dateRange.fromDate +
          "&&toDate=" +
          dateRange.toDate
      );
      console.log("Responces", Responces);
      setProcessing(false);

      let {
        partiallyPaidInTotal,
        partiallyPaidInDailyNotInRegisteredDate,
        soldInDaily_CreditPaied_maynotInTime,
        soldOnTotal_Oncredit,
        soldInDaily_SoldOncredits,
        soldInDaily_CreditPaied,
      } = Responces.data;

      // return;
      if (typeof setFetchedDataLength === "function") {
        // do something

        setFetchedDataLength(soldInDaily_SoldOncredits?.length);
      }
      setCreditData({
        soldInDaily_CreditPaied_maynotInTime,
        soldOnTotal_Oncredit,
        soldInDaily_SoldOncredits,
        soldInDaily_CreditPaied,
        partiallyPaidInDailyNotInRegisteredDate,
        partiallyPaidInTotal,
      });

      setShowProgressBar(false);
    } catch (error) {
      setShowProgressBar(false);
      setProcessing(false);
      setSuccessOrErrorsOnCredit(error.message);
    }
  };
  useEffect(() => {
    getUsersCreditList();
  }, [, randval]);
  const [Collection, setCollection] = useState({
    creditPaymentDate: null,
    partialOrFull: "Partial",
  });
  let confirmPayments = async (data, salesWAy, e) => {
    e.preventDefault();
    let { collectedAmount, creditPaymentDate } = Collection;

    if (
      isNaN(collectedAmount) ||
      !collectedAmount ||
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
        let Message = Responces.data.data;

        setSuccessOrErrorsOnCredit("SUCCESS");
      })
      .catch((error) => {
        setSuccessOrErrorsOnCredit("error no 13");
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

  useEffect(() => {
    let {
      partiallyPaidInTotal,
      soldInDaily_SoldOncredits,
      soldOnTotal_Oncredit,
    } = creditData;
    console.log("creditData", creditData);
    let accountRecivableTotalMoney = 0,
      totalCollectedAmount = 0;
    // sold on total sales way and on credit
    let calculateCollectedMoney = (collectedMoneyData) => {
      collectedMoneyData?.map((data) => {
        let { collectionAmount } = data;
        totalCollectedAmount += Number(collectionAmount);
      });
    };
    let calculateAccountRecivable = (datas) => {
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

  const [showCreditListDetails, setshowCreditListDetails] = useState({
    open: false,
    data: {},
    salesWay: "",
  });

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
  // const [viewInTable, setviewInTable] = useState(
  //   window.innerWidth > 768 ? true : false
  // );
  const [minimizeTable, setminimizeTable] = useState(false);
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "20px ",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>Sales in credit</div>
        {SuccessOrErrorsOnCredit && (
          <SuccessOrError
            request={SuccessOrErrorsOnCredit}
            setErrors={setSuccessOrErrorsOnCredit}
          />
        )}

        <IconButton onClick={() => setminimizeTable(!minimizeTable)}>
          {minimizeTable ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Box>
      <HRTAG />
      {!minimizeTable && (
        <Paper sx={{ padding: "20px" }}>
          {creditData.soldInDaily_SoldOncredits.length > 0 && (
            <ExportToExcel data={creditData} target={"creditsales"} />
          )}
          {creditData.soldInDaily_SoldOncredits?.length > 0 ? (
            <Box>
              {!viewInTable ? (
                <Box style={{ padding: "10px" }}>
                  <Box>
                    <Box style={{ display: "flex", flexWrap: "wrap" }}>
                      {creditData.soldInDaily_SoldOncredits?.map(
                        (data, index) => (
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
                                {CurrencyFormatter(data.unitPrice)}
                              </div>
                              <div>
                                <strong>Money Credit: </strong>
                                {CurrencyFormatter(
                                  data.creditsalesQty * data.productsUnitPrice
                                )}
                              </div>
                              <div>
                                <strong>To Be collected: </strong>
                                {CurrencyFormatter(
                                  Number(data.creditsalesQty) *
                                    Number(data.productsUnitPrice) -
                                    getCollectedMoney(
                                      data,
                                      "Single",
                                      creditData.partiallyPaidInTotal
                                    )
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
                                {CurrencyFormatter(
                                  getCollectedMoney(
                                    data,
                                    "Single",
                                    creditData.partiallyPaidInTotal
                                  )
                                )}
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
                        )
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Number</TableCell>
                          <TableCell>
                            Product&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name{" "}
                          </TableCell>
                          <TableCell>
                            Credit&nbsp;&nbsp;&nbsp;&nbsp;Sales
                          </TableCell>
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
                        {creditData.soldInDaily_SoldOncredits?.map(
                          (data, index) => (
                            <TableRow key={"indexOfGetData" + index}>
                              <TableCell>{index + 1}</TableCell>
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
                                {CurrencyFormatter(
                                  Number(data.creditsalesQty) *
                                    Number(data.productsUnitPrice) -
                                    getCollectedMoney(
                                      data,
                                      "Single",
                                      creditData.partiallyPaidInTotal
                                    )
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
                                  {CurrencyFormatter(
                                    getCollectedMoney(
                                      data,
                                      "Single",
                                      creditData.partiallyPaidInTotal
                                    )
                                  )}
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
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              <Box className="Summary_Container">
                <Typography style={{ marginRight: "70px" }} variant="h6">
                  Summary
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flex: 1,
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
                    Collected Money {CurrencyFormatter(collectedMoney.Money)}
                  </div>

                  <div style={{}} colSpan={4}>
                    To Be Collected:{" "}
                    {CurrencyFormatter(
                      accountRecivableAmt - collectedMoney.Money
                    )}
                  </div>
                </div>
              </Box>
            </Box>
          ) : (
            <>
              {Processing ? (
                " Waiting ... "
              ) : (
                <h4 style={{ color: "#333" }}> No credit data </h4>
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
                    Number(
                      getCollectedMoney(
                        openConfirmationModal.data,
                        "Single",
                        creditData.partiallyPaidInTotal
                      )
                    )
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
        </Paper>
      )}
    </div>
  );
}

export default GetCreditLists;
