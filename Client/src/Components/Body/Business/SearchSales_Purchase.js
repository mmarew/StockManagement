import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import SearchExpenceTransaction from "./SearchExpenceTransaction";
function SearchSingleTransActions({ response, requestFrom }) {
  let openedBusiness = localStorage.getItem("openedBusiness");
  let businessName = localStorage.getItem("businessName");
  const [showEachItems, setshowEachItems] = useState(false);
  const [ShowExpences, setShowExpences] = useState();
  const [SearchedDatas, setSearchedDatas] = useState([]);
  let token = localStorage.getItem("storeToken");
  let deleteSales_purchase = async (items) => {
    items.businessName = businessName;
    items.token = token;
    console.log(items);
    let responce = await axios.post(
      serverAddress + "deleteSales_purchase/",
      items
    );
    console.log("responce=== ", responce);
    let x = [];
    ListOfSalesAndPurchase.map((unit) => {
      if (unit == items) {
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
  useEffect(() => {
    console.log("first showEachValuesofSalesAndPurchase");
    let getSingleTransAction = async () => {
      let resData = response.data.data.map((items) => {
        return { ...items, contentEditable: false };
      });
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
        <input
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
        <table id="productTransaction">
          <tr>
            <td colSpan={15}>
              <h3>purchase , sales, inventory and description table</h3>
            </td>
          </tr>
          <tr>
            <th>Product name</th>
            <th>Registration Date</th>
            <th>Unit price</th>
            <th>Sold Qty</th>
            <th>Total sales</th>
            <th>Unit Cost</th>
            <th>purchase Qty</th>
            <th>Total Purchase</th>
            <th>Broken</th>
            <th>Inventory</th>
            <th>Description</th>
            <th colSpan={2}>Action</th>
            <th>Status</th>
          </tr>
          {ListOfSalesAndPurchase?.map((items, index) => {
            return (
              <tr className={"searchedDatas  Transaction_" + index}>
                <td id={"productName_" + items.transactionId} type="text">
                  {items.productName}
                </td>
                <td
                  type="text"
                  id={"RegistrationDate_" + items.transactionId}
                  className={
                    items.contentEditable && "date" + items.transactionId
                  }
                >
                  {items.registeredTime.split("T")[0]}
                </td>
                <td
                  className={"unitPrice" + items.transactionId}
                  id={"unitPrice_" + items.transactionId}
                  type="text"
                >
                  {items.productsUnitPrice}
                </td>
                <td
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
                </td>
                <td
                  className={`totalSales${items.transactionId}`}
                  id={"totalSales_" + items.transactionId}
                  type="text"
                >
                  {items.salesQty * items.productsUnitPrice}
                </td>
                <td
                  className={`unitCost${items.transactionId}`}
                  name="unitCost"
                  id={"unitCost_" + items.transactionId}
                  type="text"
                >
                  {items.unitCost}
                </td>
                <td
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
                </td>
                <td
                  className={`totalCost${items.transactionId}`}
                  name="totalCost"
                  id={"totalPurchase_" + items.transactionId}
                  type="text"
                >
                  {items.unitCost * items.purchaseQty}
                </td>
                <td
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
                </td>
                <td
                  className={`inventory${items.transactionId}`}
                  id={"Inventory_" + items.transactionId}
                  type="text"
                >
                  {items.Inventory}
                </td>
                <td
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
                </td>
                {showEachItems ? (
                  !items.contentEditable ? (
                    openedBusiness == "myBusiness" && (
                      <>
                        <td
                          className="cancelOrEditTransaction"
                          onClick={(e) => editSalesAndPurchase(e, index)}
                        >
                          Edit
                        </td>
                        <td onClick={() => deleteSales_purchase(items)}>
                          Delete
                        </td>
                      </>
                    )
                  ) : (
                    <td
                      className="cancelOrEditTransaction"
                      onClick={(e) => cancelSalesAndPurchase(e, index)}
                    >
                      cancel
                    </td>
                  )
                ) : (
                  <td></td>
                )}
                {items.updateEditedContent ? (
                  <td>
                    <span
                      className="updateTransaction"
                      id={"updateId_" + index}
                      onClick={(e) =>
                        updateTransactions(items.transactionId, index)
                      }
                    >
                      Update
                    </span>
                  </td>
                ) : (
                  <td> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
                )}
              </tr>
            );
          })}
          <tr>
            <td colSpan={2}></td>
            <td colSpan={2}>Sum of Sales</td>
            <td>{TotalSalesRevenue}</td>
            <td colSpan={2}>Sum of Purchase</td>
            <td>{TotalPurchaseCost}</td>
            <td colSpan={5}></td>
          </tr>
        </table>
      )}
      {requestFrom == "showExpencesList" && ShowExpences}
    </div>
  );
}

export default SearchSingleTransActions;
