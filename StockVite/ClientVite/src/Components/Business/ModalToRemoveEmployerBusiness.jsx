import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { ButtonProcessing } from "../Utilities/Utility";

function ModalToRemoveEmployerBusiness({ data }) {
  // console.log("data", data);
  const [Processing, setProcessing] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  let { RemoveEmployerBusiness, setRemoveEmployerBusiness } = data;
  let { getBusiness, items } = RemoveEmployerBusiness;
  let businessId = items?.BusinessID;
  const [userPassword, setuserPassword] = useState(null);
  const [Errors, setErrors] = useState(null);
  let handleInputSubmit = async (e) => {
    try {
      e.preventDefault();
      setProcessing(true);
      let formdata = { userPassword, token, businessId };
      // return;
      let Responces = await axios.post(
        serverAddress + "removeEmployeersBusiness/",
        formdata
      );
      let { data } = Responces.data;
      if (data == "wrong Password.") setErrors(data);
      else {
        getBusiness();
        handleClose();
      }
      setProcessing(false);
    } catch (error) {
      setErrors(error.message);
    }
  };
  let handleClose = () => {
    setRemoveEmployerBusiness({ ...RemoveEmployerBusiness, Open: false });
  };
  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <form onSubmit={handleInputSubmit}>
          <div>NB: You are removing this busines.</div>
          <br />
          <TextField
            label="Enter Password"
            fullWidth
            onChange={(e) => {
              setuserPassword(e.target.value);
            }}
            type="password"
          />
          {!Processing ? (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              &nbsp; &nbsp;
              <Button color="warning" onClick={handleClose} variant="contained">
                Cancel
              </Button>
            </div>
          ) : (
            <ButtonProcessing />
          )}
        </form>
        {Errors && <SuccessOrError request={Errors} setErrors={setErrors} />}
      </Box>
    </Modal>
  );
}

export default ModalToRemoveEmployerBusiness;
