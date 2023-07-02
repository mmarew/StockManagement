import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CreateBusiness.css";
import $ from "jquery";
import { Button, TextField } from "@mui/material";
function CreateBusiness({ getBusiness, setnewBusiness, setShowProgressBar }) {
  // console.log(getBusiness, setnewBusiness, setShowProgressBar);
  // return;

  let serverAddress = localStorage.getItem("targetUrl");
  const [businessData, setbusinessData] = useState({});
  let handleCreateForm = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(e.target.name);
    let token = localStorage.getItem("storeToken");
    setbusinessData({
      ...businessData,
      [e.target.name]: e.target.value,
      token,
    });
  };
  let submitAlldatas = async (e) => {
    e.preventDefault();
    let businessName = businessData.businessName;
    console.log(businessName);
    let i = 0;
    for (i = 0; i < businessName.length; i++) {
      console.log(businessName[i]);
      if (businessName[i] == " ") {
        alert("Space is not allowed to business name.");
        return;
      }
    }
    {
      console.log("businessData is = ", businessData);
    }
    console.log("setShowProgressBar", setShowProgressBar);
    setShowProgressBar(true);

    let response = await axios.post(
      serverAddress + "createBusiness/",
      businessData
    );
    setShowProgressBar(false);
    console.log(response.data);
    let data = response.data.data;
    if (data == "created well") {
      /*
 tableCollections: {
 registerBusinessName: "regesteredBefore"
_Costs: 0
_Transaction: 0
_expenses: 0
_products: 0 }  */
      let registerBusinessName =
        response.data.tableCollections.registerBusinessName;
      console.log(response.data.tableCollections.registerBusinessName);
      // console.log(response.data);
      // return;
      if (registerBusinessName == "regesteredBefore") {
        alert(
          "This business name is reserved before. so please change its name. Thank You"
        );
      } else {
        setnewBusiness("");
        alert("Your business is created well. Thankyou.");
        getBusiness();
      }
    }
    if (data == "alreadyRegistered") {
      alert("Error. Because this business name is already registered before.");
    }
  };
  let cancelBusinessCreation = () => {
    console.log("cancelBusinessCreation");
    console.log("setnewBusiness", setnewBusiness);
    // newBusiness = "";
    setShowProgressBar(false);
    setnewBusiness("");
    $(".LinearProgress").hide();
  };
  useEffect(() => {
    setShowProgressBar(false);
  }, []);
  return (
    <div>
      <form action="" className="createBusinessForm" onSubmit={submitAlldatas}>
        <TextField
          required
          name="businessName"
          onChange={handleCreateForm}
          label="Enter Business Name"
        />
        <br /> <br />
        <div>
          <Button
            variant="contained"
            color="primary"
            type="Submit"
            value={"Create"}
          >
            Create
          </Button>{" "}
          <Button
            onClick={cancelBusinessCreation}
            id="cancelButton"
            type="button"
            value={"Cancel"}
            variant="contained"
            color="warning"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateBusiness;
