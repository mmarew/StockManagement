import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddCostItems.css";
import $ from "jquery";
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
  let submitCosts = async (e) => {
    e.preventDefault();
    $(".LinearProgress").css("display", "block");
    console.log("data", data);
    let response = await axios.post(serverAddress + "AddCostItems/", data);
    if (response.data.data == "Registered successfully") {
      alert("Registered successfully");
      $(".inputToCotsRegistration").val("");
    } else if (response.data.data == "already registered before") {
      alert("Already registered before");
    }
    $(".LinearProgress").css("display", "none");
  };
  return (
    <div>
      <h1 className="titleToRegistrationForm">Forms To Register Costs</h1>
      <form className="form-add-cost" onSubmit={submitCosts}>
        <div className="dates">
          <span>Select Date</span>
          <input required type="date" name="date" id="dateIdInCost" />
        </div>
        <input
          className="inputToCotsRegistration"
          required
          name="Costname"
          placeholder="Cost name"
          onChange={collectInputInformation}
        />
        <input
          className="inputToCotsRegistration"
          name="costPrice"
          placeholder="Cost price"
          onChange={collectInputInformation}
        />
        <button type="Submit">submit</button>
      </form>
    </div>
  );
}

export default AddCostItems;
