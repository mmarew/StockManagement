import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateFormatter } from "../Body/Date/currentDate";
import axios from "axios";
import { ButtonProcessing } from "../utility/Utility";

function OpenTransactionEditorModal({
  editTransactions,
  seteditTransactions,
  setListOfSalesAndPurchase,
  toDate,
  fromDate,
}) {
  // return;
  let { item } = editTransactions;
  let { registrationDate } = item;

  let openedBusiness = localStorage.getItem("openedBusiness");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [editedData, setEditedData] = useState({
    salesTypeValues: "Default",
    creditPaymentDate: "2023-10-10",
    date: registrationDate,
  });
  const [formInputError, setformInputError] = useState({
    creditSalesError: "",
    creditSalesTypeError: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let { salesQtyInCredit, salesTypeValues } = editedData;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
    if (name == "salesQtyInCredit") {
      if (salesTypeValues == "On credit") {
        if (value > 0) {
          setformInputError((errors) => {
            return {
              ...errors,
              creditSalesTypeError: "",
              creditSalesError: "",
            };
          });
        } else {
          setformInputError((errors) => {
            return {
              ...errors,
              creditSalesError: (
                <div style={{ color: "red", maxWidth: "300px" }}>
                  You can't put 0 credit value to credit sales qty while sales
                  type is on credit. so please try to change sales type from
                  credit to other type or put non 0 value to credit sales qty.
                </div>
              ),
            };
          });
        }
      } else {
      }
    } else if (name == "salesTypeValues") {
      if (Number(salesQtyInCredit) == 0) {
        if (value == "On credit") {
          setformInputError((errors) => {
            return {
              ...errors,
              creditSalesTypeError: (
                <div style={{ color: "red", maxWidth: "300px" }}>
                  You can't set sale type values to 'on credit' while credit
                  sales qty is 0. so please try to set credit sales qty to non 0
                  values or change sales type values to on cash or on bank.
                  Thank you.
                </div>
              ),
            };
          });
        } else {
          setformInputError((errors) => {
            return {
              ...errors,
              creditSalesError: "",
              creditSalesTypeError: "",
            };
          });
        }
      } else if (salesQtyInCredit > 0) {
        setformInputError((errors) => {
          return {
            ...errors,
            creditSalesError: "",
            creditSalesTypeError: "",
          };
        });
      }
    }
  };
  const [Processing, setProcessing] = useState(false);
  const handleSave = async () => {
    if (
      formInputError.creditSalesError != "" ||
      formInputError.creditSalesTypeError != ""
    ) {
      alert("please solve errors first");
      return;
    }
    setProcessing(true);
    let updates = await axios
      .post(serverAddress + "updateTransactions/", { ...editedData })
      .then((data) => {
        alert("updated successfully");
        seteditTransactions((prev) => {
          return { ...prev, Open: false };
        });
        let mapedList = data.data.data.map((item, i) => {
          let correctDateFormat = DateFormatter(item.registrationDate);
          item.registrationDate = correctDateFormat;
          return item;
        });
        // alert(mapedList);
        setListOfSalesAndPurchase([...mapedList]);
      })
      .catch((error) => {});

    setProcessing(false);
  };
  useEffect(() => {
    setEditedData((prev) => {
      return {
        ...prev,
        creditPayementdate: DateFormatter(item.creditPayementdate),
        toDate,
        salesTypeValues: item.salesTypeValues,
        fromDate,
        date: registrationDate,
        businessName,
        transactionId: item.transactionId,
        mainProductId: item.mainProductId,
        purchaseQty: item.purchaseQty,
        salesQty: item.salesQty,
        salesQtyInCredit: item.creditsalesQty,
        wrickages: item.wrickages,
        creditPaymentDate: item.creditPayementdate,
        Description: item.description,
      };
    });
  }, [item]);

  return (
    <Modal
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={editTransactions.Open}
    >
      <Box
        style={{
          maxHeight: "93%",
          overflow: "auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Edit {item.productName} transaction</h4>
          <IconButton
            color="error"
            onClick={() => seteditTransactions({ Open: false })}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <form
          onSubmit={(e) => {
            handleSave(e);
            e.preventDefault();
          }}
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          {/* Render input fields for each property */}
          <TextField
            required
            type="number"
            name={"purchaseQty"}
            label="Purchase Qty"
            value={editedData.purchaseQty}
            onChange={handleInputChange}
          />
          <br />
          <TextField
            required
            type="number"
            name={"salesQty"}
            label="Sales Qty"
            value={editedData.salesQty}
            onChange={handleInputChange}
          />
          <br />
          <TextField
            type="number"
            required
            name={"salesQtyInCredit"}
            label="Credit Sales Qty"
            value={editedData.salesQtyInCredit}
            onChange={(e) => {
              setformInputError((Errors) => {
                return { ...Errors, creditSalesError: "" };
              });
              handleInputChange(e);
            }}
          />
          <br />
          {formInputError.creditSalesError != "" && (
            <div>
              {formInputError.creditSalesError}

              <br />
            </div>
          )}
          <TextField
            type="number"
            required
            name={"wrickages"}
            label="Broken qty"
            value={editedData.wrickages}
            onChange={handleInputChange}
          />
          <br />
          <label>Sales type</label>
          <Select
            required
            name={"salesTypeValues"}
            labelId="sales-type-label"
            id="sales-type-select"
            value={editedData.salesTypeValues}
            onChange={handleInputChange}
          >
            <MenuItem value="Default">Choose sales type</MenuItem>
            <MenuItem value="On cash">On cash</MenuItem>
            <MenuItem value="By bank">By bank</MenuItem>
            <MenuItem value="On credit">On credit</MenuItem>
          </Select>
          {formInputError.creditSalesTypeError != "" && (
            <div>{formInputError.creditSalesTypeError}</div>
          )}
          <br />
          {editedData.salesTypeValues == "On credit" && (
            <>
              <label>Sales collection date</label>
              <TextField
                required
                label=""
                type="date"
                name={"creditPaymentDate"}
                value={DateFormatter(editedData.creditPaymentDate)}
                onChange={handleInputChange}
              />
            </>
          )}
          <br />
          <TextField
            label="Description"
            name={"Description"}
            value={editedData.Description}
            onChange={handleInputChange}
          />
          <br />
          {formInputError.creditSalesError == "" &&
          formInputError.creditSalesTypeError == "" &&
          !Processing ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                padding: "10px 20px",
              }}
            >
              <Button type="submit" variant="contained">
                Save
              </Button>
              <Button
                color="warning"
                variant="contained"
                onClick={() => seteditTransactions({ Open: false })}
              >
                Cancel
              </Button>
            </Box>
          ) : Processing ? (
            <ButtonProcessing />
          ) : (
            "Errors"
          )}
        </form>
      </Box>
    </Modal>
  );
}

export default OpenTransactionEditorModal;
