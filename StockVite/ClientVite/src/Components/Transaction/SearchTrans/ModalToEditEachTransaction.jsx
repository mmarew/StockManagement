import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";
import CurrencyFormatter, { ButtonProcessing } from "../../Utilities/Utility";
import axios from "axios";
import { DateFormatter } from "../../Body/Date/currentDate";
function ModalToEditEachTransaction({ Data }) {
  let token = localStorage.getItem("storeToken"),
    serverAddress = localStorage.getItem("targetUrl");

  let {
    EditSingleItem,
    setEditSingleItem,
    setErrorsOrSuccess,
    getDailyTransaction,
  } = Data;
  let { Items } = EditSingleItem;
  let { ProductId } = Items;
  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
    token: token,
    ...Items,
  });
  const [Processing, setProcessing] = useState(false);
  const editDailyTransaction = async (e) => {
    e.preventDefault();

    try {
      formInputValues.token = token;
      // return;
      setProcessing(true);
      const response = await axios.put(
        serverAddress + "Transaction/updateDailyTransactions",
        {
          ...formInputValues,
        }
      );
      setProcessing(false);

      const { data } = response.data;

      if (data === "update successfully") {
        setEditSingleItem((prevstate) => ({ ...prevstate, open: false }));
        // alert(`Thank you. ${data}`);
        setErrorsOrSuccess("SUCCESS");
        await getDailyTransaction(ProductId);
      }
    } catch (error) {
      setProcessing(false);
      setErrorsOrSuccess(error.message);
    }
  };
  let handleSalesTransactionInput = (e, ProductId) => {
    setFormInputValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        ProductId,
      };
    });
  };
  return (
    <div>
      <Modal open={EditSingleItem.open}>
        <Box
          sx={{
            height: "90%",
            overflow: "scroll",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Edit Item {EditSingleItem.Items.productName}
            </Typography>
            <IconButton
              onClick={() =>
                setEditSingleItem((prev) => {
                  return { ...prev, open: false };
                })
              }
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" component="p">
            <form
              className={singleSalesCss.singleTransactionForm}
              onSubmit={(e) => editDailyTransaction(e)}
            >
              <TextField
                fullWidth
                type="number"
                required
                value={formInputValues.purchaseQty}
                className={"dailyRegistrationInputs"}
                onInput={(e) =>
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
                }
                name="purchaseQty"
                label="purchase quantity"
              />
              <br />
              <TextField
                fullWidth
                value={formInputValues.unitCost}
                type="number"
                className=""
                label="Unit Cost"
                name={"unitCost"}
                onInput={(e) => {
                  handleSalesTransactionInput(
                    e,
                    EditSingleItem.Items.ProductId
                  );
                }}
              />
              <br />
              <div>
                {" "}
                Total Cost{" "}
                {CurrencyFormatter(
                  formInputValues.purchaseQty * formInputValues.unitCost
                )}
              </div>
              <br />
              <TextField
                fullWidth
                type="number"
                required
                className={"dailyRegistrationInputs"}
                onInput={(e) =>
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
                }
                name={
                  formInputValues.salesTypeValues == "On credit" ||
                  formInputValues.salesTypeValues == "credit paied"
                    ? "creditsalesQty"
                    : "salesQty"
                }
                label="Sales quantity"
                value={
                  formInputValues.salesTypeValues == "On credit" ||
                  formInputValues.salesTypeValues == "credit paied"
                    ? formInputValues.creditsalesQty
                    : formInputValues.salesQty
                }
              />
              <br /> <br />
              <TextField
                onChange={(e) => {
                  handleSalesTransactionInput(
                    e,
                    EditSingleItem.Items.ProductId
                  );
                }}
                value={formInputValues.unitPrice}
                name="unitPrice"
                fullWidth
                required
                type="number"
                label="Unit price"
              />{" "}
              <br />
              Total Sales={" "}
              {CurrencyFormatter(
                (Number(formInputValues.creditsalesQty) +
                  Number(formInputValues.salesQty)) *
                  Number(formInputValues.unitPrice)
              )}
              <br />
              <br />
              <TextField
                fullWidth
                required
                type="number"
                className={"dailyRegistrationInputs"}
                onInput={(e) =>
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
                }
                name="brokenQty"
                label="Broken quantity"
                value={formInputValues.brokenQty}
              />
              <br />
              <label>payment type</label>
              <Select
                value={formInputValues.salesTypeValues}
                name="salesTypeValues"
                onChange={(e) =>
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
                }
                sx={{ margin: "20px auto" }}
                fullWidth
                required
              >
                <MenuItem value={"On cash"}>On cash</MenuItem>
                <MenuItem value={"By bank"}>By bank</MenuItem>
                <MenuItem value={"On credit"}>On credit</MenuItem>
                <MenuItem value={"credit paied"}>credit paied</MenuItem>
              </Select>
              {formInputValues.salesTypeValues == "On credit" && (
                <Box>
                  <lab>Payment date</lab>
                  <TextField
                    id=""
                    onChange={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    value={DateFormatter(formInputValues.creditPaymentDate)}
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
                }
                value={formInputValues.Description}
                name="Description"
                label="Description"
              />
              <br />
              {Processing ? (
                <ButtonProcessing />
              ) : (
                <Box>
                  <Button color="primary" variant="contained" type="submit">
                    UPDATE
                  </Button>
                  &nbsp; &nbsp; &nbsp;
                  <Button
                    onClick={() =>
                      setEditSingleItem((prevstate) => {
                        return { ...prevstate, open: false };
                      })
                    }
                    color="warning"
                    variant="contained"
                    type="submit"
                  >
                    CANCEL
                  </Button>
                </Box>
              )}
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalToEditEachTransaction;
