import axios from "axios";
import "./AddProducts.css";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import { Button, TextField } from "@mui/material";
import { ButtonProcessing } from "../../utility/Utility";
const AddProducts = () => {
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  const [FormData, setFormData] = useState({});
  const [Processing, setProcessing] = useState(false);
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
    setProcessing(true);
    // return;
    $(".LinearProgress").css("display", "block");
    let response = await axios.post(serverAddress + "addProducts/", FormData);
    let data = response.data.data;
    setProcessing(false);
    console.log("response", response);
    let registerProducts = document.getElementsByClassName("registerProducts");
    if (data == "notAllowedFroYou") {
      alert(
        `you haven't permit to make registration. so please tell to owner to make registration`
      );
      // return;
    } else if (data == "productIsAlreadyAddedBefore") {
      alert("Already registered");
    } else if (data == "productIsAdded") {
      alert("you have added products successfully");
      $(".registerProducts input").val("");
    } else if (data == "created well") {
      alert("Your product is not registered. please try again.");
      return;
    }
    for (let i = 0; i < registerProducts.length; i++) {
      registerProducts[i].value = "";
    }
    $(".LinearProgress").hide();
  };

  return (
    <div>
      <h4 className="registrationFormToproducts">Forms To Register Products</h4>

      <form id="registerProductsForm" onSubmit={registerProducts} method="post">
        <div>Date</div>

        <TextField required id="productDate" type="date" />
        <br />
        <TextField
          className="registerProducts"
          onChange={CollectData}
          name="productName"
          type="text"
          label="Product name"
        />
        <br />
        <TextField
          className="registerProducts"
          onChange={CollectData}
          name="productUnitCost"
          type="number"
          label="Purchasing unit cost"
        />
        <br />
        <TextField
          className="registerProducts"
          onChange={CollectData}
          name="productUnitPrice"
          type="number"
          label="Salling unit price"
        />
        <br />
        <TextField
          className="registerProducts"
          onChange={CollectData}
          type="number"
          name="minimumQty"
          label="Minimum qty"
        />
        <br />
        {!Processing ? (
          <Button variant="contained" type="submit">
            Register
          </Button>
        ) : (
          <ButtonProcessing />
        )}
      </form>
    </div>
  );
};

export default AddProducts;
