import axios from "axios";
import React, { useState } from "react";
import "./AddSingleSales.css";
import currentDates from "../Date/currentDate";
function AddSingleSales() {
  const [productDetailes, setproductDetailes] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [formInputValues, setformInputValues] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});
  // get single products
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    // clear all detailes
    setproductDetailes([]);
    let responce = await axios.post("http://localhost:2020/getsingleProducts", {
      ...inputValues,
      ...{ BusinessId: localStorage.getItem("businessId") },
      ...{ businessName: localStorage.getItem("businessName") },
    });
    console.log("@getsingleProducts responce");
    console.log(responce.data.data);
    if (responce.data.data.length == 0) alert("no products found here ");
    else setSearchedProducts(responce.data.data);
  };
  let handleSalesTransactionInput = (e) => {
    console.log(e.target.value);
    setformInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
      ProductId: e.target.className,
    });
  };
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };
  let registerSinglesalesTransaction = async (e) => {
    e.preventDefault();
    let responce = await axios.post(
      "http://localhost:2020/registerSinglesalesTransaction",
      {
        ...formInputValues,
        businessId: localStorage.getItem("businessId"),
        currentDate: currentDates(),
      }
    );
    console.log(responce.data.data);
    if (responce.data.data == "successfullyRegistered") {
      alert("Successfully Registered");
    }
  };
  let showHiddenProducts = (itemsId, itemsClass) => {
    let singleTransactionForm = document.querySelectorAll(
      ".singleTransactionForm input"
    );
    // hide all forms input
    for (let i = 0; i < singleTransactionForm.length; i++) {
      singleTransactionForm[i].style.display = "none";
    }
    console.log(itemsId);
    let items = document.getElementsByClassName(itemsId);
    setformInputValues({});
    for (let i = 0; i < items.length; i++) {
      // show targeted classe only
      items[i].style.display = "block";
      console.log(items[i].name);
      if (items[i].name != "") {
        setformInputValues({
          ...formInputValues,
          [items[i].name]: items[i].value,
        });
      }
    }
  };
  let getTotalRegiters = async (targetproductId) => {
    // clear datas of product detailes
    setSearchedProducts([]);
    let businessId = localStorage.getItem("businessId");
    let businessName = localStorage.getItem("businessName");
    let responce = await axios.post(
      "http://localhost:2020/getDailyTransaction",
      {
        currentDates: currentDates(),
        businessId,
        productId: targetproductId,
        businessName,
      }
    );
    let mydata = responce.data.data;
    // setSearchedProducts(mydata);
    console.log("mydata ==== ", mydata);
    if (mydata.length == 0) {
      alert("No data on this date.");
    }
    let i = 0;
    let Description = "",
      brokenQty = 0,
      productsIdList = [],
      ProductId = "",
      dailySalesId = "",
      purchaseQty = 0,
      searchedProductsData = "",
      // searched products will be here
      registrationDate = "",
      productName = "",
      salesQty = 0;
    let prevProductId = 0,
      dailySales = {},
      productDetail = [];
    for (; i < mydata.length; i++) {
      ProductId = mydata[i].ProductId;
      if (prevProductId != ProductId) {
        brokenQty = 0;
        purchaseQty = 0;
        Description = "";
        salesQty = 0;
      }
      productName = mydata[i].productName;
      Description += mydata[i].Description + " ";
      brokenQty += mydata[i].brokenQty;
      dailySalesId = mydata[i].dailySalesId;
      purchaseQty += mydata[i].purchaseQty;
      registrationDate = mydata[i].registrationDate;
      salesQty += mydata[i].salesQty;
      console.log("productId is ", ProductId);
      dailySales["salesQuantity" + ProductId] = salesQty;
      dailySales["purchaseQty" + ProductId] = purchaseQty;
      dailySales["wrickageQty" + ProductId] = brokenQty;
      if (prevProductId != ProductId) {
        productsIdList.push({
          ProductId,
        });
        productDetail.push({
          productName: productName,
          PurchaseQty: purchaseQty,
          SalesQty: salesQty,
          BrokenQty: brokenQty,
        });
        console.log("productDetail = ", productDetail);
        prevProductId = ProductId;
      }
    }
    // setSearchedProducts(productDetail);
    setAllDailySales(dailySales);
    setproductDetailes(productDetail);
  };
  let RegiterCollectedDailyTransaction = async (e) => {
    e.preventDefault();
    let businessName = localStorage.getItem("businessName"),
      BusinessId = localStorage.getItem("businessId");
    console.log("allDailySales");
    console.log(allDailySales);
    console.log("searchedProducts");
    console.log(searchedProducts);
    let productsInfo = {
      ...allDailySales,
      businessName: businessName,
      BusinessId: BusinessId,
      ProductsList: searchedProducts,
      dates: currentDates(),
    };
    console.log("productsInfo =");
    console.log(productsInfo);
    let Response = await axios.post(
      "http://localhost:2020/registerTransaction",
      productsInfo
    );
    console.log("Response", Response.data.data);
    let datas = Response.data.data;
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      alert("successfully registered. Thank you.");
    }
  };
  return (
    <div className="singleSalesWrapper">
      {console.log("allDailySales")}
      {console.log(allDailySales)}
      <h3>search Products</h3>
      <>
        {console.log("formInputValues = > ")}
        {console.log(formInputValues)}
      </>
      <form onSubmit={handleSearchSubmit}>
        <input
          name="searchInput"
          onInput={handleSearchableProductInput}
          placeholder="Type Product Name"
          id=""
          className=""
          type={"search"}
        />
        <button type="Submit">Search</button>
      </form>
      <button onClick={() => getTotalRegiters("getAllTransaction")}>
        View All Daily Transactions
      </button>
      {searchedProducts?.map((items) => {
        return (
          <div key={items.ProductId}>
            <form
              className="singleTransactionForm"
              onSubmit={registerSinglesalesTransaction}
            >
              {console.log("searchedProducts")}
              {console.log(searchedProducts)}
              <h4>product Name: {items.productName}</h4>
              <div className="getOrRegisterProducts">
                <div
                  className={"class_" + items.ProductId + " getProducts"}
                  onClick={() => {
                    showHiddenProducts(
                      items.ProductId,
                      "class_" + items.ProductId
                    );
                  }}
                >
                  Register
                </div>
                <div
                  onClick={() => getTotalRegiters(items.ProductId)}
                  className="getProducts"
                >
                  Get
                </div>
              </div>
              <input
                className={items.ProductId}
                onInput={handleSalesTransactionInput}
                name="purchaseQty"
                placeholder="purchase quantity"
              />
              <input
                className={items.ProductId}
                onInput={handleSalesTransactionInput}
                name="salesQty"
                placeholder="Sales quantity"
              />
              <input
                className={items.ProductId}
                onInput={handleSalesTransactionInput}
                name="brokenQty"
                placeholder="Broken quantity"
              />
              <input
                className={items.ProductId}
                onInput={handleSalesTransactionInput}
                name="Description"
                placeholder="Description"
              />
              <button className={items.ProductId} type="submit">
                ADD
              </button>
            </form>
          </div>
        );
      })}

      {productDetailes.map((items) => {
        console.log(items);
        return (
          <div>
            {" Product Name: " +
              items.productName +
              ", PurchaseQty : " +
              items.PurchaseQty +
              ", SalesQty : " +
              items.SalesQty +
              ", BrokenQty :" +
              items.BrokenQty}
          </div>
        );
      })}

      {productDetailes.length > 0 && (
        <button onClick={RegiterCollectedDailyTransaction}>
          Add As Total Sales
        </button>
      )}
    </div>
  );
}
export default AddSingleSales;
