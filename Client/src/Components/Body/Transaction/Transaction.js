import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import "./Transaction.css";
import currentDates from "../Date/currentDate";
export default function Transaction() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [salesAmount, setSalesAmount] = useState(0);
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
    let updates = await axios
      .post(serverAddress + "updateTransactions/", ob)
      .then((data) => {
        $("#" + id).hide();
        // console.log(data);
        alert("updated well");
      });
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
    let salesqty = arrayData?.reduce((a, c) => {
      let productsUnitCost = c.productsUnitCost,
        productsUnitPrice = c.productsUnitPrice,
        purchaseQty = c.purchaseQty,
        salesQty = c.salesQty;
      return (a =
        -parseInt(purchaseQty) * parseFloat(productsUnitCost) +
        parseFloat(productsUnitPrice) * parseInt(salesQty));
    }, 0);
    setSalesAmount(salesqty);
    console.log("salesqty is " + salesqty);
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
        <input required type="date" name="" id="dateIdTransaction" />
        <button type="submit" className="searchView">
          View
        </button>
      </form>
      <table border="1" id="TransactionTable">
        <tr>
          <th>Product name</th>
          <th>Unit price</th>
          <th>Sold Qty</th>
          <th>Total sales</th>
          <th>Unit Cost</th>
          <th>purchase Qty</th>
          <th>Total Purchase</th>
          <th>Broken</th>
          <th>Inventory</th>
          <th>Description</th>
        </tr>
        {FetchedDatas?.map((Items) => {
          console.log(Items);
          return (
            <tr id={"tr_" + Items.transactionId} key={Items.transactionId}>
              <td> {Items.productName}</td>
              <td>
                <input
                  name="unitPrice"
                  id={"unitPrice_" + Items.transactionId}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                />
              </td>
              <td>
                <input
                  name="salesQty"
                  id={"salesQty_" + Items.transactionId}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                />
              </td>
              <td>
                <input
                  name="totalSales"
                  id={"totalSales_" + Items.transactionId}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                  value={Items.salesQty * Items.unitPrice}
                />
              </td>
              <td>
                <input
                  name="unitCost"
                  id={"unitCost_" + Items.transactionId}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                />
              </td>
              <td>
                <input
                  name="purchaseQty"
                  id={"purchaseQty_" + Items.transactionId}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                />
              </td>
              <td>
                <input
                  name="totalCost"
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                  value={Items.purchaseQty * Items.unitCost}
                />
              </td>
              <td>
                <input
                  name="broken"
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                  id={"broken_" + Items.transactionId}
                />
              </td>
              <td>
                <input
                  name="inventory"
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                  id={"inventory_" + Items.transactionId}
                />
              </td>
              <td>
                <textarea
                  id={"description_" + Items.transactionId}
                  name={"description"}
                  onChange={handleChangeOnInputs}
                  className={Items.transactionId}
                ></textarea>
              </td>
              <td>
                <button
                  id={"btnUpdate_" + Items.transactionId}
                  className="updateTransactions"
                  name={Items.transactionId}
                  onClick={updateTransactionItems}
                >
                  Update
                </button>
              </td>
            </tr>
          );
        })}
        {" Sales Amount- Purchase Amount " + salesAmount}
      </table>
      <div>
        <h4 id="ExpensesLists">Expenses list</h4>
        <table className="tableExpenses">
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
          {ExpenseTransaction?.map((items) => {
            $(".tableExpenses").show();
            console.log(ExpenseTransaction);
            return (
              <tr key={items.expenseId}>
                <td>{items.costName} </td>
                <td>
                  <input
                    name=""
                    onChange={changesToupdateCosts}
                    id={"costAmount_" + items.expenseId}
                    className={items.expenseId}
                    type="text"
                    // value={items.costAmount}
                  />
                </td>
                <td>
                  <input
                    onChange={changesToupdateCosts}
                    className={items.expenseId}
                    name=""
                    id={"costDescription_" + items.expenseId}
                    type="text"
                    // value={items.costDescription}
                  />
                </td>
                <td>
                  <button
                    onClick={() => updateCosts(items.expenseId)}
                    name={items.expenseId}
                    className={"updateBtn_" + items.expenseId}
                  >
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
          {"Total expenses = " + TotalExpenses}
        </table>
        net cash flow {salesAmount - TotalExpenses}
      </div>
    </div>
  );
}
