import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SearchProducts.css";
import $ from "jquery";
function SearchProducts() {
  const [InputValue, setInputValue] = useState({});
  const [SearchedDatas, setSearchedDatas] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchTarget, setsearchTarget] = useState();

  let handleProductsInput = (e) => {
    let id = e.target.name;
    console.log(id);
    let btnId = "updateProducts_" + id;
    console.log(btnId);
    $("." + btnId).show();
  };
  let updateProductsData = (e) => {
    console.log(e.target);
    let id = e.target.id,
      ob = {},
      businessName = localStorage.getItem("businessName"),
      productCost_ = "productCost_" + id,
      productPrice_ = "productPrice_" + id,
      productName_ = "productName_" + id;
    let btnId = "updateProducts_" + id;
    ob.productPrice = $("#" + productPrice_).val();
    ob.productName = $("#" + productName_).val();
    ob.productCost = $("#" + productCost_).val();
    ob.id = id;
    ob.businessName = businessName;
    let serverAddress = localStorage.getItem("targetUrl");
    let response = axios
      .post(serverAddress + "updateProducts/", ob)
      .then((datas) => {
        $("." + btnId).hide();
        if ((datas.data.data = "updated well")) {
          alert("updated well");
        }
      });
  };
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  let submitSearch = async (e) => {
    console.log("InputValue", InputValue.productName);
    e.preventDefault();
    if (InputValue.selectSearches == "TRANSACTION") {
      if (InputValue.productName == "" || InputValue.productName == undefined) {
        alert("please type product name first");
        // $("input").prop("required", true);
        // toDate: '', fromDate:
        $("#searchInputs").css({ backgroundColor: "red" });
        return;
      }
      if (InputValue.toDate == "" || InputValue.fromDate == "") {
        alert("date is mandatory");
        $("#fromDate").css({ backgroundColor: "red" });
        $("#toDate").css({ backgroundColor: "red" });
        return;
      }
    }
    if (InputValue.selectSearches == "") {
      if (InputValue.toDate == "" || InputValue.fromDate == "") {
        alert("date is mandatory");
        $("#fromDate").css({ backgroundColor: "red" });
        $("#toDate").css({ backgroundColor: "red" });
        return;
      }
    }
    let response = await axios.post(serverAddress + "searchProducts/", {
      InputValue,
    });
    console.log("response", response);
    $("table").hide();
    if (response.data.data == "Bad request.") {
      alert("Bad request");
      return;
    }
    console.log("response.data ");
    console.log(response.data);
    console.log("searchTarget", searchTarget);
    if (searchTarget == "PRODUCTS") {
      $("#savedProduct").show();
      setSearchedProducts(response.data.products);
    } else {
      $("#productTransaction").show();
      setSearchedDatas(response.data.data);
      if (searchTarget == "ALLTRANSACTION") {
        $("#searchInputs").hide();
      } else {
        // alert("wrong selecttions");
      }
    }
  };
  let getInputValues = (e) => {
    let value = e.target.value,
      name = e.target.name;
    console.log(e.target.id);
    $("#" + e.target.id).css({ backgroundColor: "" });
    businessName = localStorage.getItem("businessName");
    setInputValue({ ...InputValue, [name]: value, businessName });
  };
  useEffect(() => {
    console.log("searchTarget");
    console.log(searchTarget);
    // SearchedDatas,searchedProducts
    //
    $("table").hide();
    if (searchTarget == "PRODUCTS") {
      console.log("searchedProducts.length " + searchedProducts.length);
      if (searchedProducts.length > 0) {
        console.log("show products");
        $("#savedProduct").show();
      }
    } else if (searchTarget == "TRANSACTION") {
      console.log("SearchedDatas.length " + SearchedDatas.length);
      if (SearchedDatas.length > 0) {
        $("#productTransaction").show();
        console.log("show transactions ");
      }
    } else {
    }
  }, [searchTarget]);

  useEffect(() => {
    businessName = localStorage.getItem("businessName");
    let fromDate = $("#fromDate").val(),
      toDate = $("#toDate").val(),
      selectSearches = $("#selectSearches").val();
    setInputValue({
      ...InputValue,
      businessName,
      toDate,
      fromDate,
      selectSearches,
    });
    handleChangeInSelect();
  }, []);

  let showEachValues = () => {
    $(".tableRows").remove();
    $("#productTransaction").show("");
    console.log("SearchedDatas", SearchedDatas);
    if (SearchedDatas.length == 0) {
      // alert("no data found");
      return;
    }
    let showEachItems = $("#showEachItems").is(":checked");
    console.log("showEachItems", showEachItems);
    let Data = SearchedDatas;
    Data.sort((a, b) =>
      a.productName > b.productName ? 1 : b.productName > a.productName ? -1 : 0
    );
    let appendCounter = 0;
    Data?.map((items) => {
      let purchaseQty = 0,
        salesQty = 0,
        Inventory = 0,
        wrickages = 0,
        description = " , ";

      if (!showEachItems) {
        // loop is used to collect same datas(same ProductId),
        for (let i = 0; i < Data.length; i++) {
          if (items.ProductId == Data[i].ProductId) {
            Inventory = Inventory + Data[i].Inventory;
            wrickages = wrickages + Data[i].wrickages;
            purchaseQty = purchaseQty + Data[i].purchaseQty;
            salesQty = salesQty + Data[i].salesQty;
            description = description + " " + Data[i].description;
          }
        }
      } else {
        purchaseQty = items.purchaseQty;
        wrickages = items.wrickages;
        salesQty = items.salesQty;
        Inventory = items.Inventory;
      }

      console.log(items.transactionId);
      let id = items.transactionId;
      let trId = "trId_" + items.transactionId;
      if (!showEachItems) {
        trId = "trId_" + items.ProductId;
      }
      $("#" + trId).remove();
      let tr = `<tr id='${trId}' class='tableRows'> 
              <td>
                <input id='productName_${items.transactionId}' type="text" />
              </td>
              <td>${items.registeredTime.split("T")[0]}</td>
              <td>
                <input id='unitPrice_${items.transactionId}' type="text" />
              </td>

              <td>
                <input id='salesQty_${items.transactionId}' type="text" />
              </td>
              <td>
                <input id='totalSales_${items.transactionId}' type="text" />
              </td>
              <td>
                <input id='unitCost_${items.transactionId}' type="text" />
              </td>
              <td>
                <input id='purchaseQty_${items.transactionId}' type="text" />
              </td>

              <td>
                <input
                  id='totalPurchase_${items.transactionId}'
                  type="text"
                />
              </td>
              <td>
                <input id='wrickages_${items.transactionId}' type="text" />
              </td>
              <td>
                <input id='Inventory_${items.transactionId}' type="text" />
              </td>
              <td>
                <input id='Description_${items.transactionId}' type="text" />
              </td>
            </tr>`;
      $("#productTransaction").append(tr);
      $("#purchaseQty_" + id).val(purchaseQty);
      $("#wrickages_" + id).val(wrickages);
      $("#totalPurchase_" + id).val(purchaseQty * items.unitCost);
      $("#unitCost_" + id).val(items.unitCost);
      $("#totalSales_" + id).val(items.unitPrice * salesQty);
      $("#salesQty_" + id).val(salesQty);
      $("#unitPrice_" + id).val(items.unitPrice);
      $("#productName_" + id).val(items.productName);
      $("#Inventory_" + id).val(Inventory);
      $("#Description_" + id).val(items.description);
    });
  };
  useEffect(() => {
    showEachValues();
  }, [SearchedDatas]);
  /////////////////////////////
  useEffect(() => {
    searchedProducts?.map((items) => {
      $("#productName_" + items.ProductId).val(items.productName);
      $("#productPrice_" + items.ProductId).val(items.productsUnitPrice);
      $("#productCost_" + items.ProductId).val(items.productsUnitCost);
    });
  }, [searchedProducts]);
  let handleChangeInSelect = (e) => {
    console.log(e);
    if (e != undefined) {
      let selectSearches = $("#selectSearches").val();
      setInputValue({
        ...InputValue,
        selectSearches,
      });
    }
    let value = "";
    if (e == undefined) {
      value = "TRANSACTION";
    } else {
      value = e.target.value;
    }
    setsearchTarget(value);

    if (value == "PRODUCTS") {
      $(".searchInputs").hide();
    } else if (value == "ALLTRANSACTION") {
      $("#searchInputs").hide();
      $(".searchInputs").css("display", "flex");
    } else if (value == "TRANSACTION") {
      $(".searchInputs").show();
      $("#searchInputs").show();
      $(".searchInputs").css("display", "flex");
      // display: flex;
    } else {
      alert("unkown choise 2020");
    }
  };
  return (
    <div>
      {console.log(InputValue)}
      <form onSubmit={submitSearch} id="searchProduct">
        <select onChange={handleChangeInSelect} name="" id="selectSearches">
          <option value="TRANSACTION">SINGLE TRANSACTION</option>
          <option value="ALLTRANSACTION">ALL TRANSACTION</option>
          <option value="PRODUCTS">PRODUCTS</option>
        </select>
        <div className="searchInputs">
          <input
            name="productName"
            id="searchInputs"
            onChange={getInputValues}
            placeholder="product Name"
            type="text"
          />
          From Date
          <input
            id="fromDate"
            name="fromDate"
            type="date"
            onChange={getInputValues}
          />
          To Date{" "}
          <input
            id="toDate"
            name="toDate"
            type="date"
            onChange={getInputValues}
          />
        </div>
        <input className="searchBtn" type="submit" value={"Search"} />
      </form>
      <div>
        Show Each transaction{" "}
        <input id="showEachItems" onChange={showEachValues} type="checkbox" />
      </div>
      <table id="productTransaction">
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
        </tr>
        {/* {SearchedDatas?.map((items) => {
          return (
            <tr>
              {console.log(items.transactionId)}
              <td>
                <input id={"productName_" + items.transactionId} type="text" />
              </td>
              <td>{items.registeredTime.split("T")[0]}</td>
              <td>
                <input id={"unitPrice_" + items.transactionId} type="text" />
              </td>

              <td>
                <input id={"salesQty_" + items.transactionId} type="text" />
              </td>
              <td>
                <input id={"totalSales_" + items.transactionId} type="text" />
              </td>
              <td>
                <input id={"unitCost_" + items.transactionId} type="text" />
              </td>
              <td>
                <input id={"purchaseQty_" + items.transactionId} type="text" />
              </td>

              <td>
                <input
                  id={"totalPurchase_" + items.transactionId}
                  type="text"
                />
              </td>
              <td>
                <input id={"wrickages_" + items.transactionId} type="text" />
              </td>
              <td>
                <input id={"Inventory_" + items.transactionId} type="text" />
              </td>
              <td>
                <input id={"Description_" + items.transactionId} type="text" />
              </td>
            </tr>
          );
        })} */}
      </table>
      <table id="savedProduct">
        <tr>
          <th>product Name</th>
          <th>product Price</th>
          <th>product Cost</th>
        </tr>
        {searchedProducts?.map((items) => {
          console.log(items);
          return (
            <tr className="trProductName">
              <td>
                <input
                  name={items.ProductId}
                  onChange={handleProductsInput}
                  id={"productName_" + items.ProductId}
                  type="text"
                />
              </td>
              <td>
                <input
                  name={items.ProductId}
                  onChange={handleProductsInput}
                  id={"productPrice_" + items.ProductId}
                  type="text"
                />
              </td>

              <td>
                <input
                  name={items.ProductId}
                  onChange={handleProductsInput}
                  id={"productCost_" + items.ProductId}
                  type="text"
                />
              </td>
              <td>
                <div
                  onClick={updateProductsData}
                  id={items.ProductId}
                  className={"updateProducts updateProducts_" + items.ProductId}
                >
                  UPDATE
                </div>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}

export default SearchProducts;
