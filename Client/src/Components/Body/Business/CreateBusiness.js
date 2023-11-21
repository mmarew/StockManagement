import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CreateBusiness.css";
// import $ from "jquery";
import { Box, Button, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../../utility/Utility";

function CreateBusiness({
  getBusiness,
  setnewBusiness,
  setShowProgressBar,
  newBusiness,
}) {
  const [Process, setProcess] = useState(false);
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

    console.log("businessData is = ", businessData);

    console.log("setShowProgressBar", setShowProgressBar);
    setShowProgressBar(true);

    setProcess(true);
    try {
      let response = await axios.post(
        serverAddress + "createBusiness/",
        businessData
      );
      setProcess(false);
      console.log("createBusiness response is =", response);
      setShowProgressBar(false);
      getBusiness();
      window.location.reload();
      console.log(response.data);
      let data = response.data.data;

      if (data === "created well") {
        let registerBusinessName =
          response.data.tableCollections.registerBusinessName;
        console.log(response.data.tableCollections.registerBusinessName);

        if (registerBusinessName === "regesteredBefore") {
          alert(
            "This business name is reserved before. Please change its name. Thank you."
          );
        } else {
          setnewBusiness("");
          alert("Your business is created successfully. Thank you.");
        }
      } else if (data === "alreadyRegistered") {
        alert("Error. This business name is already registered before.");
      }
      if (response.data.error === "Unable to create tables.") {
        alert(response.data.error);
      }
      if (response.data.error === "registeredBefore") {
        alert(
          "Sorry, you cannot create this business because its name is already reserved before."
        );
      }
    } catch (error) {
      console.error("Error creating business:", error);
      setShowProgressBar(false);
      alert("An error occurred while creating the business.");
    }
  };

  let cancelBusinessCreation = () => {
    console.log("cancelBusinessCreation");
    console.log("setnewBusiness", setnewBusiness);
    setShowProgressBar(false);
    setnewBusiness("");
  };

  useEffect(() => {
    setShowProgressBar(false);
  }, []);

  return (
    <div>
      <Modal open={newBusiness.Open}>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <form
            style={{ width: "300px" }}
            action=""
            className="createBusinessForm"
            onSubmit={submitAlldatas}
          >
            <TextField
              fullWidth
              required
              name="businessName"
              onChange={handleCreateForm}
              label="Enter Business Name"
            />
            <br /> <br />
            <div style={{ textAlign: "center" }}>
              {!Process ? (
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              ) : (
                <ButtonProcessing />
              )}
              &nbsp;&nbsp;&nbsp;
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
        </Box>
      </Modal>
    </div>
  );
}

export default CreateBusiness;
