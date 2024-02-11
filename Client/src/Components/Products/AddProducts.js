import axios from "axios";
import "./AddProducts.css";
import React, { useState } from "react";
import currentDates from "../Body/Date/currentDate";
import { Box, Button, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../Utilities/Utility";
import AddSingleSales_GetItems from "../Transaction/AddTrans/AddSingleSales_GetItems";
const AddProducts = () => {
  /* local storage parts*/
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  /*use state parts */
  const [getItems, setGetItems] = useState(<AddSingleSales_GetItems />);
  const [FormData, setFormData] = useState({
    minimumQty: "",
    productName: "",
    productRegistrationDate: "",
    productUnitCost: "",
    productUnitPrice: "",
  });
  const [Processing, setProcessing] = useState(false);
  const [openProductRegistrationModal, setOpenProductRegistrationModal] =
    useState(false);
  /*function Parts*/

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
    try {
      setProcessing(true);
      FormData.productRegistrationDate = currentDates();
      let response = await axios.post(
        serverAddress + "products/addProducts/",
        FormData
      );
      setGetItems(<AddSingleSales_GetItems />);
      let data = response.data.data;
      setProcessing(false);

      console.log("response", response);
      let registerProducts =
        document.getElementsByClassName("registerProducts");
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
        // $(".registerProducts input").val("");
      } else if (data == "created well") {
        alert("Your product is not registered. please try again.");
        return;
      }
      for (let i = 0; i < registerProducts.length; i++) {
        registerProducts[i].value = "";
      }
    } catch (error) {}
  };

  return (
    <div>
      <br />

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
              registerProducts(e);
            }}
            method="post"
          >
            <h3>Products registration form</h3>
            <br />
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
