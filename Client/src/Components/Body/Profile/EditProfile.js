import axios from "axios";
import React, { useEffect, useState } from "react";
import EditProfileCss from "./EditProfile.module.css";

import $ from "jquery";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
let serverUrl = localStorage.getItem("targetUrl");
function EditProfile() {
  const [changePassword, setchangePassword] = useState(false);
  const [profileInfo, setprofileInfo] = useState({});
  // const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
  };
  let handleUpdateSubmit = async (e) => {
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
      oldPassword,
      newPassword,
      myToken,
    };
    let response = await axios.post(serverUrl + "updateUsers/", submitData);
    let data = response.data.data;
    console.log("response is ", response);

    if (response.data.data == "wrong old password") alert(response.data.data);
    else if (response.data.data == "no data found") {
      alert("you are not registered");
    } else if (response.data.data == "your data is updated") {
      alert("your data is updated");
    }
  };
  let myToken = localStorage.getItem("storeToken");
  let getMyProfile = async () => {
    let response = await axios.post(serverUrl + "getMyProfile/", {
      myToken,
    });
    let rowData = response.data.data[0];
    setprofileInfo(rowData);
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
      {Object.keys(profileInfo).length > 0 ? (
        <form
          className={EditProfileCss.userRegistrationForm}
          onSubmit={handleUpdateSubmit}
          action=""
        >
          <LinearProgress id={EditProfileCss.LinearProgress2} />
          <input
            required
            name="fullName"
            onChange={handleRegistrationChange}
            type="text"
            placeholder="Full Name"
          />
          <input
            required
            name="registerPhone"
            onChange={handleRegistrationChange}
            type="tel"
            placeholder="phone number"
          />

          <input
            required
            name="registerPassword"
            onChange={handleRegistrationChange}
            type="password"
            placeholder="Old Password"
          />
          {/* ////////////////// */}
          {changePassword ? (
            <>
              <input
                required
                name="password"
                type="password"
                placeholder="Type new password"
              />
              <input
                required
                type="password"
                name="retypePassword"
                placeholder="Re type password"
              />
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

          <input
            name="submitButton"
            type="submit"
            placeholder=""
            value="Update"
          />
        </form>
      ) : (
        ""
      )}
    </>
  );
}
export default EditProfile;
