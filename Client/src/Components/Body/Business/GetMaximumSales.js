import React, { useEffect, useState } from "react";

import GetMaximumStyle from "./GetMaximumSales.module.css";
import CurrencyFormat from "react-currency-format";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyFormatter from "../../utility/Utility";
import axios from "axios";
import { ConsumeableContext } from "../UserContext/UserContext";
function GetMaximumSales({ Notifications, viewInTable }) {
  let { setShowProgressBar, setProccessing } = ConsumeableContext();

  const [selectedValue, setSelectedValue] = useState("default");
  const [MaximumDataList, setMaximumDataList] = useState([]);
  const [SelectedTime, setSelectedTime] = useState("");
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [DateRange, setDateRange] = useState({});
  const today = new Date(Date.now());
  let todayFormatted = "";
  useEffect(() => {
    if (Object.keys(DateRange).length > 0) {
      submitMaximumSelection("notEvent");
    }
    // console.log(DateRange);
  }, [DateRange]);

  useEffect(() => {
    setMaximumDataList([]);
    todayFormatted =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      today.getDate().toString().padStart(2, "0");
    // console.log("SelectedTime", SelectedTime);
    if (SelectedTime == "Monthly") {
      // Get the current date.
      const today = new Date();
      // Subtract 30 days from the current date.
      const previous30thDay = new Date(today - 30 * 24 * 60 * 60 * 1000);
      // Format the date to year-month-day format with two-digit month and day.
      const previous30thDayFormatted =
        previous30thDay.getFullYear() +
        "-" +
        (previous30thDay.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        previous30thDay.getDate().toString().padStart(2, "0");
      // console.log("previous30thDayFormatted", previous30thDayFormatted);
      setDateRange({
        ...DateRange,
        fromDate: previous30thDayFormatted,
        toDate: todayFormatted,
      });
    } else if (SelectedTime == "Annualy") {
      // Subtract 1 year from the current date.
      const previousYear = new Date(today - 364 * 24 * 60 * 60 * 1000);
      // Format the date to year-month-day format with two-digit month and day.
      const previousYearFormatted =
        previousYear.getFullYear() +
        "-" +
        (previousYear.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        previousYear.getDate().toString().padStart(2, "0");

      // console.log(previousYearFormatted);

      setDateRange({
        ...DateRange,
        fromDate: todayFormatted,
        toDate: previousYearFormatted,
      });
    } else if (SelectedTime == "Others") {
      setDateRange({});
    } else if (SelectedTime == "weekly") {
      // Subtract 7 days from the current date.
      const previous7thDay = new Date(today - 7 * 24 * 60 * 60 * 1000);

      // Format the date to year-month-day format with two-digit month and day.
      const previous7thDayFormatted =
        previous7thDay.getFullYear() +
        "-" +
        (previous7thDay.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        previous7thDay.getDate().toString().padStart(2, "0");

      // console.log("previous7thDayFormatted =", previous7thDayFormatted);

      setDateRange({
        ...DateRange,
        fromDate: previous7thDayFormatted,
        toDate: todayFormatted,
      });
    }
  }, [SelectedTime]);
  useEffect(() => {
    let selectTimeRange = "";
    // console.log("selectTimeRange = ", selectTimeRange);
    if (
      selectTimeRange == undefined ||
      selectTimeRange == "" ||
      selectTimeRange == "default"
    )
      setSelectedTime("weekly");
    else setSelectedTime(selectTimeRange);
  }, []);

  let changesOnDays = (e) => {
    setSelectedTime(e.target.value);
    // console.log(e);
    setSelectedValue(e.target.value);
  };
  let submitMaximumSelection = async (e) => {
    if (e !== "notEvent") e.preventDefault();
    // console.log(e);
    // console.log(DateRange);
    // return;
    if (Object.keys(DateRange).length < 2) {
      return;
    }
    setShowProgressBar(true);
    let responce = await axios.post(serverAddress + "getMaximumSales/", {
      token,
      businessName,
      DateRange,
      businessId,
    });
    setShowProgressBar(false);

    console.log("@getMaximumSales", responce);
    let data = responce.data.data;
    if (data == `you are not owner of this business`) {
      return alert(data);
    }
    let copyOfData = [...data];
    let collectedData = [],
      dataFound = "";
    data.map((item) => {
      // console.log(item);
      let { itemDetailInfo } = item;
      let { productsUnitPrice } = JSON.parse(itemDetailInfo);
      console.log(
        "itemDetailInfo",
        itemDetailInfo,
        " productsUnitPrice",
        productsUnitPrice
      );
      // return;
      dataFound = "No";
      let salesQty = 0,
        creditsalesQty = 0,
        purchaseQty = 0,
        inventory = 0,
        ProductId = item.ProductId,
        broken = 0;
      let ob = {};
      for (let i = 0; i < collectedData.length; i++) {
        let pID = collectedData[i].ProductId;
        if (pID == ProductId) {
          return;
        }
      }
      // console.log("copyOfData", copyOfData);
      copyOfData.map((d, index) => {
        // return;
        if (d.ProductId == item.ProductId) {
          dataFound = "yes";
          salesQty += d.salesQty;
          creditsalesQty += d.creditsalesQty;
          purchaseQty += d.purchaseQty;
          inventory += d.Inventory;
          broken += d.wrickages;
        }
      });
      ob.creditsalesQty = creditsalesQty;
      ob.productName = item.productName;
      ob.unitCost = item.productsUnitPrice;
      ob.unitPrice = item.unitPrice;
      ob.ProductId = ProductId;
      ob.salesQty = salesQty;
      ob.purchaseQty = purchaseQty;
      ob.Inventory = inventory;
      ob.wrickages = broken;
      if (dataFound == "yes") {
        collectedData.push(ob);
      }
    });

    collectedData.sort((a, b) => {
      const totalSalesA = (a.salesQty + a.creditsalesQty) * a.purchaseQty;
      const totalSalesB = (b.salesQty + b.creditsalesQty) * b.purchaseQty;

      return totalSalesB - totalSalesA;
    });
    if (collectedData.length == 0) return;

    // console.log(collectedData, collectedData);

    setMaximumDataList(collectedData);
  };

  let handleChangeOnDate = (e) => {
    // console.log(e.target.name, e.target.value);
    setDateRange({ ...DateRange, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <h5 className={GetMaximumStyle.maximumTitle}>
        Maximum Transaction Data Table
      </h5>
      <form
        className={GetMaximumStyle.maxSelectionForm}
        onSubmit={submitMaximumSelection}
      >
        <Select
          value={selectedValue}
          name="selectTimeRange"
          className={GetMaximumStyle.selectTimeRange}
          id={GetMaximumStyle.selectTimeRange}
          onChange={changesOnDays}
        >
          <MenuItem value="default">Select Date Range</MenuItem>
          <MenuItem selected value="weekly">
            weekly
          </MenuItem>
          <MenuItem value="Monthly"> Monthly</MenuItem>
          <MenuItem value="Annualy"> Annualy</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
        </Select>
        {SelectedTime == "Others" && (
          <div className={GetMaximumStyle.othersDateRange}>
            <br />

            <label>From Date</label>
            <br />
            <TextField
              onChange={handleChangeOnDate}
              required
              name="fromDate"
              type="date"
            />
            <br />
            <label>To Date</label>
            <br />
            <TextField
              onChange={handleChangeOnDate}
              required
              name="toDate"
              type="date"
            />
          </div>
        )}
      </form>
      {/* {console.log("DateRange == ", DateRange)} */}
      <h3 className={GetMaximumStyle.fromDateToDate}>
        From Date {DateRange.fromDate ? DateRange.fromDate : " not specified "}
        &nbsp; To Date {DateRange.toDate ? DateRange.toDate : " not Specified "}
      </h3>
      {MaximumDataList?.length > 0 && MaximumDataList[0] != undefined ? (
        <>
          <div className={GetMaximumStyle.tableWrapper}>
            {viewInTable ? (
              <Box style={{ padding: "10px" }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Product&nbsp;Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Sales&nbsp;qty&nbsp;in&nbsp;cash</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Sales&nbsp;qty&nbsp;in&nbsp;credit</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Purchase&nbsp;Qty</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Unit&nbsp;Price</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Total&nbsp;Sales</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Unit&nbsp;Cost</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Purchase&nbsp;QTY</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {JSON.stringify(MaximumDataList)} */}
                      {MaximumDataList?.map((row, index) => {
                        return (
                          <TableRow key={"key_" + index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.productName}</TableCell>
                            <TableCell>{row.salesQty}</TableCell>
                            <TableCell>{row.creditsalesQty}</TableCell>
                            <TableCell>{row.purchaseQty}</TableCell>
                            <TableCell>
                              <CurrencyFormat
                                value={row.unitPrice}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Birr "}
                              />
                            </TableCell>
                            <TableCell>
                              <CurrencyFormat
                                value={
                                  row.unitPrice *
                                  (row.creditsalesQty + row.salesQty)
                                }
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Birr "}
                              />
                            </TableCell>
                            <TableCell>
                              {CurrencyFormatter(row.unitCost)}
                            </TableCell>
                            <TableCell>
                              {CurrencyFormatter(
                                row.unitCost * row.purchaseQty
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <TableContainer>
                <Table sx={{ width: "100%" }} aria-label="simple table">
                  <TableBody sx={{ display: "flex", flexWrap: "wrap" }}>
                    {MaximumDataList?.map((row, index) => (
                      <TableRow
                        key={"key_" + index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component={Paper}
                          className="TableCell"
                          sx={{
                            width: "280px",
                            margin: "3px 6px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                          }}
                        >
                          <div>
                            <strong>No : </strong>
                            {index + 1}
                          </div>
                          <div component="th" scope="row">
                            <strong>Product Name : </strong>
                            {row.productName}
                          </div>
                          <div align="center">
                            <strong>Sales qty in cash : </strong>
                            {row.salesQty}
                          </div>
                          <div>
                            <strong>Sales qty in credit: </strong>
                            {row.creditsalesQty}
                          </div>
                          <div align="center">
                            <strong>Purchase Qty : </strong>
                            {row.purchaseQty}purchaseQty
                          </div>
                          <div align="center">
                            <strong>Unit Price : </strong>
                            {row.unitPrice}
                          </div>
                          <div align="center">
                            <strong>STotal Sales : </strong>
                            <CurrencyFormat
                              value={
                                row.unitPrice *
                                (row.creditsalesQty + row.salesQty)
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                              prefix={"Birr "}
                            />
                          </div>
                          <div align="center">
                            <strong>Unit Cost : </strong>
                            {CurrencyFormatter(row.unitCost)}
                          </div>
                          <div align="center">
                            <strong>Purchase QTY : </strong>
                            {CurrencyFormatter(row.purchaseQty)}
                          </div>{" "}
                          <div align="center">
                            <strong>Total Purchase : </strong>
                            {CurrencyFormatter(row.unitCost * row.purchaseQty)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </>
      ) : (
        "No transaction  data to view maximum data on this date range"
      )}
    </div>
  );
}

export default GetMaximumSales;
