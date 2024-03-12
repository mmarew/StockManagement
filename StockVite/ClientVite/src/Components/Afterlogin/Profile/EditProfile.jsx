import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, LinearProgress, Modal, TextField } from "@mui/material";
import EditProfileCss from "./EditProfile.module.css";
import VerifyLogin from "../../../Pages/VerifyLogin";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";

let serverUrl = localStorage.getItem("targetUrl");
let token = localStorage.getItem("storeToken");

function EditProfile({ EditProfileOpen, setEditProfileOpen }) {
  let { setownersName } = ConsumeableContext();
  const [Errors, setErrors] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  const [Processing, setProcessing] = useState(false);
  const [RegisterForm, setRegisterForm] = useState({
    fullName: "",
    phoneNumber: "",
    userPassword: "",
    retypePassword: "",
    newPassword: "noChangeOnPassword",
    token,
  });

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({ ...RegisterForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const { newPassword, retypePassword } = RegisterForm;

      if (
        newPassword !== "noChangeOnPassword" &&
        newPassword !== retypePassword
      ) {
        alert("Passwords do not match");
        setProcessing(false);
        return;
      }

      const response = await axios.post(serverUrl + "updateUsers/", {
        ...RegisterForm,
      });
      const data = response.data.data;

      if (data === "wrong old password" || data === "wrong Password.") {
        alert(data);
      } else if (data === "no data found") {
        alert("You are not registered");
      } else if (data === "your data is updated") {
        alert("Your data is updated");
        await VerifyLogin();
        setownersName(localStorage.getItem("ownersName"));
      }
    } catch (error) {
      setErrors(error.message);
    }

    setProcessing(false);
  };

  const getMyProfile = async () => {
    setProcessing(true);

    try {
      const response = await axios.post(serverUrl + "getMyProfile/", { token });
      const rowData = response.data.data[0];
      setProfileInfo(rowData);
    } catch (error) {
      setErrors(error.message);
    }

    setProcessing(false);
  };

  useEffect(() => {
    getMyProfile();
  }, []);

  useEffect(() => {
    const { phoneNumber, employeeName } = profileInfo;
    setRegisterForm({
      ...RegisterForm,
      fullName: employeeName,
      registerPhone: phoneNumber,
    });
  }, [profileInfo]);

  return (
    <Modal open={EditProfileOpen}>
      <Box>
        {Object.keys(profileInfo).length > 0 && (
          <form
            className={EditProfileCss.userRegistrationForm}
            onSubmit={handleUpdateSubmit}
          >
            {Errors && (
              <Box sx={{ color: "red", margin: "10px,0" }}>{Errors}</Box>
            )}
            <LinearProgress
              style={{
                visibility: Processing ? "visible" : "hidden",
                margin: "10px 0",
              }}
            />
            <TextField
              className={EditProfileCss.TextFieldClass}
              required
              name="fullName"
              value={RegisterForm.fullName}
              onChange={handleRegistrationChange}
              type="text"
              label="Full Name"
            />
            <br />
            <TextField
              className={EditProfileCss.TextFieldClass}
              required
              name="phoneNumber"
              value={RegisterForm.phoneNumber}
              onChange={handleRegistrationChange}
              type="tel"
              label="Phone Number"
            />
            <br />
            <TextField
              className={EditProfileCss.TextFieldClass}
              required
              name="userPassword"
              value={RegisterForm.userPassword}
              onChange={handleRegistrationChange}
              type="password"
              label="Old Password"
            />
            <br />
            {changePassword ? (
              <>
                <TextField
                  className={EditProfileCss.TextFieldClass}
                  required
                  name="newPassword"
                  value={RegisterForm.newPassword}
                  onChange={handleRegistrationChange}
                  type="password"
                  label="New Password"
                />
                <br />
                <TextField
                  className={EditProfileCss.TextFieldClass}
                  required
                  name="retypePassword"
                  value={RegisterForm.retypePassword}
                  onChange={handleRegistrationChange}
                  type="password"
                  label="Retype Password"
                />
                <br />
                <h4
                  className={EditProfileCss.changeOrNotPasswors}
                  onClick={() => setChangePassword(false)}
                >
                  Don't Edit My Password
                </h4>
              </>
            ) : (
              <h4
                className={EditProfileCss.changeOrNotPasswors}
                onClick={() => setChangePassword(true)}
              >
                Edit My Password
              </h4>
            )}
            <br />
            {Processing ? (
              <Button disabled variant="contained" color="primary">
                Processing...
              </Button>
            ) : (
              <Box>
                <Button
                  className={EditProfileCss.TextFieldClass}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>{" "}
                <Button
                  color="error"
                  onClick={() => {
                    setEditProfileOpen(false);
                  }}
                  variant="contained"
                >
                  Close
                </Button>
              </Box>
            )}
          </form>
        )}
      </Box>
    </Modal>
  );
}

export default EditProfile;
