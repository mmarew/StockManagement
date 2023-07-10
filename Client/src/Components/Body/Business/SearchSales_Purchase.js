import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import SearchExpenceTransaction from "./SearchExpenceTransaction";
import SearchSales_PurchaseCss from "./SearchSales_Purchase.module.css";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ConfirmDialog from "../Others/Confirm";
function SearchSingleTransActions({ response, requestFrom }) {
  let openedBusiness = localStorage.getItem("openedBusiness");
  let businessName = localStorage.getItem("businessName");
  const [showEachItems, setshowEachItems] = useState(false);
  const [ShowExpences, setShowExpences] = useState();
  const [SearchedDatas, setSearchedDatas] = useState([]);
  const [ShowConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ConfirmDeletePurchaseAndSales, setConfirmDeletePurchaseAndSales] =
    useState({ Delete: false });
  useEffect(() => {
    let confirmDelete = ConfirmDeletePurchaseAndSales.Delete,
      deletableItems = ConfirmDeletePurchaseAndSales.items;
    console.log(
      "confirmDelete= ",
      confirmDelete,
      "ShowConfirmDialog",
      ShowConfirmDialog
    );
    if (confirmDelete) {
      let deleteData = async () => {
        let responce = await axios.post(
          serverAddress + "deleteSales_purchase/",
          { items: deletableItems }
        );
        console.log("responce=== ", responce);
        let x = [];
        ListOfSalesAndPurchase.map((unit) => {
          if (unit == deletableItems) {
            // dont return items
          } else {
            x.push(unit);
            return { ...unit };
          }
        });
        console.log(x);
        if (responce.data.data == "deleted") {
          alert("your data is deleted successfully. thank you");
          setListOfSalesAndPurchase(x);
        } else if (responce.data.data == "NotAllowedByYou") {
          alert("You are not allowed to do this. thank you");
        } else {
          alert("clientErr1010:");
        }
      };
      setShowConfirmDialog(false);
      setConfirmDeletePurchaseAndSales({ Delete: false });
      deleteData();
    }
  }, [ConfirmDeletePurchaseAndSales]);

  let token = localStorage.getItem("storeToken");
  let deleteSales_purchase = async (items) => {
    items.businessName = businessName;
    items.token = token;
    console.log(items);
    setConfirmDeletePurchaseAndSales({
      ...ConfirmDeletePurchaseAndSales,
      items,
    });
    setShowConfirmDialog(true);
    return;
  };
  useEffect(() => {
    console.log("first showEachValuesofSalesAndPurchase");

    let getSingleTransAction = async () => {
      let totalPurchaseCost = 0,
        totalSalesAmt = 0;
      let resData = response.data.data.map((items) => {
        // unitCost: 2500;
        // salesQty: 631;
        // purchaseQty: 10472;
        // productsUnitCost: 300;
        // productsUnitPrice: 350;
        totalSalesAmt +=
          parseFloat(items.salesQty) * parseFloat(items.productsUnitPrice);
        totalPurchaseCost +=
          parseFloat(items.purchaseQty) * parseFloat(items.productsUnitCost);
        console.log("items in getSingleTransAction", items);
        return { ...items, contentEditable: false };
      });

      setTotalPurchaseCost(totalPurchaseCost);
      setTotalSalesRevenue(totalSalesAmt);
      setSearchedDatas(resData);
      $("#productTransaction").css("display", "block");
    };
    getSingleTransAction();
    setShowExpences(
      <SearchExpenceTransaction
        showEachItems={showEachItems}
        response={response}
        setshowEachItems={setshowEachItems}
      />
    );
  }, []);

  const [TotalPurchaseCost, setTotalPurchaseCost] = useState(0);
  const [TotalSalesRevenue, setTotalSalesRevenue] = useState(0);
  let serverAddress = localStorage.getItem("targetUrl");
  const [ListOfSalesAndPurchase, setListOfSalesAndPurchase] = useState([]);
  // const [showEachItems, setshowEachItems] = useState(false);
  useEffect(() => {
    setShowExpences(
      <SearchExpenceTransaction
        showEachItems={showEachItems}
        response={response}
        setshowEachItems={setshowEachItems}
      />
    );
  }, [showEachItems]);

  function showEachValuesofSalesAndPurchase() {
    let showEachUnits = $("#showEachItems").is(":checked");
    setshowEachItems(showEachUnits);
    if (showEachUnits) {
      SearchedDatas.map((item) => {
        if (item.description == null) {
          item.description = "";
        }
        // return (item.isSingleItem = true);
      });
      setListOfSalesAndPurchase(SearchedDatas);
    } else {
      let collectedArray = [];
      let copyOfData = SearchedDatas.map((j) => {
        if (j.description == null) {
          j.description = "";
        }
        return { ...j, contentEditable: false };
      });

      SearchedDatas.map((item, index) => {
        if (item.description == null) {
          item.description = "";
        }
        let purchaseQty = 0,
          salesQty = 0,
          wrickages = 0,
          registeredTime = "",
          description = "";
        let x = "";
        let isIncluded = false;
        // check if item is collected before
        collectedArray.map((i) => {
          if (item.ProductId == i.ProductId) {
            isIncluded = true;
          }
        });
        if (isIncluded) return;
        copyOfData?.map((transaction) => {
          if (item.ProductId == transaction.ProductId) {
            purchaseQty += transaction.purchaseQty;
            salesQty += transaction.salesQty;
            wrickages += transaction.wrickages;
            registeredTime += transaction.registeredTime.split("T")[0] + ", ";

            description += transaction.description + ", ";
            x = transaction;
          }
        });
        registeredTime = registeredTime.slice(0, -2);
        description = description.slice(0, -2);
        // return;
        x.registeredTime = registeredTime;
        x.salesQty = salesQty;
        x.wrickages = wrickages;
        x.description = description;
        x.purchaseQty = purchaseQty;
        collectedArray.push(x);
        setListOfSalesAndPurchase(collectedArray);
      });
    }
  }

  useEffect(() => {
    // console.log("in useEffect");
    showEachValuesofSalesAndPurchase();
  }, [SearchedDatas]);

  let changesOnInputsOfTransaction = (updateId, index) => {
    console.log(updateId);
    $(".updateTransaction").hide();
    $("#" + updateId).show();
    let x = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        console.log(item);
        return { ...item, updateEditedContent: true };
      }
      return item;
    });
    setListOfSalesAndPurchase(x);
  };
  let editSalesAndPurchase = (e, index) => {
    console.log(e);
    let mapedList = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        console.log(item);
        return { ...item, contentEditable: true };
      }
      return item;
    });
    setListOfSalesAndPurchase(mapedList);
  };
  let cancelSalesAndPurchase = (e, index) => {
    let mapedList = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        console.log(item);
        return {
          ...item,
          contentEditable: false,
          updateEditedContent: false,
        };
      }
      return item;
    });
    setListOfSalesAndPurchase(mapedList);
  };
  let updateTransactions = async (transactionId, index) => {
    let OB = {};
    const tdElements = document.querySelectorAll(`.Transaction_${index} td`);
    let id = "";
    for (const tdElement of tdElements) {
      console.log(`Class: ${tdElement.className}`);
      let className = tdElement.className.split(" ")[0];
      console.log(className);
      className = className.replace(transactionId, "");
      console.log(`ID: ${tdElement.id}`);
      id = tdElement.id;
      console.log(id);
      if (id != "") {
        let doc = $("#" + id).text();
        console.log(doc);
        OB[className] = doc;
      }
      // console.log(`Name: ${tdElement.name || ""}`);
    }
    OB = { ...OB, businessName };
    OB.trasactionId = transactionId;
    console.log("OB", OB);
    // return;
    $(".LinearProgress").css("display", "block");
    let updates = await axios
      .post(serverAddress + "updateTransactions/", OB)
      .then((data) => {
        console.log(data);
        alert("updated well");
      });
    $(".LinearProgress").css("display", "none");
    let mapedList = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        console.log(item);
        return {
          ...item,
          contentEditable: false,
          updateEditedContent: false,
        };
      }
      return item;
    });
    setListOfSalesAndPurchase(mapedList);
  };
  //

  return (
    <div>
      <div className="">
        <br />
        <Checkbox
          id="showEachItems"
          onChange={showEachValuesofSalesAndPurchase}
          type="checkbox"
        />
        &nbsp;
        {"Show Each transaction"}
        <br />
        <br />
      </div>
      {ListOfSalesAndPurchase.length > 0 && (
        <TableContainer>
          <Table id="productTransaction">
            <TableHead>
              <TableRow>
                <TableCell colSpan={15}>
                  <h3>purchase , sales, inventory and description table</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableRow>
              <TableCell>Product name</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Unit price</TableCell>
              <TableCell>Sold Qty</TableCell>
              <TableCell>Total sales</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>purchase Qty</TableCell>
              <TableCell>Total Purchase</TableCell>
              <TableCell>Broken</TableCell>
              <TableCell>Inventory</TableCell>
              <TableCell>Description</TableCell>
              <TableCell colSpan={2}>Action</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
            <TableBody>
              {ListOfSalesAndPurchase?.map((items, index) => {
                return (
                  <TableRow
                    className={
                      SearchSales_PurchaseCss.searchedDatas +
                      " Transaction_" +
                      index
                    }
                  >
                    <TableCell
                      id={"productName_" + items.transactionId}
                      type="text"
                    >
                      {items.productName}
                    </TableCell>
                    <TableCell
                      type="text"
                      id={"RegistrationDate_" + items.transactionId}
                      className={
                        items.contentEditable && "date" + items.transactionId
                      }
                    >
                      {items.registeredTime.split("T")[0]}
                    </TableCell>
                    <TableCell
                      className={"unitPrice" + items.transactionId}
                      id={"unitPrice_" + items.transactionId}
                      type="text"
                    >
                      {items.productsUnitPrice}
                    </TableCell>
                    <TableCell
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `salesQty${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"salesQty_" + items.transactionId}
                      type="text"
                    >
                      {items.salesQty}
                    </TableCell>
                    <TableCell
                      className={`totalSales${items.transactionId}`}
                      id={"totalSales_" + items.transactionId}
                      type="text"
                    >
                      {items.salesQty * items.productsUnitPrice}
                    </TableCell>
                    <TableCell
                      className={`unitCost${items.transactionId}`}
                      name="unitCost"
                      id={"unitCost_" + items.transactionId}
                      type="text"
                    >
                      {items.unitCost}
                    </TableCell>
                    <TableCell
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `purchaseQty${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"purchaseQty_" + items.transactionId}
                      type="text"
                      name="purchaseQty"
                    >
                      {items.purchaseQty}
                    </TableCell>
                    <TableCell
                      className={`totalCost${items.transactionId}`}
                      name="totalCost"
                      id={"totalPurchase_" + items.transactionId}
                      type="text"
                    >
                      {items.unitCost * items.purchaseQty}
                    </TableCell>
                    <TableCell
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `broken${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"wrickages_" + items.transactionId}
                      type="text"
                      name="broken"
                    >
                      {items.wrickages}
                    </TableCell>
                    <TableCell
                      className={`inventory${items.transactionId}`}
                      id={"Inventory_" + items.transactionId}
                      type="text"
                    >
                      {items.Inventory}
                    </TableCell>
                    <TableCell
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable
                          ? `description${items.transactionId} editableTD`
                          : ""
                      }
                      contentEditable={items.contentEditable}
                      id={"Description_" + items.transactionId}
                      type="text"
                      name="description"
                    >
                      {items.description}
                    </TableCell>
                    {showEachItems ? (
                      !items.contentEditable ? (
                        openedBusiness == "myBusiness" && (
                          <>
                            <TableCell
                              className="cancelOrEditTransaction"
                              onClick={(e) => editSalesAndPurchase(e, index)}
                            >
                              <Button>Edit</Button>
                            </TableCell>
                            <TableCell
                              onClick={() => deleteSales_purchase(items)}
                            >
                              <Button>Delete</Button>
                            </TableCell>
                          </>
                        )
                      ) : (
                        <TableCell
                          className="cancelOrEditTransaction"
                          onClick={(e) => cancelSalesAndPurchase(e, index)}
                        >
                          <Button>cancel</Button>
                        </TableCell>
                      )
                    ) : (
                      <TableCell></TableCell>
                    )}
                    {items.updateEditedContent ? (
                      <TableCell>
                        <span
                          className="updateTransaction"
                          id={"updateId_" + index}
                          onClick={(e) =>
                            updateTransactions(items.transactionId, index)
                          }
                        >
                          Update
                        </span>
                      </TableCell>
                    ) : (
                      <TableCell>&nbsp;</TableCell>
                    )}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell colSpan={2}>Sum of Sales</TableCell>
                <TableCell>{TotalSalesRevenue}</TableCell>
                <TableCell colSpan={2}>Sum of Purchase</TableCell>
                <TableCell>{TotalPurchaseCost}</TableCell>
                <TableCell colSpan={5}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {requestFrom == "showExpencesList" && ShowExpences}
      {console.log("ShowConfirmDialog == ", ShowConfirmDialog)}
      {ShowConfirmDialog && (
        <ConfirmDialog
          open={true}
          setShowConfirmDialog={setShowConfirmDialog}
          setConfirmDeletePurchaseAndSales={setConfirmDeletePurchaseAndSales}
        />
      )}
    </div>
  );
}

export default SearchSingleTransActions;
