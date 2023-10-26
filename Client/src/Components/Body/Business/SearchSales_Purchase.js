import React, { useEffect, useState } from "react";
import $, { error } from "jquery";
import axios from "axios";
import SearchExpenceTransaction from "./SearchExpenceTransaction";
import SearchSales_PurchaseCss from "./SearchSales_Purchase.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ConfirmDialog from "../Others/Confirm";
import { DateFormatter } from "../Date/currentDate";
import { Chip } from "@material-ui/core";
import ShowcreditLists from "./ShowcreditLists";
import { ConsumeableContext } from "../UserContext/UserContext";
import ShowCreditCollected from "./ShowCreditCollected";
import GetCreditLists from "./GetCreditLists";
const timeZone = "Africa/Addis_Ababa";
function SearchSales_Purchase({ response, requestFrom }) {
  // set correct data format to time because it is bringing us like registeredTime: "2023-08-05T21:00:00.000Z". The correct format is year month day
  let dateData = [...response?.data?.data];
  let accountRecivableData = response.data.accountRecivableData;
  dateData.map((item) => {
    item.registeredTime = DateFormatter(item.registeredTime, timeZone);
  });
  const { accountRecivableAmt, setAccountRecivableAmt } = ConsumeableContext();
  let openedBusiness = localStorage.getItem("openedBusiness");
  let businessName = localStorage.getItem("businessName");
  const [UpdateSalesAndPurchase, setUpdateSalesAndPurchase] = useState({});
  const [showEachItems, setshowEachItems] = useState(false);
  const [ShowExpences, setShowExpences] = useState();
  const [ListOfSalesAndPurchase, setListOfSalesAndPurchase] = useState([]);
  const [SearchedDatas, setSearchedDatas] = useState(dateData);

  const [ShowConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ConfirmDeletePurchaseAndSales, setConfirmDeletePurchaseAndSales] =
    useState({ Delete: false });
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmMessages, setConfirmMessages] = useState("");
  let deleteData = async (deletableItems) => {
    let responce = await axios.post(serverAddress + "deleteSales_purchase/", {
      items: deletableItems,
    });
    let x = [];
    ListOfSalesAndPurchase.map((unit) => {
      if (unit == deletableItems) {
        // dont return items
      } else {
        x.push(unit);
        return { ...unit };
      }
    });
    if (responce.data.data == "deleted") {
      alert("your data is deleted successfully. thank you");
      setListOfSalesAndPurchase([...x]);
    } else if (responce.data.data == "NotAllowedByYou") {
      alert("You are not allowed to do this. thank you");
    } else {
      alert("clientErr1010:");
    }
  };
  useEffect(() => {
    let confirmDelete = ConfirmDeletePurchaseAndSales.Delete,
      deletableItems = ConfirmDeletePurchaseAndSales.items;

    if (confirmDelete) {
      setShowConfirmDialog(false);
      setConfirmDeletePurchaseAndSales({ Delete: false });
      deleteData(deletableItems);
    }
  }, [ConfirmDeletePurchaseAndSales]);
  useEffect(() => {
    let status = UpdateSalesAndPurchase.status,
      items = UpdateSalesAndPurchase.items,
      index = UpdateSalesAndPurchase.index;
    if (status == "Verified") {
      updateTransactions(items.transactionId, index, items.ProductId);
    }
  }, [UpdateSalesAndPurchase]);

  let token = localStorage.getItem("storeToken");
  let deleteSales_purchase = async (items) => {
    items.businessName = businessName;
    items.token = token;

    setConfirmDeletePurchaseAndSales({
      ...ConfirmDeletePurchaseAndSales,
      items,
    });

    setConfirmAction("deleteSalesPurchase");
    setConfirmMessages("Are you sure to delete this record?");
    setShowConfirmDialog(true);
    return;
  };
  const [TotalPurchaseCost, setTotalPurchaseCost] = useState(0);
  const [TotalSalesRevenue, setTotalSalesRevenue] = useState(0);
  //  setSearchedDatas([...resData]);
  useEffect(() => {
    let getSingleTransAction = async () => {
      let totalPurchaseCost = 0,
        totalSalesAmt = 0;
      let resData = response.data.data.map((items) => {
        totalSalesAmt +=
          parseFloat(items.salesQty) * parseFloat(items.productsUnitPrice);
        totalPurchaseCost +=
          parseFloat(items.purchaseQty) * parseFloat(items.productsUnitCost);
        return { ...items, contentEditable: false };
      });
      setListOfSalesAndPurchase([]);
      setSearchedDatas(resData);
      setTotalPurchaseCost(totalPurchaseCost);
      setTotalSalesRevenue(totalSalesAmt);
      setShowExpences(
        <SearchExpenceTransaction
          showEachItems={showEachItems}
          response={response}
          setshowEachItems={setshowEachItems}
          accountRecivableAmt={accountRecivableAmt}
        />
      );
      $("#productTransaction").css("display", "block");
    };
    getSingleTransAction();
  }, [response]);

  let serverAddress = localStorage.getItem("targetUrl");

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
    console.log("SearchedDatas", SearchedDatas);
    if (showEachUnits) {
      // replace null by "" in map loop
      let returnedValues = SearchedDatas.map((item) => {
        if (item.description == null) {
          item.description = "";
        }
        return item;
      });
      // list of sales and purchase after null is removed
      setListOfSalesAndPurchase([...returnedValues]);
    } else {
      let collectedArray = [];
      let copyOfData = SearchedDatas.map((j) => {
        // replace null by ""
        if (j.description == null) {
          j.description = "";
        }
        // add contentEditable false
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
        // check if an item is collected before
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
            registeredTime += transaction.registeredTime + ", ";
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
        setListOfSalesAndPurchase([...collectedArray]);
      });
    }
  }

  useEffect(() => {
    showEachValuesofSalesAndPurchase();
  }, [SearchedDatas]);

  let changesOnInputsOfTransaction = (updateId, index) => {
    $(".updateTransaction").hide();
    $("#" + updateId).show();
    let x = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        return { ...item, updateEditedContent: true };
      }
      return item;
    });
    setListOfSalesAndPurchase([...x]);
  };
  let editSalesAndPurchase = (e, index) => {
    let mapedList = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        return { ...item, contentEditable: true };
      }
      return item;
    });
    setListOfSalesAndPurchase([...mapedList]);
  };
  let cancelSalesAndPurchase = (e, index) => {
    let mapedList = ListOfSalesAndPurchase.map((item, i) => {
      if (i == index) {
        return {
          ...item,
          contentEditable: false,
          updateEditedContent: false,
        };
      }
      return item;
    });
    setListOfSalesAndPurchase([...mapedList]);
  };
  let updateTransactions = async (transactionId, index, productId) => {
    let OB = {};
    const tdElements = document.querySelectorAll(`.Transaction_${index} td`);
    let id = "";
    let salesQty = $("#salesQty_" + transactionId).text();
    let purchaseQty = $("#purchaseQty_" + transactionId).text();
    let wrickages = $("#wrickages_" + transactionId).text();
    let Description = $("#Description_" + transactionId).text();
    if (isNaN(salesQty)) {
      alert(" sales quantity should be number");
      return;
    }
    if (isNaN(wrickages)) {
      alert("Broken quantity should be number");
      return;
    }
    if (isNaN(purchaseQty)) {
      alert("Purchase quantity should be number");
      return;
    }
    let date = $("#RegistrationDate_" + transactionId).text();
    let fromDate = $("#fromDate").val();
    let toDate = $("#toDate").val();
    OB = {
      fromDate,
      toDate,
      ...OB,
      date,
      businessName,
      salesQty,
      purchaseQty,
      wrickages,
      Description,
      transactionId,
      productId,
    };

    $(".LinearProgress").css("display", "block");
    // return;
    let updates = await axios
      .post(serverAddress + "updateTransactions/", OB)
      .then((data) => {
        let mapedList = data.data.data.map((item, i) => {
          let correctDateFormat = DateFormatter(item.registeredTime);
          item.registeredTime = correctDateFormat;
          return item;
        });
        // alert(mapedList);
        setListOfSalesAndPurchase([...mapedList]);
      })
      .catch((error) => {});
    $(".LinearProgress").css("display", "none");
  };

  const [CreditList, setCreditList] = useState([]);
  const [CreditCollected, setCreditCollected] = useState([]);

  useEffect(() => {
    let itemsSoldByCredit = [],
      collectedCreditItems = [];
    ListOfSalesAndPurchase.map((item, index) => {
      let salesTypeValues = item.salesTypeValues;
      if (salesTypeValues == "credit paied") {
        collectedCreditItems.push(item);
      } else if (salesTypeValues == "On credit") {
        itemsSoldByCredit.push(item);
      } else {
      }
    });
    // return;
    setCreditCollected(collectedCreditItems);
    setCreditList(itemsSoldByCredit);
  }, [ListOfSalesAndPurchase]);

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
      <GetCreditLists />
      {/* {CreditList.length > 0 ? (
        <ShowcreditLists CreditList={CreditList} />
      ) : (
        "No item sold in credit"
      )} */}
      {CreditCollected.length > 0 && (
        <ShowCreditCollected
          CreditCollected={CreditCollected}
          accountRecivableData={accountRecivableData}
        />
      )}
      {ListOfSalesAndPurchase.length > 0 ? (
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
              <TableCell>
                {showEachItems ? " Registration Date" : " Registration Dates"}
              </TableCell>
              <TableCell>Unit price</TableCell>
              <TableCell>Sold Qty</TableCell>
              <TableCell>Sold Qty incredit</TableCell>
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
                      {items.registeredTime.split(",").map((day, index1) => {
                        return (
                          <Chip
                            style={{
                              marginTop: "5px",
                              backgroundColor: "transparent",
                            }}
                            key={"dateOfRegistration_" + index1}
                            label={day}
                          />
                        );
                      })}
                    </TableCell>
                    <TableCell
                      className={"unitPrice" + items.transactionId}
                      id={"unitPrice_" + items.transactionId}
                      type="text"
                    >
                      {items.productsUnitPrice.toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
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
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `salesQtyInCredit${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"salesQtyInCredit_" + items.transactionId}
                      type="text"
                    >
                      {items.creditsalesQty}
                    </TableCell>
                    <TableCell
                      className={`totalSales${items.transactionId}`}
                      id={"totalSales_" + items.transactionId}
                      type="text"
                    >
                      {(
                        (items.salesQty + items.creditsalesQty) *
                        items.productsUnitPrice
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </TableCell>
                    <TableCell
                      className={`unitCost${items.transactionId}`}
                      name="unitCost"
                      id={"unitCost_" + items.transactionId}
                      type="text"
                    >
                      {items.unitCost.toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
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
                      {(items.unitCost * items.purchaseQty).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "ETB",
                        }
                      )}
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
                              {openedBusiness == "myBusiness" && (
                                <EditIcon sx={{ color: "blue" }} />
                              )}
                            </TableCell>
                            <TableCell
                              onClick={() => deleteSales_purchase(items)}
                            >
                              {openedBusiness == "myBusiness" && (
                                <DeleteIcon sx={{ color: "red" }} />
                              )}
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
                        <Button
                          variant="contained"
                          color="info"
                          className="updateTransaction"
                          id={"updateId_" + index}
                          onClick={(e) => {
                            setConfirmMessages(
                              "Are you sure to update this data?"
                            );
                            setConfirmAction("updateSalesAndPurchaseData");
                            setUpdateSalesAndPurchase({
                              items,
                              index,
                              status: "notVerified",
                            });
                            setShowConfirmDialog(true);
                          }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell>&nbsp;</TableCell>
                    )}
                  </TableRow>
                );
              })}
              <TableRow
                className={SearchSales_PurchaseCss.salesPurchaseLastRow}
                style={{ backgroundColor: "#B3E5FC" }}
              >
                <TableCell colSpan={2}></TableCell>
                <TableCell colSpan={2}>Sum of Sales</TableCell>
                <TableCell>
                  {TotalSalesRevenue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </TableCell>
                <TableCell colSpan={2}>Sum of Purchase</TableCell>
                <TableCell>
                  {TotalPurchaseCost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </TableCell>
                <TableCell colSpan={2}>Sales - Purchases</TableCell>
                <TableCell>
                  {(TotalSalesRevenue - TotalPurchaseCost).toLocaleString(
                    "en-US",
                    { style: "currency", currency: "ETB" }
                  )}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <Chip
            style={{ backgroundColor: "rgba(255, 0, 0, 0.2)", color: "red" }}
            label={<h3>On this date no sales and purchase transaction</h3>}
          />
          {}
        </>
      )}
      {requestFrom == "showExpencesList" && ShowExpences}
      {ShowConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          message={confirmMessages}
          open={ShowConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
          onConfirm={
            confirmAction == "deleteSalesPurchase"
              ? setConfirmDeletePurchaseAndSales
              : setUpdateSalesAndPurchase
          }
        />
      )}
    </div>
  );
}

export default SearchSales_Purchase;
