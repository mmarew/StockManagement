import axios from "axios";
import React, { useEffect, useState } from "react";
import { ConsumeableContext } from "../UserContext/UserContext";

import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import currentDates, { DateFormatter } from "../Date/currentDate";
import GetEachTransaction from "./GetEachTransaction";
function AddSingleSales_GetItems() {
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
  });

  let Today = currentDates();

  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
  });

  const [RegisterableItems, setRegisterableItems] = useState({
    items: {},
    Open: false,
  });
  let serverAddress = localStorage.getItem("targetUrl");
  const [Proccess, setProccess] = useState(false);
  let token = localStorage.getItem("storeToken");
  const [DailyTransaction, setDailyTransaction] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let handleSearchSubmit = async (e) => {
    // setproductDetailes([]);
    setSearchedProducts([]);
    setDailyTransaction([]);
    setShowProgressBar(true);
    let responce = await axios.post(serverAddress + "getsingleProducts/", {
      token,
      businessId,
      businessName,
      Target: "All Products",
      ...formInputValues,
    });
    setShowProgressBar(false);
    console.log("getsingleProducts", responce);
    if (responce.data.data.length == 0) alert("No products found here ");
    else setSearchedProducts(responce.data.data);
  };

  useEffect(() => {
    handleSearchSubmit();
  }, []);
  ////////begining of getTotalRegisters

  /////////////end of getTotalRegisters//////////////////
  let handleSalesTransactionInput = (e, ProductId) => {
    console.log(e.target.value);

    setFormInputValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        ProductId,
      };
    });
  };
  const [singleSalesError, setsingleSalesError] = useState({});

  let handleClose = () => {
    setRegisterableItems((prev) => {
      return { ...prev, Open: false };
    });
  };

  let registerSinglesalesTransaction = async (e, items) => {
    e.preventDefault();
    let { brokenQty, salesType } = formInputValues;
    console.log(
      "formInputValues",
      formInputValues,
      " items",
      items,
      "brokenQty",
      brokenQty
    );

    if (salesType == "Default") {
      setsingleSalesError((reviousErrors) => ({
        ...reviousErrors,
        salesType: "Sales type values has to be selected",
      }));
      return;
    }
    // Default;
    console.log("formInputValues", formInputValues.selectedDate);
    // return;
    setProccess(true);
    let responce = await axios.post(
      serverAddress + "registerSinglesalesTransaction/",
      {
        // registerTransaction
        items,
        ...formInputValues,
        businessId: localStorage.getItem("businessId"),
        currentDate: formInputValues.selectedDate
          ? formInputValues.selectedDate
          : Today,
      }
    );
    setFormInputValues({
      purchaseQty: "",
      salesQty: "",
      brokenQty: "",
      salesType: "Default",
      creditPaymentDate: "",
      Description: "",
      selectedDate: "",
    });

    // setFormInputValues({}); // Reset the form values to default
    setProccess(false);
    ////////////////
    console.log(responce.data.data);
    /////////////////
    if (responce.data.data == "successfullyRegistered") {
      alert("Successfully Registered");
    }
  };
  const { ShowProgressBar, setShowProgressBar } = ConsumeableContext();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "10px",
          flexWrap: "wrap",
          // justifyContent: "center",
          // alignItems: "center",
        }}
      >
        {console.log("searchedProducts", searchedProducts)}
        {searchedProducts?.map((items) => {
          return (
            <Box
              key={items.ProductId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
              }}
            >
              <div style={{ marginBottom: "5px", textAlign: "center" }}>
                {items.productName}
              </div>
              <Button
                variant="contained"
                className={"class_" + items.ProductId + " "}
                style={{
                  marginRight: "10px",
                }}
                onClick={() => {
                  setRegisterableItems({ items: items, Open: true });
                }}
              >
                Register
              </Button>
              <Button
                color="success"
                variant="contained"
                style={{}}
                onClick={() =>
                  setGetAllDailyRegisters((prev) => {
                    return {
                      ...prev,
                      Open: true,
                      ProductId: items.ProductId,
                      RandValue: Math.random(),
                    };
                  })
                }
              >
                View
              </Button>
            </Box>
          );
        })}

        {getAllDailyRegisters.Open && (
          <GetEachTransaction
            setGetAllDailyRegisters={setGetAllDailyRegisters}
            ProductId={getAllDailyRegisters.ProductId}
          />
        )}
        <Modal open={RegisterableItems.Open}>
          <Box
            sx={{
              marginBottom: "20px",
              maxHeight: "90vh",
              overflowY: "scroll",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 300,
              width: "90%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div variant="h6" component="h2">
              Registration to {RegisterableItems.items.productName}
            </div>

            <Typography variant="body1" component="p">
              <form
                onSubmit={(e) => {
                  registerSinglesalesTransaction(e, RegisterableItems.items);
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  Date
                </div>
                <TextField
                  onInput={(e) =>
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    )
                  }
                  value={formInputValues.selectedDate}
                  required
                  fullWidth
                  type="date"
                  name="selectedDate"
                />
                <br /> <br />
                <TextField
                  fullWidth
                  type="number"
                  required
                  value={formInputValues.purchaseQty}
                  className={"dailyRegistrationInputs"}
                  onInput={(e) =>
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    )
                  }
                  name="purchaseQty"
                  label="purchase quantity"
                />
                <br /> <br />
                <TextField
                  fullWidth
                  type="number"
                  required
                  className={"dailyRegistrationInputs"}
                  onInput={(e) =>
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    )
                  }
                  name="salesQty"
                  label="Sales quantity"
                  value={formInputValues.salesQty}
                />
                <br /> <br />
                <TextField
                  required
                  fullWidth
                  type="number"
                  className={"dailyRegistrationInputs"}
                  onInput={(e) =>
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    )
                  }
                  name="brokenQty"
                  label="Broken quantity"
                  value={formInputValues.brokenQty}
                />
                <br /> <br />
                <label>payment type</label>
                {console.log(
                  "formInputValues.salesType",
                  formInputValues.salesType
                )}
                <Select
                  value={formInputValues.salesType}
                  name="salesType"
                  onChange={(e) => {
                    setsingleSalesError({});
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    );
                  }}
                  sx={{ margin: "20px auto" }}
                  fullWidth
                  required
                >
                  <MenuItem value={"Default"}>Choose values </MenuItem>
                  <MenuItem value={"On cash"}>On cash</MenuItem>
                  <MenuItem value={"By bank"}>By bank</MenuItem>
                  <MenuItem value={"On credit"}>On credit</MenuItem>
                  {/* <MenuItem value={"On credit"}>On credit</MenuItem> */}
                </Select>
                <Box sx={{ color: "red", marginBottom: "0px" }}>
                  {singleSalesError.salesType}
                </Box>
                {formInputValues.salesType == "On credit" && (
                  <Box sx={{ width: "100%" }}>
                    <label>Payment date</label>
                    <TextField
                      id=""
                      onChange={(e) =>
                        handleSalesTransactionInput(
                          e,
                          RegisterableItems.items.ProductId
                        )
                      }
                      value={formInputValues.creditPaymentDate}
                      name="creditPaymentDate"
                      className=""
                      required
                      fullWidth
                      type="date"
                    />
                    <br /> <br />
                  </Box>
                )}
                <TextField
                  fullWidth
                  required
                  className={"dailyRegistrationInputs"}
                  onInput={(e) =>
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    )
                  }
                  value={formInputValues.Description}
                  name="Description"
                  label="Description"
                />
                <br /> <br />
                <Box sx={{ display: "flex" }}>
                  {!Proccess ? (
                    <Button color="primary" variant="contained" type="submit">
                      ADD
                    </Button>
                  ) : (
                    <Button disabled variant="contained">
                      Proccessing...
                    </Button>
                  )}
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    onClick={(e) => {
                      setRegisterableItems((prevItems) => {
                        return {
                          ...prevItems,
                          Open: false,
                        };
                      });
                      setProccess(false);
                      // setShowHiddenProducts(false);
                    }}
                    color="warning"
                    variant="contained"
                  >
                    CANCEL
                  </Button>
                </Box>
              </form>
            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default AddSingleSales_GetItems;
