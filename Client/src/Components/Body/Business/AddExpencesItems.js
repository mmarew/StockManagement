import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddCostItems.css";
import { Button, TextField } from "@mui/material";
import { ButtonProcessing } from "../../utility/Utility";
function AddExpencesItems() {
  let serverAddress = localStorage.getItem("targetUrl");
  const businessId = localStorage.getItem("businessId");
  const [data, setdata] = useState({ Costname: "" });
  /////////////////////
  const [Processing, setProcessing] = useState(false);
  let collectInputInformation = (e) => {
    console.log(e.target.value);
    let businessName = localStorage.getItem("businessName");

    setdata({
      ...data,
      [e.target.name]: e.target.value,
      businessName,
    });
  };

  let token = localStorage.getItem("storeToken");
  let submitExpences = async (e) => {
    e.preventDefault();
    console.log("data", data);
    data.token = token;
    data.businessId = businessId;
    data.registrationDate = currentDates();
    console.log("data", data);
    setProcessing(true);

    // return;
    let response = await axios.post(serverAddress + "AddExpencesItems/", data);
    console.log("response", response);

    if (response.data.data == "Registered successfully") {
      alert("Registered successfully");
      setdata({ Costname: "" });
    } else if (response.data.data == "already registered before") {
      alert("Already registered before");
    } else if (response.data.data == "notallowedToU") {
      alert(
        `you can't make registration to this kinds of data please tell to owner of the business`
      );
    }
    setProcessing(false);
  };
  return (
    <div>
      <h5 className="titleToRegistrationForm">Forms To Register Costs</h5>
      <form className="form-add-cost" onSubmit={submitExpences}>
        {/* <TextField
          className="inputToCotsRegistration"
          label="Date"
          required
          type="date"
          name="date"
          id="dateIdInCost"
        /> */}

        <br />
        <TextField
          className="inputToCotsRegistration"
          required
          value={data.Costname}
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
        {!Processing ? (
          <Button variant="contained" type="Submit">
            submit
          </Button>
        ) : (
          <ButtonProcessing />
        )}
      </form>
    </div>
  );
}

export default AddExpencesItems;
