import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddCostItems.css";
function AddCostItems() {
  const [data, setdata] = useState({});
  let collectInputInformation = (e) => {
    console.log(e.target.value);
    let businessName = localStorage.getItem("businessName");
    let date = document.getElementById("dateId").value;
    if (date == "") {
      date = currentDates();
      document.getElementById("dateId").value = date;
    }
    setdata({ ...data, [e.target.name]: e.target.value, businessName });
  };
  useEffect(() => {
    let date = document.getElementById("dateId").value;
    if (date == "") {
      date = currentDates();
      document.getElementById("dateId").value = date;
    }
  }, []);
  let submitCosts = async (e) => {
    e.preventDefault();
    let response = await axios.post("http://localhost:2020/AddCostItems", data);
    console.log(response.data.data);
    if (response.data.data == "Registered successfully") {
      alert("Registered successfully");
    } else if (response.data.data == "already registered before") {
      alert("Already registered before");
    }
  };
  return (
    <div>
      <h1 className="titleToRegistrationForm">Forms To Register Costs</h1>
      <form className="form-add-cost" onSubmit={submitCosts}>
        <div className="dates">
          <span>Select Date</span>
          <input required type="date" name="date" id="dateId" />
        </div>
        <input
          required
          name="Costname"
          placeholder="Cost name"
          onChange={collectInputInformation}
        />
        <input
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
