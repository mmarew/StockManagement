import axios from "axios";
import "./AddProducts.css";
import $ from "jquery";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import { Box, Button, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../../utility/Utility";
import AddSingleSales_GetItems from "./AddSingleSales_GetItems";
const AddProducts = ({ randVal, setrandVal }) => {
  const [getItems, setGetItems] = useState(
    <AddSingleSales_GetItems setrandVal={setrandVal} randVal={randVal} />
  );
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  const [FormData, setFormData] = useState({
    minimumQty: "",
    productName: "",
    productRegistrationDate: "",
    productUnitCost: "",
    productUnitPrice: "",
  });
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
    FormData.productRegistrationDate = currentDates();
    let response = await axios.post(serverAddress + "addProducts/", FormData);
    setGetItems(
      <AddSingleSales_GetItems setrandVal={setrandVal} randVal={randVal} />
    );
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
      setFormData({
        minimumQty: "",
        productName: "",
        productRegistrationDate: "",
        productUnitCost: "",
        productUnitPrice: "",
      });
      alert("you have added products successfully");
      $(".registerProducts input").val("");
    } else if (data == "created well") {
      alert("Your product is not registered. please try again.");
      return;
    }
    for (let i = 0; i < registerProducts.length; i++) {
      registerProducts[i].value = "";
    }
  };
  const [openProductRegistrationModal, setOpenProductRegistrationModal] =
    useState(false);

  return (
    <div>
      <h4 className="registrationFormToproducts">Forms To Register Products</h4>
      <Button
        onClick={() => setOpenProductRegistrationModal(true)}
        variant="contained"
      >
        Add Product
      </Button>
      <Modal open={openProductRegistrationModal}>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            display: "flex",
            transform: "translate(-50%, -50%)",
          }}
        >
          <form
            id="registerProductsForm"
            onSubmit={(e) => {
              e.preventDefault();
              setGetItems();
              setrandVal(Math.random());
              // setTimeout(() => {}, 10);
              registerProducts(e);
            }}
            method="post"
          >
            <br />{" "}
            <TextField
              fullWidth
              required
              value={FormData.productName}
              className="registerProducts"
              onChange={CollectData}
              name="productName"
              type="text"
              label="Product name"
            />
            <br />
            <TextField
              fullWidth
              required
              value={FormData.productUnitCost}
              className="registerProducts"
              onChange={CollectData}
              name="productUnitCost"
              type="number"
              label="Purchasing unit cost"
            />
            <br />
            <TextField
              fullWidth
              required
              value={FormData.productUnitPrice}
              className="registerProducts"
              onChange={CollectData}
              name="productUnitPrice"
              type="number"
              label="Salling unit price"
            />
            <br />
            <TextField
              fullWidth
              required
              value={FormData.minimumQty}
              className="registerProducts"
              onChange={CollectData}
              type="number"
              name="minimumQty"
              label="Minimum qty"
            />
            <br />
            <Box sx={{ display: "flex" }}>
              {!Processing ? (
                <Button variant="contained" type="submit">
                  Register
                </Button>
              ) : (
                <ButtonProcessing />
              )}
              &nbsp; &nbsp; &nbsp; &nbsp;
              <Button
                onClick={() => setOpenProductRegistrationModal(false)}
                color="warning"
                variant="contained"
              >
                CANCEL
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      {getItems}
    </div>
  );
};

export default AddProducts;
