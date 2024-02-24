import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { ButtonProcessing } from "../Utilities/Utility";

function ModalToRemoveEmployerBusiness({ data }) {
  const [Processing, setProcessing] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  let { RemoveEmployerBusiness, setRemoveEmployerBusiness, getBusiness } = data;
  const [userPassword, setuserPassword] = useState(null);
  const [Errors, setErrors] = useState(null);
  let handleInputSubmit = async (e) => {
    try {
      e.preventDefault();
      setProcessing(true);
      let token = localStorage.getItem("storeToken");

      let Responces = await axios.post(
        serverAddress + "removeEmployeersBusiness/",
        { userPassword, token, businessId }
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
    setRemoveEmployerBusiness({ ...RemoveEmployerBusiness, open: false });
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
