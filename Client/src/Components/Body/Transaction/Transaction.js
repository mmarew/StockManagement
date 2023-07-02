import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import "./Transaction.css";
import currentDates from "../Date/currentDate";
import { Button, TextField } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
export default function Transaction() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [salesAndPurchaseAmount, setSalesAndPurchaseAmount] = useState(0);
  const [FetchedDatas, setFetchedDatas] = useState([]);
  const [TotalExpenses, setTotalExpenses] = useState();
  const [ExpenseTransaction, setExpenseTransaction] = useState([]);
  let updateTransactionItems = async (e) => {
    console.log(e.target.name);
    let transactionId = e.target.name;
    let id = "btnUpdate_" + transactionId;
    let inputsValue = document.getElementsByClassName(transactionId);
    console.log(inputsValue);
    let businessName = localStorage.getItem("businessName");
    let date = document.getElementById("dateIdTransaction").value;
    let ob = { businessName, date };
    ob.trasactionId = e.target.name;
    for (let i = 0; i < inputsValue.length; i++) {
      let value = inputsValue[i].value;
      let name = inputsValue[i].name;
      ob[name] = value;
    }
    console.log(ob);

    $(".LinearProgress").css("display", "block");
    let updates = await axios
      .post(serverAddress + "updateTransactions/", ob)
      .then((data) => {
        $("#" + id).hide();
        // console.log(data);
        alert("updated well");
      });
    console.log("updates", updates);
    // $(".LinearProgress").css("display", "none");
  };
  let updateCosts = async (ids) => {
    console.log("ids");
    console.log(ids);
    let businessName = localStorage.getItem("businessName");
    let costDescription_ = $("#costDescription_" + ids).val(),
      costAmount_ = $("#costAmount_" + ids).val();
    console.log(costDescription_, costAmount_);
    let updateResponse = await axios.post(serverAddress + "updateBusiness/", {
      costDescription_,
      costAmount_,
      ids,
      businessName,
    });
    console.log(updateResponse);
    console.log("updateResponse " + updateResponse.data.data);
    if (updateResponse.data.data == "updated well") {
      alert("data is updated well ");
      $(".updateBtn_" + ids).hide();
    }
  };
  let changesToupdateCosts = (e) => {
    // costDescription_,costDescription_,updateBtn_
    console.log(e.target);
    let classNames = e.target.className;
    $(".updateBtn_" + classNames).show();
  };
  let ViewTransactions = async (e) => {
    if (e != "notEvent") e.preventDefault();
    console.log("ViewTransactions");
    let ob = {};
    let time = $("#dateIdTransaction").val();
    console.log("Time = " + time);
    if (time == "") {
      time = currentDates();
    }
    console.log(time);
    $("#dateIdTransaction").val(time);
    ob.time = $("#dateIdTransaction").val();
    let businessName = localStorage.getItem("businessName");
    console.log("wrong businessName = " + businessName);
    if (!businessName) {
      console.log("wrong businessName = " + businessName);
      alert(businessName);
      return;
    }
    ob.businessName = businessName;
    console.log(ob);
    let response = await axios.post(serverAddress + "ViewTransactions/", ob);
    console.log("@ViewTransactions = response", response);
    let arrayData = response.data.salesTransaction;
    let expenses = response.data.expenseTransaction;
    let exp = expenses?.reduce((a, c) => {
      return (a = a + parseFloat(c.costAmount));
    }, 0);
    console.log("expenses are " + exp);

    setTotalExpenses(exp);
    setExpenseTransaction(expenses);

    console.log(arrayData);
    if (arrayData?.length == 0) {
      setFetchedDatas([]);
      $("#TransactionTable").hide();
      $("#noTransaction").remove();
      $("#ExpensesLists").after(
        "<h5 id='noTransaction'>No transaction data on this day</h5>"
      );
      return;
    } else {
      $("#TransactionTable").show();
      setFetchedDatas(arrayData);
    }
    // productsUnitCost 38
    // productsUnitPrice 60
    // purchaseQty 100
    let purchaseCost = 0;
    let salesAmount = arrayData?.reduce((a, c) => {
      let productsUnitCost = c.productsUnitCost,
        productsUnitPrice = c.productsUnitPrice,
        purchaseQty = c.purchaseQty,
        salesQty = c.salesQty;
      purchaseCost += purchaseQty * productsUnitCost;
      return (a = a + parseFloat(productsUnitPrice) * parseInt(salesQty));
    }, 0);
    setSalesAndPurchaseAmount({ salesAmount, purchaseCost });
    console.log(
      "salesAmount is " + salesAmount,
      " purchaseCost==" + purchaseCost
    );
  };
  let handleChangeOnInputs = (e) => {
    console.log(e.target);
    console.log(e.target.className);
    let transactionId = e.target.className;
    let id = "btnUpdate_" + transactionId;
    $("#" + id).show();
  };
  useEffect(() => {
    console.log(ExpenseTransaction);
    ExpenseTransaction?.map((items) => {
      let costAmount_ = "costAmount_" + items.expenseId,
        costDescription_ = "costDescription_" + items.expenseId;
      $("#" + costDescription_).val(items.costDescription);
      $("#" + costAmount_).val(items.costAmount);
    });
  }, [ExpenseTransaction]);

  useEffect(() => {
    ViewTransactions("notEvent");
  }, []);

  useEffect(() => {
    FetchedDatas?.map((Items) => {
      let id = "unitPrice_" + Items.transactionId;
      $("#" + id).val(Items.unitPrice);
      let salesQty_ = "salesQty_" + Items.transactionId;
      $("#" + salesQty_).val(Items.salesQty);
      let unitCost_ = "unitCost_" + Items.transactionId;
      $("#" + unitCost_).val(Items.unitCost);
      let purchaseQty_ = "purchaseQty_" + Items.transactionId;
      $("#" + purchaseQty_).val(Items.purchaseQty);
      let broken = "broken_" + Items.transactionId;
      $("#" + broken).val(Items.wrickages);
      let idDescription = "description_" + Items.transactionId;
      $("#" + idDescription).val(Items.description);
      let idInventory = "inventory_" + Items.transactionId;
      $("#" + idInventory).val(Items.Inventory);
    });
  }, [FetchedDatas]);
  return (
    <div>
      <form className="searchInputAndBtn" onSubmit={(e) => ViewTransactions(e)}>
        <TextField required type="date" name="" id="dateIdTransaction" />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="searchView"
        >
          View
        </Button>
      </form>
      {console.log("FetchedDatas == ", FetchedDatas)}
      {FetchedDatas.length > 0 ? (
        <TableContainer>
          <Table border="1" id="TransactionTable">
            <TableHead>
              <TableRow>
                <TableCell>Product name</TableCell>
                <TableCell>Unit price</TableCell>
                <TableCell>Sold Qty</TableCell>
                <TableCell>Total sales</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>purchase Qty</TableCell>
                <TableCell>Total Purchase</TableCell>
                <TableCell>Broken</TableCell>
                <TableCell>Inventory</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FetchedDatas?.map((Items) => {
                console.log(Items);
                return (
                  <TableRow
                    id={"tr_" + Items.transactionId}
                    key={Items.transactionId}
                  >
                    <TableCell> {Items.productName}</TableCell>
                    <TableCell>
                      <TextField
                        name="unitPrice"
                        id={"unitPrice_" + Items.transactionId}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="salesQty"
                        id={"salesQty_" + Items.transactionId}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="totalSales"
                        id={"totalSales_" + Items.transactionId}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                        value={Items.salesQty * Items.unitPrice}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="unitCost"
                        id={"unitCost_" + Items.transactionId}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="purchaseQty"
                        id={"purchaseQty_" + Items.transactionId}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="totalCost"
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                        value={Items.purchaseQty * Items.unitCost}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="broken"
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                        id={"broken_" + Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="inventory"
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                        id={"inventory_" + Items.transactionId}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id={"description_" + Items.transactionId}
                        name={"description"}
                        onChange={handleChangeOnInputs}
                        className={Items.transactionId}
                      ></TextField>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant=""
                        color="primary"
                        id={"btnUpdate_" + Items.transactionId}
                        className="updateTransactions"
                        name={Items.transactionId}
                        onClick={updateTransactionItems}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableRow>
              <TableCell colSpan={3}>Total Amount</TableCell>
              <TableCell>{salesAndPurchaseAmount.salesAmount}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{salesAndPurchaseAmount.purchaseCost}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10}>
                {`Sales Amount- Purchase Amount 
                ${
                  parseInt(salesAndPurchaseAmount.salesAmount) -
                  parseInt(salesAndPurchaseAmount.purchaseCost)
                }`}
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      ) : (
        <h3>No purchase and sales transaction on this date</h3>
      )}
      {ExpenseTransaction.length > 0 ? (
        <div>
          <h4 id="ExpensesLists">Expenses list</h4>
          <TableContainer>
            <Table className="tableExpenses">
              <TableHead>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
              </TableHead>
              <TableBody>
                {ExpenseTransaction?.map((items) => {
                  $(".tableExpenses").show();
                  console.log(ExpenseTransaction);
                  return (
                    <TableRow key={items.expenseId}>
                      <TableCell>{items.costName} </TableCell>
                      <TableCell>
                        <TextField
                          name=""
                          onChange={changesToupdateCosts}
                          id={"costAmount_" + items.expenseId}
                          className={items.expenseId}
                          type="text"
                          // value={items.costAmount}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          onChange={changesToupdateCosts}
                          className={items.expenseId}
                          name=""
                          id={"costDescription_" + items.expenseId}
                          type="text"
                          // value={items.costDescription}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => updateCosts(items.expenseId)}
                          name={items.expenseId}
                          className={"updateBtn_" + items.expenseId}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              {"Total expenses = " + TotalExpenses}
            </Table>
          </TableContainer>
          {/* net cash flow {salesAmount - TotalExpenses} */}
        </div>
      ) : (
        <h3>No expences list on this day</h3>
      )}
    </div>
  );
}
