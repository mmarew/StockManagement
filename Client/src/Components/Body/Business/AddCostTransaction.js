import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import AddCostTransactionCss from "./AddCostTransaction.module.css";
import $ from "jquery";
import { Button, TextField } from "@mui/material";
function AddCostTransaction() {
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
  let handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Formdata to cost ", Formdata);
    $(".LinearProgress").show();
    // return;
    let response = await axios.post(
      serverAddress + `registerCostTransaction/`,
      Formdata
    );
    console.log("response ", response);
    let data = response.data.data;
    if (data == "registered before") {
      alert("these data are registered before");
    } else if (data == "Inserted properly") {
      alert("Inserted properly");
      $("." + AddCostTransactionCss.formInputToTransaction + " div input").val(
        ""
      );
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
        <form
          onSubmit={handleFormSubmit}
          className={AddCostTransactionCss.costTransactionForm}
        >
          <div className={AddCostTransactionCss.dateDiv}>
            <div>Date</div>
            <TextField
              className={AddCostTransactionCss.formInputToTransaction}
              required
              name="costDate"
              onChange={collectCotForm}
              type="Date"
              id="costDate"
            />
          </div>
          {costList.length > 0 ? (
            <>
              {costList?.map((items) => {
                return (
                  <div className="" key={"CostTransAction_" + items.costsId}>
                    <div> {items.costName}</div>
                    <TextField
                      required
                      type="number"
                      label="Cost Amount"
                      name={items.costName.replaceAll(/\s/g, "")}
                      onChange={collectCotForm}
                      className={AddCostTransactionCss.formInputToTransaction}
                    />
                    <br />
                    <br />
                    <TextField
                      required
                      onChange={collectCotForm}
                      label="Cost Description"
                      className={AddCostTransactionCss.formInputToTransaction}
                      name={
                        "Description_" + items.costName.replaceAll(/\s/g, "")
                      }
                      type="text"
                    ></TextField>
                  </div>
                );
              })}
              <br />
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <br />
              <br />
              <br />
            </>
          ) : (
            <div>
              you haven't registered cost list data before. Please register cost
              items by click on items then costs
            </div>
          )}
        </form>
      ) : (
        "please wait .. "
      )}
    </div>
  );
}
export default AddCostTransaction;
