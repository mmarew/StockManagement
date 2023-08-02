import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import AddCostTransactionCss from "./AddCostTransaction.module.css";
import $ from "jquery";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
function AddCostTransaction() {
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
    $(".LinearProgress").show();
    let response = await axios.post(serverAddress + "getCostLists/", {
      businessName,
    });
    console.log("response", response);
    if (response.data == "err") {
      alert(response.data.err);
      return;
    }
    let costData = response.data.data;
    console.log("costData", costData);
    setshowCostForm(true);
    if (costData.length == 0) {
      // alert("No cost list data.");
      // $(".costTransactionForm").hide();
    } else {
    }
    setcostList(costData);
    // setFormdata({ ...Formdata, costData });
    $(".LinearProgress").hide();
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
    $(".LinearProgress").show();
    let copyOfForm = { ...Formdata };
    copyOfForm.costData = target;
    console.log("copyOfForm", copyOfForm, "Formdata  ==", Formdata);
    // return;
    let response = await axios.post(
      serverAddress + `registerCostTransaction/`,
      copyOfForm
    );
    console.log("response ", response);
    let data = response.data.data;
    if (data == "registered before") {
      alert("these data are registered before");
    } else if (data == "Inserted properly") {
      alert("Inserted properly");
      setopen(false);
    }
    $(".LinearProgress").hide();
  };
  //////////
  let collectCotForm = (e) => {
    console.log(e.target);
    console.log(Formdata);
    let costDate = document.getElementById("costDate").value;
    setFormdata({
      ...Formdata,
      costDate,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (showCostForm) {
      let costDate = $("#costDate").value;
      console.log(" costDate is ", costDate);
      if (costDate == "") {
        costDate = currentDates();
        $("#costDate").val(costDate);
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
      {console.log(Object.keys(Formdata).length)}

      {showCostForm ? (
        <>
          {costList.length > 0 ? (
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
              items by click on items then costs
            </div>
          )}
        </>
      ) : (
        "please wait .. "
      )}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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

          {RegisterableCots?.length > 0 &&
            RegisterableCots.map((items, index) => {
              return (
                <form
                  key={"costItems_" + index}
                  onSubmit={(e) => handleFormSubmit(e, items)}
                  className={AddCostTransactionCss.costTransactionForm}
                >
                  <br />
                  <h3>Cost Transaction Registration Form</h3>
                  <br />
                  <div>Choose Date</div>

                  <TextField
                    className={AddCostTransactionCss.formInputToTransaction}
                    required
                    name="costDate"
                    onChange={collectCotForm}
                    type="Date"
                    id="costDate"
                  />

                  <h4 className={AddCostTransactionCss.costName}>
                    {items.costName}
                  </h4>
                  <TextField
                    required
                    type="number"
                    label="Cost Amount"
                    name={items?.costName?.replaceAll(/\s/g, "")}
                    onChange={collectCotForm}
                    className={AddCostTransactionCss.formInputToTransaction}
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectCotForm}
                    label="Cost Description"
                    className={AddCostTransactionCss.formInputToTransaction}
                    name={
                      "Description_" + items?.costName?.replaceAll(/\s/g, "")
                    }
                    type="text"
                  />
                  <br />
                  <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button>
                </form>
              );
            })}
        </Box>
      </Modal>
    </div>
  );
}
export default AddCostTransaction;
