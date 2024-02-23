import React, { useState } from "react";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../../Utilities/Utility";
import AddCostTransactionCss from "../../Costs/AddCostTransaction.module.css";
import CloseIcon from "@mui/icons-material/Close";
import currentDates from "../../Body/Date/currentDate";
import axios from "axios";
function AddExpTransaction({ data }) {
  const token = localStorage.getItem("storeToken");

  const businessId = localStorage.getItem("businessId");
  let serverAddress = localStorage.getItem("targetUrl");

  let { RegisterableCots, setopen, setErrorsOrSuccess, open } = data;

  const [Formdata, setFormdata] = useState({
    expDescription: "",
    expAmount: "",
    expDate: currentDates(),
  });
  const [Procecssing, setProcecssing] = useState(false);
  let handleClose = () => {
    setopen(false);
  };
  let collectCotForm = (e) => {
    setFormdata({
      ...Formdata,
      [e.target.name]: e.target.value,
    });
  };
  let handleFormSubmit = async (e, each) => {
    e.preventDefault();
    try {
      let copyOfForm = { ...Formdata };
      copyOfForm.costData = each;
      copyOfForm.token = token;
      copyOfForm.businessId = businessId;
      setProcecssing(true);
      let response = await axios.post(
        `${serverAddress}Expences/registerExpenceTransaction`,
        copyOfForm
      );
      setProcecssing(false);
      let data = response.data.data;
      if (data == "registered before") {
        setErrorsOrSuccess({
          Message: "Fail",
          Detail: "these data are registered before",
        });
      } else if (data == "Inserted properly") {
        setErrorsOrSuccess({
          Message: "SUCCESS",
          Detail: "Inserted properly",
        });
        setopen(false);
      }
    } catch (error) {
      setProcecssing(false);
    }
  };
  return (
    <div>
      <Modal open={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 300,
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

          {RegisterableCots?.length > 0 &&
            RegisterableCots.map((items, index) => {
              return (
                <form
                  key={"costItems_" + index}
                  onSubmit={(e) => handleFormSubmit(e, items)}
                  className={AddCostTransactionCss.costTransactionForm}
                >
                  <br />
                  <h5>Expences Transaction Registration Form</h5>
                  <br />
                  <label> Select Date</label>
                  <TextField
                    className={AddCostTransactionCss.formInputToTransaction}
                    required
                    value={Formdata.expDate || currentDates()}
                    name="expDate"
                    onChange={collectCotForm}
                    type="Date"
                  />
                  <h4 className={AddCostTransactionCss.costName}>
                    {items.costName}
                  </h4>
                  <TextField
                    required
                    value={Formdata.expAmount}
                    type="number"
                    label="Expences Amount"
                    name={"expAmount"}
                    onChange={collectCotForm}
                    className={AddCostTransactionCss.formInputToTransaction}
                  />
                  <br />
                  <TextField
                    required
                    value={Formdata.expDescription}
                    onChange={collectCotForm}
                    label="Expences Description"
                    className={AddCostTransactionCss.formInputToTransaction}
                    name={"expDescription"}
                    type="text"
                  />
                  <br />
                  {!Procecssing ? (
                    <Button variant="contained" color="primary" type="submit">
                      Submit
                    </Button>
                  ) : (
                    <ButtonProcessing />
                  )}
                </form>
              );
            })}
        </Box>
      </Modal>
    </div>
  );
}

export default AddExpTransaction;
