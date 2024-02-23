import axios from "axios";
import React, { useEffect, useState } from "react";
import EditProfileCss from "./EditProfile.module.css";

import $ from "jquery";
import { Box, Button, LinearProgress, Modal, TextField } from "@mui/material";
let serverUrl = localStorage.getItem("targetUrl");
function EditProfile({ EditProfileOpen, setEditProfileOpen }) {
  const [changePassword, setchangePassword] = useState(false);
  const [profileInfo, setprofileInfo] = useState({});
  let token = localStorage.getItem("storeToken");

  // const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
  };
  let handleUpdateSubmit = async (e) => {
    try {
      e.preventDefault();
      $("#LinearProgress2").show();
      let fullName = $('input[name="fullName"]').val(),
        phoneNumber = $('input[name="registerPhone"]').val(),
        oldPassword = $('input[name="registerPassword"]').val(),
        newPassword = "",
        retypeNewPassword = "";

      if (newPassword != retypeNewPassword) {
        alert("password mis mutch");
        return;
      }
      if (!changePassword) {
        // if we dont need to change password
        newPassword = "noChangeOnPassword";
      } else {
        // if we need to change passwords
        newPassword = $('input[name="password"]').val();
        retypeNewPassword = $('input[name="retypePassword"]').val();
        if (oldPassword == newPassword) {
          alert("your old and new password is the same.");
          return;
        }
      }
      let submitData = {
        fullName,
        phoneNumber,
        userPassword: oldPassword,
        newPassword,
        token,
      };
      let response = await axios.post(serverUrl + "updateUsers/", submitData);
      let data = response.data.data;

      if (response.data.data == "wrong old password") alert(response.data.data);
      else if (response.data.data == "no data found") {
        alert("you are not registered");
      } else if (response.data.data == "your data is updated") {
        alert("your data is updated");
      }
    } catch (error) {}
  };
  let getMyProfile = async () => {
    try {
      let response = await axios.post(serverUrl + "getMyProfile/", {
        token,
      });
      let rowData = response.data.data[0];
      setprofileInfo(rowData);
    } catch (error) {}
  };
  useEffect(() => {
    getMyProfile();
  }, []);
  useEffect(() => {
    let phoneNumber = profileInfo.phoneNumber,
      employeeName = profileInfo.employeeName;
    $('input[name="fullName"]').val(employeeName);
    $('input[name="registerPhone"]').val(phoneNumber);
  }, [profileInfo]);

  return (
    <>
      <Modal open={EditProfileOpen}>
        <Box>
          {Object.keys(profileInfo).length > 0 ? (
            <form
              className={EditProfileCss.userRegistrationForm}
              onSubmit={handleUpdateSubmit}
              action=""
            >
              <LinearProgress id={EditProfileCss.LinearProgress2} />
              <TextField
                className={EditProfileCss.TextFieldClass}
                required
                name="fullName"
                onChange={handleRegistrationChange}
                type="text"
                label="Full Name"
              />
              <br />
              <TextField
                className={EditProfileCss.TextFieldClass}
                required
                name="registerPhone"
                onChange={handleRegistrationChange}
                type="tel"
                label="Phone Number"
              />
              <br />
              <TextField
                className={EditProfileCss.TextFieldClass}
                required
                name="registerPassword"
                onChange={handleRegistrationChange}
                type="password"
                label="Old Password"
              />
              <br />
              {/* ////////////////// */}
              {changePassword ? (
                <>
                  <TextField
                    className={EditProfileCss.TextFieldClass}
                    required
                    name="password"
                    type="password"
                    label="New Password"
                  />
                  <br />
                  <TextField
                    className={EditProfileCss.TextFieldClass}
                    required
                    type="password"
                    name="retypePassword"
                    label="Retype Password"
                  />
                  <br />
                  <h4
                    className={EditProfileCss.changeOrNotPasswors}
                    onClick={() => setchangePassword(false)}
                  >
                    Don't Edit My Password
                  </h4>
                </>
              ) : (
                <h4
                  className={EditProfileCss.changeOrNotPasswors}
                  onClick={() => setchangePassword(true)}
                >
                  Edit My Password
                </h4>
              )}
              <br />
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
            </form>
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </>
  );
}
export default EditProfile;
