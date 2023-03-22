import axios from "axios";
import React, { useState } from "react";
import "./AddSingleSales.css";
import currentDates from "../Date/currentDate";
function AddSingleSales() {
  const [inputValues, setInputValues] = useState({});
  const [formInputValues, setformInputValues] = useState([]);
  const [searchedProducts, setsearchedProducts] = useState([]);
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    let responce = await axios.post("http://localhost:2020/getsingleProducts", {
      ...inputValues,
      ...{ BusinessId: localStorage.getItem("buinessId") },
      ...{ businessName: localStorage.getItem("businessName") },
    });
    console.log("responce");
    console.log(responce.data.data);
    setsearchedProducts(responce.data.data);
  };
  let handleSalesTransactionInput = (e) => {
    console.log(e.target.value);
    setformInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
      ProductId: e.target.className,
    });
  };
  let getSingleProducts = (event) => {
    console.log(event.target.value);
    setInputValues({ [event.target.name]: event.target.value });
  };
  let registerSinglesalesTransaction = async (e) => {
    e.preventDefault();
    let responce = await axios.post(
      "http://localhost:2020/registerSinglesalesTransaction",
      { ...formInputValues, businessId: localStorage.getItem("businessId") }
    );
    console.log(responce.data.data);
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
  let getTotalRegiters = async (productId) => {
    let businessId = localStorage.getItem("businessId");
    let businessName = localStorage.getItem("businessName");
    let responce = await axios.post(
      "http://localhost:2020/getDailyTransaction",
      { currentDates: currentDates(), businessId, productId }
    );
    console.log(responce);
  };
  return (
    <div className="singleSalesWrapper">
      {console.log(inputValues)}
      <h3>search Products</h3>
      <>
        {console.log("formInputValues = > ")}
        {console.log(formInputValues)}
      </>
      <form onSubmit={handleSearchSubmit}>
        <input
          name="searchInput"
          onInput={getSingleProducts}
          placeholder="Type Product Name"
          id=""
          className=""
          type={"search"}
        />
        <button type="Submit">Search</button>
      </form>
      {searchedProducts?.map((items) => {
        // console.log(items);
        return (
          <form
            className="singleTransactionForm"
            onSubmit={registerSinglesalesTransaction}
            key={items.ProductId}
          >
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
                Get{" "}
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
        );
      })}
    </div>
  );
}
export default AddSingleSales;
