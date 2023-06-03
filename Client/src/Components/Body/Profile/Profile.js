import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ProfileCss from "./Profile.module.css";
import EditProfile from "./EditProfile";
import axios from "axios";
import $ from "jquery";
function Profile() {
  const [targetRender, settargetRender] = useState("");
  let navigate = useNavigate();
  let serverUrl = localStorage.getItem("targetUrl");
  let storeToken = localStorage.getItem("storeToken");
  let logoutofThisPage = () => {
    localStorage.setItem("storeToken", "");
    storeToken = localStorage.getItem("storeToken");
    if (storeToken == "" || storeToken == null) {
      navigate("/login");
    }
  };
  let deleteProfile = async () => {
    $("button").removeClass(ProfileCss.ActiveButton);
    settargetRender("DeleteProfile");
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to do this?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            let Password = prompt("Please enter your Password");
            if (Password != null)
              if (Password.length > 0) {
                let responces = await axios.post(serverUrl + "deleteUsers/", {
                  storeToken,
                  Password,
                });
                console.log("responces", responces);
                if (responces.data.data == "deleted data") {
                  alert("you are deleted from stock management system");
                  localStorage.removeItem("storeToken");
                  navigate("/login");
                } else if (responces.data.data == "wrong password") {
                  alert("wrong password confirmation");
                }
              }
          },
        },
        {
          label: "No",
          onClick: () => "",
        },
      ],
    });
  };
  let handleEditeProfile = (e) => {
    $(".ActiveButton").removeClass(ProfileCss.ActiveButton);
    $(e.target).addClass(ProfileCss.ActiveButton);
    settargetRender("EditProfile");
  };
  return (
    <>
      <div className={ProfileCss.EditDeleteProfileWrapper}>
        <button onClick={handleEditeProfile}>Edit My Profile</button>
        <button onClick={deleteProfile}>Delete My profile</button>
      </div>
      {targetRender == "EditProfile" ? (
        <EditProfile />
      ) : targetRender == "DeleteProfile" ? (
        ""
      ) : (
        ""
      )}
      <button onClick={logoutofThisPage} className={ProfileCss.LogoutButton}>
        Logout My profile
      </button>
    </>
  );
}

export default Profile;
