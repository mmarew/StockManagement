import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddCostTransaction.css";
function AddCostTransaction() {
  const [Formdata, setFormdata] = useState({});
  const [costList, setcostList] = useState([]);
  let businessName = localStorage.getItem("businessName");
  let getListOfCosts = async () => {
    let response = await axios.post("http://localhost:2020/getCostLists", {
      businessName,
    });
    let costData = response.data.data;
    setcostList(costData);
    // setFormdata({ ...Formdata, costData });
  };
  let handleFormSubmit = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      `http://localhost:2020/registerCostTransaction`,
      Formdata
    );
    console.log("response ", response.data.data);
    let data = response.data.data;
    if (data == "registered before") {
      alert("these data are registered before");
    } else if (data == "Inserted properly") {
      alert("Inserted properly");
    }
  };
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
    let costDate = document.getElementById("costDate").value;
    console.log(" costDate is ", costDate);
    if (costDate == "") {
      costDate = currentDates();
      document.getElementById("costDate").value = costDate;
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
      {console.log(Formdata)}
      <form onSubmit={handleFormSubmit} className="costTransactionForm">
        <div className="dateDiv">
          <div>Date</div>
          <input
            name="costDate"
            onChange={collectCotForm}
            type="Date"
            id="costDate"
          />
        </div>
        {costList?.map((items) => {
          return (
            <div className="" key={items.costsId}>
              <div className="label"> {items.costName} </div>
              <input
                type="number"
                placeholder="Cost Amount"
                name={items.costName.replaceAll(/\s/g, "")}
                onChange={collectCotForm}
                className="formInputToTransaction"
              />
              <textarea
                onChange={collectCotForm}
                placeholder="Cost Description"
                className="formInputToTransaction"
                name={"Description_" + items.costName.replaceAll(/\s/g, "")}
                type="text"
              ></textarea>
            </div>
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default AddCostTransaction;
