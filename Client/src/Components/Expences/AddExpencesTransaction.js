import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Body/Date/currentDate";
import AddCostTransactionCss from "../Costs/AddCostTransaction.module.css";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ButtonProcessing } from "../Utilities//Utility";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import { LogoutofThisPage } from "../Logout/Logout";
function AddExpencesTransaction() {
  const { setShowProgressBar } = ConsumeableContext();
  const [Procecssing, setProcecssing] = useState(false);
  const businessId = localStorage.getItem("businessId");
  const token = localStorage.getItem("storeToken");
  let Navigate = useNavigate();
  const [RegisterableCots, setRegisterableCots] = useState([{}]);
  // open={open} onClose={handleClose}
  const [open, setopen] = useState(false);
  let handleClose = () => {
    setopen(false);
  };
  let serverAddress = localStorage.getItem("targetUrl");
  const [showCostForm, setshowCostForm] = useState(false);
  const [Formdata, setFormdata] = useState({});
  const [costList, setcostList] = useState([]);
  let businessName = localStorage.getItem("businessName");
  let getListOfCosts = async () => {
    setProcecssing(true);
    // return;
    setShowProgressBar(true);
    let response = await axios.post(serverAddress + "getCostLists/", {
      businessName,
      businessId,
      token,
    });
    setShowProgressBar(false);
    setProcecssing(false);
    setshowCostForm(true);
    console.log("response", response);
    if (response.data.data == "you are not owner of this business") {
      setcostList([]);
      LogoutofThisPage();
      return alert("you are not the owner of the business.");
    }
    if (response.data.data == "err") {
      alert(response.data.err);
      setcostList([]);
      return;
    }
    let costData = response.data.data;
    console.log("costData", costData);
    // return;

    if (costData.length == 0) {
      alert("No cost list data.");
      setcostList([]);
      return;
    } else {
    }
    setcostList(costData);
    // setFormdata({ ...Formdata, costData });
  };
  /////////////////
  let handleFormSubmit = async (e, each) => {
    e.preventDefault();
    console.log("Formdata to cost ", Formdata.costData, " each", each);
    let costData = Formdata.costData;
    let target = [];
    costData.map((item) => {
      console.log(item);
      if (each.costsId == item.costsId) target.push(item);
    });
    let copyOfForm = { ...Formdata };
    copyOfForm.costData = target;
    copyOfForm.token = token;
    copyOfForm.businessId = businessId;
    console.log("copyOfForm", copyOfForm, "Formdata  ==", Formdata);
    // return;
    setProcecssing(true);
    // return;
    let response = await axios.post(
      `${serverAddress}Expences/registerExpenceTransaction`,
      copyOfForm
    );
    setProcecssing(false);
    console.log("response ", response);
    let data = response.data.data;
    if (data == "registered before") {
      alert("these data are registered before");
    } else if (data == "Inserted properly") {
      alert("Inserted properly");
      setopen(false);
    }
  };
  //////////
  let collectCotForm = (e) => {
    console.log(e.target);
    console.log(Formdata);
    let costDate = currentDates();
    setFormdata({
      ...Formdata,
      costDate,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (showCostForm) {
      let costDate = "";
      console.log(" costDate is ", costDate);
      if (costDate == "") {
        costDate = currentDates();
        // $("#costDate").val(costDate);
      }
    }
    // businessName = localStorage.getItem("businessName");
    // setFormdata({
    //   ...Formdata,
    //   businessName,
    //   costDate,
    // });
    getListOfCosts();
  }, []);
  useEffect(() => {
    setFormdata({
      ...Formdata,
      businessName,
      costData: costList,
    });
  }, [costList]);
  return (
    <div>
      {showCostForm ? (
        <>
          {costList?.length > 0 ? (
            <div className={AddCostTransactionCss.costItems}>
              {costList?.map((items) => {
                return (
                  <div
                    className={AddCostTransactionCss.costItem}
                    key={"CostTransAction_" + items.costsId}
                  >
                    <div> {items.costName}</div>
                    <Button
                      onClick={() => {
                        setopen(true);
                        setRegisterableCots([items]);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Add Transaction
                    </Button>
                  </div>
                );
              })}
              <br />
            </div>
          ) : (
            <div>
              you haven't registered cost list data before. Please register cost
              items by{" "}
              <span
                className={AddCostTransactionCss.navigateToAddItems}
                onClick={() => {
                  Navigate("/OpenBusiness/additems");
                }}
              >
                click here
              </span>
            </div>
          )}
        </>
      ) : (
        "please wait .. "
      )}
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
                    name="expDate"
                    onChange={collectCotForm}
                    type="Date"
                  />

                  <h4 className={AddCostTransactionCss.costName}>
                    {items.costName}
                  </h4>
                  <TextField
                    required
                    type="number"
                    label="Expences Amount"
                    name={items?.costName?.replaceAll(/\s/g, "")}
                    onChange={collectCotForm}
                    className={AddCostTransactionCss.formInputToTransaction}
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectCotForm}
                    label="Expences Description"
                    className={AddCostTransactionCss.formInputToTransaction}
                    name={
                      "Description_" + items?.costName?.replaceAll(/\s/g, "")
                    }
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
export default AddExpencesTransaction;
