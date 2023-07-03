import React, { useEffect, useState } from "react";
import $ from "jquery";
import GetMaximumStyle from "./GetMaximumSales.module.css";
import CurrencyFormat from "react-currency-format";
import {
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
} from "@mui/material";
import axios from "axios";
function GetMaximumSales() {
  const [selectedValue, setSelectedValue] = useState("default");
  const [MaximumDataList, setMaximumDataList] = useState([]);
  const [SelectedTime, setSelectedTime] = useState("");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [DateRange, setDateRange] = useState({});
  const today = new Date(Date.now());
  let todatFormated = "";
  useEffect(() => {
    if (Object.keys(DateRange).length > 0) {
      submitMaximumSelection("notEvent");
    }
    console.log(DateRange);
  }, [DateRange]);

  useEffect(() => {
    setMaximumDataList([]);
    todatFormated =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    console.log("SelectedTime", SelectedTime);
    if (SelectedTime == "Monthly") {
      // Get the current date.
      // Subtract 30 days from the current date.
      const previous30thDay = new Date(today - 30 * 24 * 60 * 60 * 1000);
      // Format the date to year-month-day format.
      const previous30thDayFormatted =
        previous30thDay.getFullYear() +
        "-" +
        (previous30thDay.getMonth() + 1) +
        "-" +
        previous30thDay.getDate();

      console.log("previous30thDayFormatted", previous30thDayFormatted);
      setDateRange({
        ...DateRange,
        fromDate: todatFormated,
        toDate: previous30thDayFormatted,
      });
    }
    if (SelectedTime == "Annualy") {
      // Subtract 1 year from the current date.
      const previousYear = new Date(today - 364 * 24 * 60 * 60 * 1000);
      // Format the date to year-month-day format.
      const previousYearFormatted =
        previousYear.getFullYear() +
        "-" +
        (previousYear.getMonth() + 1) +
        "-" +
        previousYear.getDate();
      console.log(previousYearFormatted);
      setDateRange({
        ...DateRange,
        fromDate: todatFormated,
        toDate: previousYearFormatted,
      });
    }
    if (SelectedTime == "Others") {
      setDateRange({});
    }
    if (SelectedTime == "weekly") {
      // Subtract 7 days from the current date.
      const previous7thDay = new Date(today - 7 * 24 * 60 * 60 * 1000);
      // Format the date to year-month-day format.
      const previous7thDayFormatted =
        previous7thDay.getFullYear() +
        "-" +
        (previous7thDay.getMonth() + 1) +
        "-" +
        previous7thDay.getDate();
      console.log("previous7thDayFormatted = ", previous7thDayFormatted);
      setDateRange({
        ...DateRange,
        fromDate: todatFormated,
        toDate: previous7thDayFormatted,
      });
    }
  }, [SelectedTime]);
  useEffect(() => {
    let selectTimeRange = $("#selectTimeRange").val();
    console.log("selectTimeRange = ", selectTimeRange);
    if (selectTimeRange == "" || selectTimeRange == "default")
      setSelectedTime("weekly");
    else setSelectedTime(selectTimeRange);
  }, []);

  let changesOnDays = (e) => {
    setSelectedTime(e.target.value);
    console.log(e);
    setSelectedValue(e.target.value);
  };
  let submitMaximumSelection = async (e) => {
    if (e !== "notEvent") e.preventDefault();
    console.log(e);
    console.log(DateRange);
    // return;
    if (Object.keys(DateRange).length < 2) {
      return;
    }

    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "getMaximumSales/", {
      token,
      businessName,
      DateRange,
    });
    $(".LinearProgress").css("display", "none");
    console.log(responce);
    let data = responce.data.data;
    let copyOfData = data.map((item) => {
      return item;
    });
    let collectedData = [],
      dataFound = "";
    data.map((item) => {
      console.log(item);
      dataFound = "No";
      let salesQty = 0,
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
      copyOfData.map((d, index) => {
        console.log(d);
        if (d.ProductId == item.ProductId) {
          dataFound = "yes";
          console.log(d.ProductId, item.ProductId);
          salesQty += d.salesQty;
          purchaseQty += d.purchaseQty;
          inventory += d.Inventory;
          broken += d.wrickages;
          console.log(salesQty, purchaseQty, inventory, broken);
        }
      });
      ob.productName = item.productName;
      ob.unitCost = item.unitCost;
      ob.unitCost = item.unitCost;
      ob.unitPrice = item.unitPrice;
      ob.ProductId = ProductId;
      ob.salesQty = salesQty;
      ob.purchaseQty = purchaseQty;
      ob.Inventory = inventory;
      ob.wrickages = broken;
      console.log(ob);
      if (dataFound == "yes") {
        collectedData.push(ob);
      }
    });
    console.log("collectedData", collectedData);
    if (collectedData.length == 0) return;
    let newCollection = [];
    newCollection.push(collectedData[0]);
    for (let index = 1; index < collectedData.length; index++) {
      let item = collectedData[index];
      let ProductId = item.ProductId,
        productName = item.productName,
        unitCost = item.unitCost,
        purchaseQty = item.purchaseQty,
        salesQty = item.salesQty;
      console.log(newCollection);
      let newLength = newCollection.length;
      for (let i = 0; i < newLength; i++) {
        let unit = newCollection[i];
        console.log(unit);
        console.log(item);
        console.log(
          purchaseQty * item.unitCost,
          unit.purchaseQty * unit.unitCost
        );
        if (purchaseQty * item.unitCost >= unit.purchaseQty * unit.unitCost) {
          newCollection.splice(i, 0, item);
          i = newLength;
        }
      }
    }

    console.log(newCollection);
    setMaximumDataList(newCollection);
  };

  let handleChangeOnDate = (e) => {
    console.log(e.target.name, e.target.value);
    setDateRange({ ...DateRange, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <br />
      <h5>Maximum Transaction Data</h5>
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
              name="toDate"
              type="date"
            />
            <br />
            <label>To Date</label>
            <br />
            <TextField
              onChange={handleChangeOnDate}
              required
              name="fromDate"
              type="date"
            />
          </div>
        )}
        <br />
      </form>
      {/* {console.log("MaximumDataList", MaximumDataList)} */}
      {/* {JSON.stringify(MaximumDataList)} */}
      {console.log(MaximumDataList.length)}
      {MaximumDataList?.length > 0 && MaximumDataList[0] != undefined ? (
        <>
          <div>
            From Date {DateRange.fromDate} To Date {DateRange.toDate}
          </div>
          <TableContainer
            sx={{ minWidth: 600, maxWidth: 800, margin: "auto" }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Product Name</TableCell>
                  <TableCell align="center">Sales qty</TableCell>
                  <TableCell align="center">Purchase Qty</TableCell>
                  <TableCell align="center">Unit Price</TableCell>
                  <TableCell align="center">Sales Amount</TableCell>
                  <TableCell align="center">unit Cost</TableCell>
                  <TableCell align="center">Purchase Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MaximumDataList?.map((row, index) => (
                  <TableRow
                    key={"key_" + index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.productName}
                    </TableCell>
                    <TableCell align="center">{row.salesQty}</TableCell>
                    <TableCell align="center">{row.purchaseQty}</TableCell>
                    <TableCell align="center">
                      <CurrencyFormat
                        value={row.unitPrice}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"Birr "}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CurrencyFormat
                        value={row.unitPrice * row.salesQty}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"Birr "}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CurrencyFormat
                        value={row.unitCost}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"Birr "}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CurrencyFormat
                        value={row.unitCost * row.purchaseQty}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"Birr "}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        "No transaction  data to view maximum data on this date range"
      )}
    </div>
  );
}

export default GetMaximumSales;
