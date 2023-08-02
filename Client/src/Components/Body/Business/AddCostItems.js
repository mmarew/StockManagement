import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddCostItems.css";
import $ from "jquery";
import { Button, TextField } from "@mui/material";
function AddCostItems() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [data, setdata] = useState({});
  let collectInputInformation = (e) => {
    console.log(e.target.value);
    let businessName = localStorage.getItem("businessName");
    let date = document.getElementById("dateIdInCost").value;
    if (date == "") {
      date = currentDates();
      document.getElementById("dateIdInCost").value = date;
    }
    setdata({ ...data, [e.target.name]: e.target.value, businessName });
  };
  useEffect(() => {
    let gateDate = async () => {
      let date = document.getElementById("dateIdInCost").value;
      console.log("date == ", date);
      if (date == "") {
        date = await currentDates();
      }
      console.log(date);
      document.getElementById("dateIdInCost").value = date;
    };
    gateDate();
  }, []);

  let token = localStorage.getItem("storeToken");
  let submitCosts = async (e) => {
    e.preventDefault();
    $(".LinearProgress").css("display", "block");
    console.log("data", data);
    data.token = token;
    let response = await axios.post(serverAddress + "AddCostItems/", data);
    console.log("response", response);
    if (response.data.data == "Registered successfully") {
      alert("Registered successfully");
      $(".inputToCotsRegistration input").val("");
    } else if (response.data.data == "already registered before") {
      alert("Already registered before");
    } else if (response.data.data == "notallowedToU") {
      alert(
        `you can't make registration to this kinds of data please tell to owner of the business`
      );
    }
    $(".LinearProgress").css("display", "none");
  };
  return (
    <div>
      <h1 className="titleToRegistrationForm">Forms To Register Costs</h1>
      <form className="form-add-cost" onSubmit={submitCosts}>
        <TextField
          className="inputToCotsRegistration"
          label="Date"
          required
          type="date"
          name="date"
          id="dateIdInCost"
        />

        <br />
        <TextField
          className="inputToCotsRegistration"
          required
          name="Costname"
          label="Cost name"
          onChange={collectInputInformation}
        />
        <br />
        {/* <TextField
          className="inputToCotsRegistration"
          name="costPrice"
          label="Cost price"
          onChange={collectInputInformation}
        />
        <br /> */}
        <Button variant="contained" type="Submit">
          submit
        </Button>
      </form>
    </div>
  );
}

export default AddCostItems;
