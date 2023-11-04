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
          partiallyPaidInDailyNotInRegisteredDate,
          soldInDaily_CreditPaied_maynotInTime,
          soldOnTotal_Oncredit,
          soldInDaily_SoldOncredits,
          soldInDaily_CreditPaied,
        } = Responces.data;
        console.log("Responces.data = ", Responces.data);
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
  let paymentConfirmed = (data, salesWAy) => {
    console.log("Collection ==== ", Collection);
    // return;
    axios
      .put(serverAddress + "paymentConfirmed", {
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
      soldInDaily_SoldOncredits,
      soldOnTotal_Oncredit,
      partiallyPaidInDailyNotInRegisteredDate,
    } = creditData;
    let accountRecivableTotalMoney = 0,
      totalCollectedAmount = 0;
    // sold on total sales way and on credit
    soldOnTotal_Oncredit?.map((data) => {
      let {
        partiallyPaiedInfo,
        salesTypeValues,
        creditsalesQty,
        productsUnitPrice,
      } = data;
      console.log("first");
      // partiallyPaiedInfo = partiallyPaiedInfo;
      if (!Array.isArray(partiallyPaiedInfo))
        partiallyPaiedInfo = JSON.parse(partiallyPaiedInfo);

      partiallyPaiedInfo?.map((data) => {
        let { collectedAmount, creditPaymentDate } = data;
        if (
          isDateBetween(fromDate, creditPaymentDate, toDate) ||
          (fromDate == "notInDateRange" && toDate == "notInDateRange")
        ) {
          totalCollectedAmount += Number(collectedAmount);
        }
      });

      accountRecivableTotalMoney +=
        Number(creditsalesQty) * Number(productsUnitPrice);
      console.log(
        "totalCollectedAmount",
        totalCollectedAmount,
        "accountRecivableTotalMoney",
        accountRecivableTotalMoney
      );
    });
    // this data contains information about daily sales where items are sold by credit and money may or may not collected.
    soldInDaily_SoldOncredits?.map((data) => {
      let { partiallyPaiedInfo, creditsalesQty, productsUnitPrice } = data;
      // console.log("partiallyPaiedInfo === ", partiallyPaiedInfo);
      // return;
      partiallyPaiedInfo = partiallyPaiedInfo;

      partiallyPaiedInfo?.map((data) => {
        let { collectedAmount, creditPaymentDate } = data;
        if (
          isDateBetween(fromDate, creditPaymentDate, toDate) ||
          (fromDate == "notInDateRange" && toDate == "notInDateRange")
        ) {
          totalCollectedAmount += Number(collectedAmount);
        }
      });

      accountRecivableTotalMoney +=
        Number(creditsalesQty) * Number(productsUnitPrice);
    });
    let ob = {};
    partiallyPaidInDailyNotInRegisteredDate?.map((data) => {
      console.log("data not in register", data);
      let { partiallyPaiedInfo, dailySalesId } = data;
      // remove redundancy
      ob["dailySalesId__" + dailySalesId] = partiallyPaiedInfo;
    });
    console.log("ob is", ob);
    const keys = Object.getOwnPropertyNames(ob);
    keys.map((key) => {
      let value = ob[key];
      console.log(value);
      value.map((paymentInfo) => {
        // paymentInfo;
        let { collectedAmount, creditPaymentDate } = paymentInfo;
        console.log(
          "value collectedAmount",
          collectedAmount,
          " value creditPaymentDate",
          creditPaymentDate
        );
        if (
          isDateBetween(fromDate, creditPaymentDate, toDate) ||
          (fromDate == "notInDateRange" && toDate == "notInDateRange")
        ) {
          totalCollectedAmount += Number(collectedAmount);
        }
      });
    });
    setAccountRecivableAmt(accountRecivableTotalMoney);
    setCollectedMoney(totalCollectedAmount);
  }, [creditData]);

  /////////////////////////////////////////////
  let handleCollectionInfo = (e) => {
    setCollection((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  let calculatePartiallyCollectedMoney = (data) => {
    console.log("calculatePartiallyCollectedMoney data", data);
    let partiallyPaiedInfo = data;
    if (!Array.isArray(data)) partiallyPaiedInfo = JSON.parse(data);

    if (partiallyPaiedInfo?.length == 0) return 0;
    let totalCollectedMoney = 0;
    partiallyPaiedInfo?.map((Info) => {
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
  return (
    <div>
      <br />
      <Box sx={{ display: "flex", justifyContent: "center", padding: "10px" }}>
        Transaction made by credits
      </Box>
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
                    <TableCell>{data.productsUnitPrice}</TableCell>
                    <TableCell>
                      {data.creditsalesQty * data.productsUnitPrice}
                    </TableCell>
                    <TableCell>
                      {calculatePartiallyCollectedMoney(
                        data.partiallyPaiedInfo
                      )}
                    </TableCell>
                    <TableCell>
                      {data.creditsalesQty * data.productsUnitPrice -
                        calculatePartiallyCollectedMoney(
                          data.partiallyPaiedInfo
                        )}
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
                  <TableRow key={"soldOnTotal_Oncredit" + index}>
                    <TableCell>{index}</TableCell>
                    <TableCell>{data.productName}</TableCell>
                    <TableCell>{data.creditsalesQty}</TableCell>
                    <TableCell>{data.unitPrice}</TableCell>
                    <TableCell>
                      {data.unitPrice * (data.salesQty + data.creditsalesQty)}
                    </TableCell>

                    <TableCell>
                      {calculatePartiallyCollectedMoney(
                        data.partiallyPaiedInfo
                      )}
                    </TableCell>
                    <TableCell>
                      {data.creditsalesQty * data.productsUnitPrice -
                        calculatePartiallyCollectedMoney(
                          data.partiallyPaiedInfo
                        )}
                    </TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      {DateFormatter(data.creditPayementdate)}
                    </TableCell>
                    <TableCell>
                      {DateFormatter(data.registrationDate)}
                    </TableCell>
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
                  Account recivable money = {accountRecivableAmt}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={10}>
                  Collected Money {collectedMoney}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={10}>
                  Money to be collected {accountRecivableAmt - collectedMoney}
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
              name="creditPaymentDate"
              onChange={handleCollectionInfo}
              type="date"
            />
            {/* <Box sx={{ marginTop: "20px" }}>
              <label>Please Select payment type</label>
              <Select
                label={"Please Select payment type"}
                style={{ margin: "20px 0" }}
                fullWidth
                required
                name="partialOrFull"
                onChange={handleCollectionInfo}
              >
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Full">Full</MenuItem>
              </Select>
            </Box> */}

            <TextField
              sx={{ margin: "20px 0" }}
              type="number"
              name="collectedAmount"
              onChange={handleCollectionInfo}
              fullWidth
              label="paied Amount"
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
