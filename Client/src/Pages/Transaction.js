import axios from "axios";
import React, { useEffect, useState } from "react";
import "../CSS/Transaction.css";
import currentDates from "../Components/Body/Date/currentDate";
import { Button, TextField } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
export default function Transaction() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [salesAndPurchaseAmount, setSalesAndPurchaseAmount] = useState(0);
  const [FetchedDatas, setFetchedDatas] = useState([]);
  const [TotalExpenses, setTotalExpenses] = useState();
  const [ExpenseTransaction, setExpenseTransaction] = useState([]);
  let updateTransactionItems = async (e) => {
    let transactionId = e.target.name;
    let inputsValue = document.getElementsByClassName(transactionId);
    let businessName = localStorage.getItem("businessName");
    let date = document.getElementById("dateIdTransaction").value;
    let ob = { businessName, date };
    ob.trasactionId = e.target.name;
    for (let i = 0; i < inputsValue.length; i++) {
      let value = inputsValue[i].value;
      let name = inputsValue[i].name;
      ob[name] = value;
    }

    let updates = await axios
      .post(serverAddress + "updateTransactions/", ob)
      .then((data) => {
        alert("updated well");
      });
  };
  let businessName = localStorage.getItem("businessName");
  const [FormData, setFormData] = useState({
    businessName,
    costAmount_: null,
    costDescription_: "",
  });
  let updateCosts = async (ids) => {
    FormData.ids = ids;
    let updateResponse = await axios.post(serverAddress + "updateBusiness/", {
      ...FormData,
    });
    if (updateResponse.data.data == "updated well") {
      alert("data is updated well ");
    }
  };
  let changesToupdateCosts = (e) => {
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
    });
  };
  let ViewTransactions = async (e) => {
    if (e != "notEvent") e.preventDefault();
    let ob = {};
    let time = "";
    if (time == "") {
      time = currentDates();
    }
    let businessName = localStorage.getItem("businessName");
    if (!businessName) {
      alert(businessName);
      return;
    }
    ob.businessName = businessName;
    let response = await axios.post(serverAddress + "ViewTransactions/", ob);
    let arrayData = response.data.salesTransaction;
    let expenses = response.data.expenseTransaction;
    let exp = expenses?.reduce((a, c) => {
      return (a = a + parseFloat(c.costAmount));
    }, 0);

    setTotalExpenses(exp);
    setExpenseTransaction(expenses);

    if (arrayData?.length == 0) {
      setFetchedDatas([]);
      return;
    } else {
      setFetchedDatas(arrayData);
    }
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
  };
  let handleChangeOnInputs = (e) => {
    let transactionId = e.target.className;
  };
  useEffect(() => {
    ExpenseTransaction?.map((items) => {});
  }, [ExpenseTransaction]);

  useEffect(() => {
    ViewTransactions("notEvent");
  }, []);

  useEffect(() => {
    FetchedDatas?.map((Items) => {
      let id = "unitPrice_" + Items.transactionId;
      let salesQty_ = "salesQty_" + Items.transactionId;
      let unitCost_ = "unitCost_" + Items.transactionId;
      let purchaseQty_ = "purchaseQty_" + Items.transactionId;
      let broken = "broken_" + Items.transactionId;
      let idDescription = "description_" + Items.transactionId;
      let idInventory = "inventory_" + Items.transactionId;
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
                  return (
                    <TableRow key={items.expenseId}>
                      <TableCell>{items.costName} </TableCell>
                      <TableCell>
                        <TextField
                          name="costAmount_"
                          onChange={changesToupdateCosts}
                          className={items.expenseId}
                          type="text"
                          value={FormData.costAmount_}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          onChange={changesToupdateCosts}
                          name="costDescription_"
                          type="text"
                          value={FormData.costDescription_}
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
