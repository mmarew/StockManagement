import axios from "axios";
import React, { useEffect, useState } from "react";
import singleSalesCss from "./AddSingleSales.module.css";
import $ from "jquery";
import currentDates from "../Date/currentDate";
import { Button } from "@material-ui/core";
import { Input, TextField } from "@mui/material";
function AddSingleSales() {
  // setShowHiddenProducts;
  const [showHiddenProducts, setShowHiddenProducts] = useState(false);
  const [DailyTransaction, setDailyTransaction] = useState([]);
  let serverAddress = localStorage.getItem("targetUrl");
  const [productDetailes, setproductDetailes] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [formInputValues, setformInputValues] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});
  // get single products
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    // clear all detailes of product
    setproductDetailes([]);
    $(".LinearProgress").css("display", "block");
    let singleSalesDate = $("#singleSalesDate").val();
    let responce = await axios.post(serverAddress + "getsingleProducts/", {
      ...singleSalesDate,
      ...inputValues,
      ...{ BusinessId: localStorage.getItem("businessId") },
      ...{ businessName: localStorage.getItem("businessName") },
    });
    console.log("@getsingleProducts responce");
    console.log(responce.data.data);
    if (responce.data.data.length == 0) alert("No products found here ");
    else setSearchedProducts(responce.data.data);
    $(".LinearProgress").hide();
  };
  let handleSalesTransactionInput = (e) => {
    console.log(e.target.value);
    setformInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
      ProductId: e.target.className,
    });
  };
  // collect input values of search form
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };
  let registerSinglesalesTransaction = async (e) => {
    e.preventDefault();
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(
      serverAddress + "registerSinglesalesTransaction/",
      {
        // registerTransaction
        ...formInputValues,
        businessId: localStorage.getItem("businessId"),
        currentDate: $("#singleSalesDate").val(),
      }
    );
    console.log(responce.data.data);
    if (responce.data.data == "successfullyRegistered") {
      alert("Successfully Registered");
      $(".dailyRegistrationInputs").val("");
    }
    $(".LinearProgress").hide();
  };
  let showHiddenProducts1 = (itemsId, itemsClass) => {
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
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "getDailyTransaction/", {
      currentDates: $("#singleSalesDate").val(),
      businessId,
      productId: targetproductId,
      businessName,
    });
    let mydata = responce.data.data;
    console.log("mydata is == ", responce.data);
    let array;
    // mydata?.map((item) => {});
    // setDailyTransaction(mydata);
    // setSearchedProducts(mydata);
    if (mydata.length == 0) {
      alert("There is no registered data on this date.");
    }

    $(".LinearProgress").hide();
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
      productDetail = [],
      mydataLength = mydata.length;
    // collect same products to add qty
    for (; i < mydataLength; i++) {
      ProductId = mydata[i].ProductId;
      //reset summing process to 0 or ''
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
      // collect products id only
      if (prevProductId != ProductId) {
        productsIdList.push({
          ProductId,
        });
      }
      // to get last collection
      productDetail[0] = {
        productName: productName,
        PurchaseQty: purchaseQty,
        SalesQty: salesQty,
        BrokenQty: brokenQty,
      };

      console.log("productDetail = ", productDetail);
      prevProductId = ProductId;
    }
    // To make collections on multiple single item sales
    setAllDailySales(dailySales);
    setproductDetailes(mydata);
    setDailyTransaction(mydata);
  };
  let RegiterCollectedDailyTransaction = async (e) => {
    e.preventDefault();
    let serverAddress = localStorage.getItem("targetUrl");
    let businessName = localStorage.getItem("businessName"),
      BusinessId = localStorage.getItem("businessId");
    let productsInfo = {
      ...allDailySales,
      businessName: businessName,
      BusinessId: BusinessId,
      // it is only information of product and no need of repetation is nedded
      ProductsList: [DailyTransaction[0]],
      dates: $("#singleSalesDate").val(),
    };
    console.log("productsInfo =");
    console.log(productsInfo);
    // return;
    $(".LinearProgress").css("display", "block");
    let Response = await axios.post(
      serverAddress + "registerTransaction/",
      productsInfo
    );
    console.log("Response", Response);
    let datas = Response.data.data;
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      alert("successfully registered. Thank you.");
    }
    $(".LinearProgress").hide();
  };
  useEffect(() => {
    $("#singleSalesDate").val(currentDates());
    $(".LinearProgress").css("display", "none");
  }, []);

  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      <form
        className={singleSalesCss.formToSearchItems}
        form
        onSubmit={handleSearchSubmit}
      >
        <h3>Search Products</h3>
        <TextField
          label="Date "
          name="singleSalesDate"
          id="singleSalesDate"
          type="date"
        />
        <br />
        <TextField
          required
          name="searchInput"
          onInput={handleSearchableProductInput}
          label="Type Product Name"
          id=""
          className=""
          type={"search"}
        />
        <br />
        <Button color="primary" variant="contained" type="Submit">
          Search
        </Button>
      </form>
      {/* <button onClick={() => getTotalRegiters("getAllTransaction")}>
        View All Daily Transactions
      </button> */}
      {searchedProducts.length > 0 && (
        <div className={singleSalesCss.searchedProductsLists}>
          {searchedProducts?.map((items) => {
            return (
              <div key={items.ProductId}>
                <form
                  className={singleSalesCss.singleTransactionForm}
                  onSubmit={registerSinglesalesTransaction}
                >
                  <h4>product Name: {items.productName}</h4>
                  <div className={singleSalesCss.getOrRegisterProducts}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={
                        "class_" +
                        items.ProductId +
                        " " +
                        singleSalesCss.getProducts
                      }
                      onClick={() => {
                        setShowHiddenProducts(true);
                      }}
                    >
                      Register
                    </Button>

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => getTotalRegiters(items.ProductId)}
                      className={singleSalesCss.getProducts}
                    >
                      Get
                    </Button>
                  </div>
                  <br />
                  {showHiddenProducts && (
                    <div>
                      <TextField
                        type="number"
                        required
                        className={"dailyRegistrationInputs"}
                        onInput={handleSalesTransactionInput}
                        name="purchaseQty"
                        label="purchase quantity"
                      />
                      <br />
                      <br />
                      <TextField
                        type="number"
                        required
                        className={"dailyRegistrationInputs"}
                        onInput={handleSalesTransactionInput}
                        name="salesQty"
                        label="Sales quantity"
                      />
                      <br />
                      <br />
                      <TextField
                        type="number"
                        className={"dailyRegistrationInputs"}
                        onInput={handleSalesTransactionInput}
                        name="brokenQty"
                        label="Broken quantity"
                      />
                      <br />
                      <br />
                      <TextField
                        required
                        className={"dailyRegistrationInputs"}
                        onInput={handleSalesTransactionInput}
                        name="Description"
                        label="Description"
                      />
                      <br />
                      <br />
                      <Button color="primary" variant="contained" type="submit">
                        ADD
                      </Button>
                    </div>
                  )}
                  <br />
                </form>
              </div>
            );
          })}
        </div>
      )}
      {DailyTransaction.length > 0 && (
        <>
          <table>
            <tr>
              <th>Product Name</th>
              <th>Purchase Qty </th>
              <th>Sales Qty</th>
              <th>Broken Qty</th>
              <th>Description</th>
            </tr>

            {DailyTransaction?.map((items, index) => {
              console.log(items);
              // return;
              return (
                <tr key={"detailes_" + index}>
                  <td> {items.productName} </td>
                  <td>{items.purchaseQty}</td>
                  <td>{items.salesQty}</td>
                  <td> {items.brokenQty} </td>
                  <td> {items.Description}</td>
                </tr>
              );
            })}
            <tr></tr>
          </table>
          <button
            className={singleSalesCss.btnAddTotalSales}
            onClick={RegiterCollectedDailyTransaction}
          >
            Add As Total Sales
          </button>
        </>
      )}
    </div>
  );
}
export default AddSingleSales;
