import axios from "axios";
import "./AddProducts.css";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
const AddProducts = () => {
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  const [FormData, setFormData] = useState({});
  let CollectData = (e) => {
    console.log(e.target.name);
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
      token,
      businessId,
    });
  };
  let registerProducts = async (e) => {
    e.preventDefault();
    $(".LinearProgress").css("display", "block");
    let response = await axios.post(serverAddress + "addProducts/", FormData);
    let data = response.data.data;
    console.log("response", response);
    let registerProducts = document.getElementsByClassName("registerProducts");

    if (data == "productIsAlreadyAddedBefore") {
      alert("Already registered");
    } else if (data == "productIsAdded") {
      alert("you have added products successfully");
    } else if (data == "created well") {
      alert("Your product is not registered. please try again.");
      return;
    }
    for (let i = 0; i < registerProducts.length; i++) {
      registerProducts[i].value = "";
    }
    $(".LinearProgress").hide();
  };

  useEffect(() => {
    let gateDate = async () => {
      let date = document.getElementById("productDate").value;
      console.log("date == ", date);
      if (date == "") {
        date = await currentDates();
      }
      console.log(date);
      document.getElementById("productDate").value = date;
    };
    gateDate();
  }, []);
  return (
    <div>
      <h4 className="registrationFormToproducts">Forms To Register Products</h4>

      <form id="registerProductsForm" onSubmit={registerProducts} method="post">
        <div>Date</div>
        <input required id="productDate" type="date" />
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productName"
          type="text"
          placeholder="Product name"
        />
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productUnitCost"
          type="text"
          placeholder="Purchasing unit cost"
        />
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productUnitPrice"
          type="text"
          placeholder="Salling unit price"
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default AddProducts;
