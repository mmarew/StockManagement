import axios from "axios";
import "./AddProducts.css";
import React, { useState } from "react";
import currentDates from "../Body/Date/currentDate";
import { Box, Button, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../Utilities/Utility";
import SearchProducts from "./SearchedProducts";
import SuccessOrError from "../Body/Others/SuccessOrError";
const initialFormData = {
  minimumQty: "",
  productName: "",
  productUnitCost: "",
  productUnitPrice: "",
};
const AddProducts = () => {
  /* local storage parts*/
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  /*use state parts */
  const [ErrorsVsSuccess, setErrorsVsSuccess] = useState(null);

  const [FormData, setFormData] = useState({
    ...initialFormData,
  });
  const [Processing, setProcessing] = useState(false);
  const [openProductRegistrationModal, setOpenProductRegistrationModal] =
    useState(false);
  /*function Parts*/

  let CollectData = (e) => {
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
      let data = response.data.data;
      setProcessing(false);

      if (data == "notAllowedFroYou") {
        setErrorsVsSuccess(
          "You are not allowed to make registration. so please tell to owner to make registration"
        );
        // return;
      } else if (data == "productIsAlreadyAddedBefore") {
        setErrorsVsSuccess("This product is added before.");
      } else if (data == "productIsAdded") {
        setFormData({
          ...initialFormData,
        });
        setErrorsVsSuccess("SUCCESS");
      } else {
        setErrorsVsSuccess("Something went wrong in server.");
        return;
      }
      for (let i = 0; i < registerProducts.length; i++) {
        registerProducts[i].value = "";
      }
    } catch (error) {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* button used to open modal to add products */}
      <Button
        sx={{ marginTop: "20px" }}
        onClick={() => setOpenProductRegistrationModal(true)}
        variant="contained"
      >
        Add Product
      </Button>
      {/* show errors start here */}
      {ErrorsVsSuccess && (
        <SuccessOrError
          request={ErrorsVsSuccess}
          setErrors={setErrorsVsSuccess}
        />
      )}
      {/* show errors ends here here */}
      {/* Modal to add products starts here */}
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
      {/* Modal to add products ends here */}
      {/* display registerd products start here */}
      {!openProductRegistrationModal && (
        <SearchProducts
          InputValue={FormData}
          setSearchTypeValueError={setErrorsVsSuccess}
        />
      )}
      {/* display registerd products ends here */}
      {/* <GetRegisterableItems /> */}
    </div>
  );
};

export default AddProducts;
