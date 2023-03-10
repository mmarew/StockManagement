import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddSales.css";
import $ from "jquery";
function AddSales({ Time }) {
  console.log("Time is " + Time);
  let ProductId = [];
  const [ProductsList, setProductsList] = useState();
  const [CollectedProducts, setCollectedProducts] = useState({});
  const [selectedTime, setselectedTime] = useState();
  let token = localStorage.getItem("storeToken");
  let BusinessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let collectFormData = (e) => {
    console.log(e.target.className);
    console.log(e.target.name);
    console.log("ProductId " + ProductId);
    let dates = $("#dateId").val();
    console.log(dates);
    setCollectedProducts({
      ...CollectedProducts,
      [e.target.name]: e.target.value,
      ProductsList,
      businessName,
      BusinessId,
      dates: selectedTime,
    });
  };
  let getRegisteredProducts = async () => {
    let Response = await axios.post(
      "http://localhost:2020/getRegisteredProducts",
      { token, BusinessId, businessName }
    );
    setProductsList(Response.data.data);
  };
  let sendFormDataToServer = async (e) => {
    e.preventDefault();
    console.log(CollectedProducts);
    let response = await axios.post(
      "http://localhost:2020/registerTransaction",
      CollectedProducts
    );

    let datas = response.data.data;
    console.log(datas);
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      alert("successfully registered. Thank you.");
      let byClass = document.getElementsByClassName("productInput");
      for (let i = 0; i < byClass.length; i++) {
        byClass[i].value = "";
      }
    }
  };
  useEffect(() => {
    setCollectedProducts({ ...CollectedProducts, dates: selectedTime });
    console.log("selectedTime in useEffect = " + selectedTime);
  }, [selectedTime]);

  useEffect(() => {
    $("#dateId").val(currentDates);
    setselectedTime($("#dateId").val());
    getRegisteredProducts();
    console.log(CollectedProducts);
  }, []);

  return (
    <div>
      {console.log(CollectedProducts)}
      <input
        onChange={(e) => {
          console.log(e.target.value);
          setselectedTime(e.target.value);
        }}
        type="date"
        name=""
        id="dateId"
      />
      {console.log(ProductsList)}
      <form id="formOnAddTransaction" action="" onSubmit={sendFormDataToServer}>
        {ProductsList?.map((item) => {
          return (
            <div key={item.ProductId}>
              <br />
              <div className="productName-transaction">
                {" "}
                <h4>{item.productName}</h4>
              </div>

              <input
                target={item.ProductId}
                onChange={collectFormData}
                className={"productInput"}
                type="text"
                name={"purchaseQty" + item.ProductId}
                placeholder="Purchase quantity"
              />

              <input
                onChange={collectFormData}
                className={"productInput"}
                type="text"
                name={"salesQuantity" + item.ProductId}
                placeholder="Sales quantity"
              />
              <input
                onChange={collectFormData}
                className={"productInput"}
                type="text"
                name={"wrickageQty" + item.ProductId}
                placeholder="Broken quantity"
              />
            </div>
          );
        })}
        <button type="submit" className="RegisterSales">
          Register
        </button>
      </form>
    </div>
  );
}
export default AddSales;
