import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import ProfileCss from "../../../CSS/Profile.module.css";
import axios from "axios";
import ErrorHandler from "../../Utilities/ErrorHandler";
import { ButtonProcessing } from "../../Utilities/Utility";
let serverUrl = localStorage.getItem("targetUrl");
let storeToken = localStorage.getItem("storeToken");
let errodData = {
  Message: "",
  Detail: "",
};
function DeleteUsersProfile({ data }) {
  let { deleteProfileModal, setdeleteProfileModal, settargetRender } = data;
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState(errodData);
  const [Password, setPassword] = useState(null);
  const [Processing, setProcessing] = useState(null);
  let deleteProfile = async () => {
    settargetRender("DeleteProfile");
    setErrorsOrSuccess({ ...errodData });
    setProcessing(true);
    try {
      if (Password != null)
        if (Password.length > 0) {
          let responces = await axios.post(serverUrl + "deleteUsers/", {
            token: storeToken,
            userPassword: Password,
          });
          setProcessing(false);
          if (responces.data.data == "deleted data") {
            alert("you are deleted from stock management system");
            localStorage.removeItem("storeToken");
            navigate("/login");
          } else if (responces.data.data == "wrong password") {
            setErrorsOrSuccess({
              ...errodData,
              Detail: "wrong password confirmation",
            });
          }
        }
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setErrorsOrSuccess);
    }
  };

  return (
    <div>
      <Modal open={deleteProfileModal}>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 4,
            boxShadow: 4,
            maxWidth: "400px",
            width: "80%",
          }}
        >
          <h5> Are you sure you want to delete your profile?</h5>
          <div style={{ color: "red", margin: "20px" }}>
            {" "}
            {ErrorsOrSuccess.Detail}
          </div>
          <form
            className={ProfileCss.deleteProfileForm}
            onSubmit={(e) => {
              e.preventDefault();
              deleteProfile();
            }}
          >
            <TextField
              required
              fullWidth
              type="password"
              className={ProfileCss.passwordInput}
              onChange={(e) => {
                setErrorsOrSuccess({ ...errodData });
                setPassword(e.target.value);
              }}
              value={Password}
              label="Enter Your Password"
            />
            <br />
            <br />
            {Processing ? (
              <ButtonProcessing />
            ) : (
              <Box className={ProfileCss.deleteProfileButtons}>
                <Button
                  sx={{
                    marginRight: "10px",
                  }}
                  className={ProfileCss.deleteSubmitButton}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  className={ProfileCss.deleteCloseButton}
                  onClick={() => {
                    setdeleteProfileModal(false);
                  }}
                  variant="contained"
                  color="error"
                >
                  Close
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteUsersProfile;
