import React, { useEffect, useState } from "react";
import $, { error } from "jquery";
import axios from "axios";
import SearchExpenceTransaction from "./SearchExpenceTransaction";

import { Checkbox } from "@mui/material";
import ConfirmDialog from "../Others/Confirm";
import { DateFormatter } from "../Date/currentDate";
import GetCreditLists from "./GetCreditLists";
import OpenTransactionEditorModal from "./OpenTransactionEditorModal";
import SalesAndPurchaseTable from "./SalesAndPurchaseTable";
const timeZone = "Africa/Addis_Ababa";
function SearchSales_Purchase({
  response,
  requestFrom,
  toDate,
  fromDate,
  searchTarget,
}) {
  console.log("response", response.data.data, " requestFrom === ", requestFrom);
  // return;
  // set correct data format to time because it is bringing us like registeredTime: "2023-08-05T21:00:00.000Z". The correct format is year month day
  const [viewInTable, setviewInTable] = useState(
    window.innerWidth > 768 ? true : false
  );
  //  const [viewInTable, setviewInTable] = useState(false);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setviewInTable(true);
    } else setviewInTable(false);
  });
  const [editTransactions, seteditTransactions] = useState({
    Open: false,
    item: {},
  });
  let dateData = [...response?.data?.data];
  let CollectedMoneyFromTotalSales = response.data.CollectedMoneyFromTotalSales;
  dateData.map((item) => {
    console.log("@SearchSales_Purchase item is ", item);
    item.registrationDate = DateFormatter(item.registrationDate, timeZone);
  });
  const [SearchedDatas, setSearchedDatas] = useState(dateData);

  let businessName = localStorage.getItem("businessName");
  const [UpdateSalesAndPurchase, setUpdateSalesAndPurchase] = useState({});
  const [showEachItems, setshowEachItems] = useState(false);
  const [ShowExpences, setShowExpences] = useState();
  const [ListOfSalesAndPurchase, setListOfSalesAndPurchase] = useState([]);

  let businessId = localStorage.getItem("businessId");
  const [ShowConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ConfirmDeletePurchaseAndSales, setConfirmDeletePurchaseAndSales] =
    useState({ Delete: false });
  const [confirmAction, setConfirmAction] = useState("");
  const [confirmMessages, setConfirmMessages] = useState("");
  // to delete data
  let deleteData = async (deletableItems) => {
    deletableItems.businessId = businessId;
    console.log("deletableItems", deletableItems);

    // return;

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
      console.log("clientErr1010: responce.data.data", responce.data.data);
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

  let token = localStorage.getItem("storeToken");

  // delete sales and purchases
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
        console.log("items.creditsalesQty", items.creditsalesQty);
        console.log("items.salesQty", items.salesQty);
        if (items.creditsalesQty == null || items.creditsalesQty == "null")
          items.creditsalesQty = 0;
        totalSalesAmt +=
          (parseFloat(items.salesQty) + parseFloat(items.creditsalesQty)) *
          parseFloat(items.productsUnitPrice);
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
          CollectedMoneyFromTotalSales={CollectedMoneyFromTotalSales}
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
          creditsalesQty = 0,
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
            creditsalesQty += transaction.creditsalesQty;
            salesQty += transaction.salesQty;
            wrickages += transaction.wrickages;
            registeredTime += DateFormatter(transaction.registeredTime) + ", ";
            description += transaction.description + ", ";
            x = transaction;
          }
        });

        x.creditsalesQty = creditsalesQty;
        x.registeredTime = registeredTime;
        x.salesQty = salesQty;
        x.wrickages = wrickages;
        x.description = description;
        x.purchaseQty = purchaseQty;
        collectedArray.push(x);
        // alert(JSON.stringify(x.registeredTime));
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
  const [CreditCollected, setCreditCollected] = useState([]);
  // collect data which are sold by credit based on salesTypeValues where salesTypeValues is 'credit paied' or 'On credit'
  useEffect(() => {
    let collectedCreditItems = [];
    console.log("SearchedDatas", SearchedDatas);
    SearchedDatas.map((item, index) => {
      let salesTypeValues = item.salesTypeValues;
      console.log("salesTypeValues", salesTypeValues);
      if (salesTypeValues == "credit paied") {
        collectedCreditItems.push(item);
      }
    });
    // return;

    //items sold by credit and money is collected but collection time may or may not be in search time range
    setCreditCollected(collectedCreditItems);
    // items sold by credit
  }, [SearchedDatas]);

  console.log("response of purchase and saless", response.data);
  // return "yyyyyyyyyyy";

  return (
    <div>
      {searchTarget == "ALLTRANSACTION" && (
        <>
          <Checkbox
            checked={viewInTable}
            onChange={() => setviewInTable(!viewInTable)}
          />
          View in table
          <GetCreditLists
            viewInTable={viewInTable}
            dateRange={{ fromDate: fromDate, toDate: toDate }}
          />
        </>
      )}
      <div className="">
        {response.data.data.length > 0 && (
          <>
            <br />
            <Checkbox
              id="showEachItems"
              onChange={showEachValuesofSalesAndPurchase}
              type="checkbox"
            />

            <span>Show Each transaction</span>
            <br />
            <br />
          </>
        )}
      </div>
      {console.log("ListOfSalesAndPurchase", ListOfSalesAndPurchase)}
      {
        <SalesAndPurchaseTable
          viewInTable={viewInTable}
          changesOnInputsOfTransaction={changesOnInputsOfTransaction}
          showEachItems={showEachItems}
          setshowEachItems={setshowEachItems}
          ListOfSalesAndPurchase={ListOfSalesAndPurchase}
          setListOfSalesAndPurchase={setListOfSalesAndPurchase}
          cancelSalesAndPurchase={cancelSalesAndPurchase}
          setConfirmMessages={setConfirmMessages}
          deleteSales_purchase={deleteSales_purchase}
          setConfirmAction={setConfirmAction}
          setUpdateSalesAndPurchase={setUpdateSalesAndPurchase}
          setShowConfirmDialog={setShowConfirmDialog}
          TotalSalesRevenue={TotalSalesRevenue}
          TotalPurchaseCost={TotalPurchaseCost}
          editTransactions={editTransactions}
          seteditTransactions={seteditTransactions}
        />
      }

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
      {editTransactions.Open && (
        <OpenTransactionEditorModal
          setListOfSalesAndPurchase={setListOfSalesAndPurchase}
          toDate={toDate}
          fromDate={fromDate}
          editTransactions={editTransactions}
          seteditTransactions={seteditTransactions}
        />
      )}
    </div>
  );
}

export default SearchSales_Purchase;
