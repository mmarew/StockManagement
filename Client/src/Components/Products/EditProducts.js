import React from "react";
import { Button, IconButton, Box, TextField, Modal } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { ButtonProcessing } from "../Utilities//Utility";
import axios from "axios";
function EditProducts({ data }) {
  let { openEditerModal, setOpenEditerModal, fetchProducts } = data;
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [Processing, setProcessing] = useState(false);
  const [productName, setProductName] = useState(
    openEditerModal?.item?.productName
  );
  const [productUnitPrice, setProductUnitPrice] = useState(
    openEditerModal?.item?.productsUnitPrice
  );

  const [productUnitCost, setProductUnitCost] = useState(
    openEditerModal?.item?.productsUnitCost
  );
  const [minimumQty, setMinimumQty] = useState(
    openEditerModal?.item?.minimumQty
  );
  let updateProductsData = async (productID) => {
    try {
      businessName = localStorage.getItem("businessName");
      let ob = { token, businessId };

      let previousData = openEditerModal.item;
      let prevPrice = previousData.productsUnitPrice,
        prevCost = previousData.productsUnitCost,
        prevName = previousData.productName,
        prevMinimumQty = previousData.minimumQty;
      setProcessing(true);
      if (
        minimumQty == prevMinimumQty &&
        productUnitPrice == prevPrice &&
        productName == prevName &&
        productUnitCost == prevCost
      ) {
        setProcessing(false);
        return alert("you can't make update bacause no change in your data");
      }

      ob.minimumQty = minimumQty;
      ob.productPrice = productUnitPrice;
      ob.productName = productName;
      ob.productCost = productUnitCost;
      ob.id = productID;
      ob.businessName = businessName;
      await axios
        .post(serverAddress + "products/updateProducts/", ob)
        .then((datas) => {
          if ((datas.data.data = "updated well")) {
            fetchProducts();
            alert("updated well");
          }
        });
      setProcessing(false);

      handleClose();
    } catch (error) {}
  };
  let handleClose = () => {
    setOpenEditerModal({ open: false });
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductUnitPriceChange = (e) => {
    setProductUnitPrice(e.target.value);
  };

  const handleProductUnitCostChange = (e) => {
    setProductUnitCost(e.target.value);
  };

  const handleMinimumQtyChange = (e) => {
    setMinimumQty(e.target.value);
  };
  return (
    <div>
      <Modal open={openEditerModal.open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
          <br />
          <br />
          <h3>Edition form to products</h3>
          <br />
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              margin: "auto",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              label="Product Name"
              value={productName}
              onChange={handleProductNameChange}
              type="text"
            />
            <br />
            <br />
            <TextField
              value={productUnitPrice}
              label="Product Unit Price"
              onChange={handleProductUnitPriceChange}
              type="number"
            />
            <br />
            <br />
            <TextField
              value={productUnitCost}
              label="Product Unit Cost"
              onChange={handleProductUnitCostChange}
              type="number"
            />
            <br />
            <br />
            <TextField
              value={minimumQty}
              label="Product Minimum Quantity"
              onChange={handleMinimumQtyChange}
              type="number"
            />
            <br />
            <br />
            {!Processing ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() =>
                  updateProductsData(openEditerModal?.item?.ProductId)
                }
                className={`updateProducts updateProducts_${openEditerModal?.item?.ProductId}`}
              >
                UPDATE
              </Button>
            ) : (
              <ButtonProcessing />
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default EditProducts;
