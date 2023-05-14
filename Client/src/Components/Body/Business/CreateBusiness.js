import axios from "axios";
import React, { useState } from "react";
import "./CreateBusiness.css";
function CreateBusiness({ getBusiness, setnewBusiness }) {
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
    let response = await axios.post(
      serverAddress + "createBusiness/",
      businessData
    );
    console.log(response.data);
    let data = response.data.data;
    if (data == "created well") {
      setnewBusiness("");
      alert("Your business is created well. Thankyou.");
      getBusiness();
    }
    if (data == "alreadyRegistered") {
      alert("Error. Because this business name is already registered before.");
    }
  };
  let cancelBusinessCreation = () => {
    console.log("cancelBusinessCreation");
    console.log("setnewBusiness", setnewBusiness);
    // newBusiness = "";
    setnewBusiness("");
  };
  return (
    <div>
      <form action="" className="createBusinessForm" onSubmit={submitAlldatas}>
        <input
          required
          name="businessName"
          onChange={handleCreateForm}
          placeholder="Business name"
        />
        <div>
          <button type="Submit" value={"Create"}>
            Create
          </button>{" "}
          <button
            onClick={cancelBusinessCreation}
            id="cancelButton"
            type="button"
            value={"Cancel"}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBusiness;
