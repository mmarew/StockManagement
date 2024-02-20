import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";

import axios from "axios";
import currentDates, { DateFormatter } from "../../Body/Date/currentDate";
import CurrencyFormatter from "../../Utilities/Utility";
import SuccessOrError from "../../Body/Others/SuccessOrError";
function AddSingleSales_Register({ RegisterableItems, steRegisterableItems }) {
  const [singleSalesError, setsingleSalesError] = useState({});
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState(null);
  let handleSalesTransactionInput = (e, ProductId) => {
    console.log(e.target.value);

    let { name, value } = e.target;
    setformInputValues((previousState) => ({
      ...previousState,
      [name]: value,
      ProductId,
    }));
  };
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  let [Processing, setProcessing] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  const [formInputValues, setformInputValues] = useState({
    salesType: "Default",
    Description: "",
    ProductId: "",
    brokenQty: "",
    creditPaymentDate: "",
    purchaseQty: "",
    salesQty: "",
    selectedDate: currentDates(),
    useNewPrice: false,
    unitPrice: null,
  });
  let registerSinglesalesTransaction = async (e, items) => {
    try {
      e.preventDefault();
      let { brokenQty, salesType } = formInputValues;

      if (salesType === "Default") {
        setsingleSalesError((reviousErrorsOrSuccess) => ({
          ...reviousErrorsOrSuccess,
          salesType: "Sales type values has to be selected",
        }));
        return;
      }
      setProcessing(true);

      let responce = await axios.post(
        serverAddress + "Transaction/registerSinglesalesTransaction/",
        {
          token,
          items,
          ...formInputValues,
          businessId: localStorage.getItem("businessId"),
        }
      );
      DateFormatter();
      setformInputValues({
        salesType: "Default",
        Description: "",
        ProductId: "",
        brokenQty: "",
        creditPaymentDate: "",
        purchaseQty: "",
        salesQty: "",
        selectedDate: "",
        useNewPrice: false,
        unitPrice: null,
      }); // Reset the form values to default
      setProcessing(false);

      if (responce.data.data === "success") {
        setErrorsOrSuccess("SUCCESS");
      }
    } catch (error) {
      setErrorsOrSuccess(error.message);
    }
  };
  return (
    <>
      <Modal open={RegisterableItems.Open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              overflowY: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Single registration to {RegisterableItems.items.productName}
            </Typography>
          </Box>
          <Typography variant="body1" component="p">
            <form
              className={singleSalesCss.singleTransactionForm}
              onSubmit={(e) => {
                registerSinglesalesTransaction(e, RegisterableItems.items);
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                Date
              </div>{" "}
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
              <br />
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
              {formInputValues.purchaseQty > 0 && (
                <div style={{ padding: "10px 0" }}>
                  Purchase in money{" "}
                  {CurrencyFormatter(
                    formInputValues.purchaseQty *
                      RegisterableItems.items.productsUnitCost
                  )}
                </div>
              )}
              <br />
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
              <br />
              {formInputValues.useNewPrice && (
                <TextField
                  value={formInputValues.unitPrice}
                  name="unitPrice"
                  onChange={(e) => {
                    handleSalesTransactionInput(
                      e,
                      RegisterableItems.items.ProductId
                    );
                  }}
                  required
                  label={"Enter New Price "}
                  fullWidth
                  type="number"
                />
              )}
              <div>
                <Checkbox
                  checked={formInputValues.useNewPrice}
                  onChange={(e) => {
                    setformInputValues((previousState) => ({
                      ...previousState,
                      useNewPrice: !formInputValues.useNewPrice,
                      ProductId: RegisterableItems.items.ProductId,
                    }));
                  }}
                  name="useNewPrice"
                />
                <span>Use New Price</span>
              </div>
              {formInputValues.salesQty > 0 && (
                <div style={{ padding: "10px" }}>
                  sales in money{" "}
                  {formInputValues.useNewPrice
                    ? formInputValues.unitPrice &&
                      CurrencyFormatter(
                        formInputValues.salesQty * formInputValues.unitPrice
                      )
                    : CurrencyFormatter(
                        formInputValues.salesQty *
                          RegisterableItems.items.productsUnitPrice
                      )}
                </div>
              )}
              <br />
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
              <br />
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
                <MenuItem defaultValue={"Default"}>Choose values </MenuItem>
                <MenuItem value={"On cash"}>On cash</MenuItem>
                <MenuItem value={"By bank"}>By bank</MenuItem>
                <MenuItem value={"On credit"}>On credit</MenuItem>
                {/* <MenuItem value={"On credit"}>On credit</MenuItem> */}
              </Select>
              <Box sx={{ color: "red", marginBottom: "20px" }}>
                {" "}
                {singleSalesError.salesType}
              </Box>
              {formInputValues.salesType === "On credit" && (
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
              <br />
              <Box>
                {Processing ? (
                  <Button disabled variant="contained">
                    Processing...
                  </Button>
                ) : (
                  <>
                    <Button color="primary" variant="contained" type="submit">
                      ADD
                    </Button>{" "}
                    &nbsp; &nbsp; &nbsp;
                    <Button
                      onClick={(e) => {
                        steRegisterableItems((prevItems) => {
                          return {
                            ...prevItems,
                            Open: false,
                          };
                        });
                        setProcessing(false);
                        //   setShowHiddenProducts(false);
                      }}
                      color="warning"
                      variant="contained"
                    >
                      Close
                    </Button>
                  </>
                )}
              </Box>
            </form>
          </Typography>
        </Box>
      </Modal>
      {ErrorsOrSuccess == "SUCCESS" && (
        <SuccessOrError
          request={ErrorsOrSuccess}
          setErrors={setErrorsOrSuccess}
        />
      )}
    </>
  );
}

export default AddSingleSales_Register;
