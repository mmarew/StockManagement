import React from "react";
// import Dialog from "@mui/material";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
function DeleteProducts({ data }) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");

  let { ConfirmDelete, setConfirmDelete, fetchProducts } = data;
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [userPassword, setUserPassword] = useState(null);
  const [Proccessing, setProccessing] = useState(null);
  let { item } = ConfirmDelete;
  const [Errors, setErrors] = useState(null);
  console.log("ConfirmDelete", ConfirmDelete);

  item.businessName = businessName;

  let deleteMyProducts = async () => {
    try {
      item.businessId = businessId;
      item.token = token;
      item.userPassword = userPassword;
      console.log("item", item);
      // return;
      let deletResponce = await axios.post(
        serverAddress + "products/deleteProducts/",
        item
      );
      fetchProducts();
      handleClose(true);
      console.log("deletResponce", deletResponce.data);
      let { data, Messages } = deletResponce.data;
      if (data == "Error") {
        alert(Messages);
        return;
      }
      let affectedRows = deletResponce.data.data.affectedRows;
      let copyOfProducts = [];
      if (affectedRows >= 0) {
        //   searchedProducts?.map((product) => {
        //     console.log("searchedProducts", product);
        //     if (product.ProductId !== item.ProductId) {
        //       copyOfProducts.push(product);
        //     }
        //   });
      }
    } catch (error) {
      console.log(error.message);
      setErrors(error.message);
    }
  };

  let handleClose = () => {
    setConfirmDelete({ Verify: false });
    setUserPassword(null);
    setProccessing(null);
  };
  return (
    <div>
      <Dialog open={ConfirmDelete.Verify}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {Errors}
          <form
            style={{
              width: "80%",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              deleteMyProducts();
            }}
          >
            <TextField
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              fullWidth
              required
              label={"Enter Password to verify"}
            />
            <br />
            {!Proccessing ? (
              <div>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleClose(true)}
                >
                  Cancel
                </Button>
                &nbsp; &nbsp; &nbsp;
                <Button variant="contained" type="submit">
                  Confirm
                </Button>
              </div>
            ) : (
              <ButtonProcessing />
            )}
            <br />
          </form>
        </DialogActions>
      </Dialog>
      {Proccessing ? <ButtonProcessing /> : null}
    </div>
  );
}

export default DeleteProducts;
