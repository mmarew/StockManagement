import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ProfileCss from "../CSS/Profile.module.css";
import EditProfile from "../Components/Afterlogin/Profile/EditProfile";
import axios from "axios";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import { Box, Button, Modal, TextField } from "@mui/material";
import DeleteUsersProfile from "../Components/Afterlogin/Profile/DeleteUsersProfile";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
function Profile() {
  const [targetRender, settargetRender] = useState("");
  let navigate = useNavigate();
  let serverUrl = localStorage.getItem("targetUrl");
  let storeToken = localStorage.getItem("storeToken");

  useEffect(() => {
    if (storeToken == null || storeToken == undefined || storeToken == "") {
      navigate("/login");
    }
  }, [navigate, storeToken]);
  const [deleteProfileModal, setdeleteProfileModal] = useState(false);

  let handleEditeProfile = (e) => {
    setEditProfileOpen(true);
    settargetRender("EditProfile");
  };
  let Logout = async () => {
    localStorage.setItem("storeToken", "");
    let storeToken = localStorage.getItem("storeToken");
    localStorage.clear();
    if (storeToken == "" || storeToken == null) {
      navigate("/login");
    }
  };
  const [windowsInnerWidth, setWindowsInnerWidth] = useState(window.innerWidth);
  const [EditProfileOpen, setEditProfileOpen] = useState(true);
  window.addEventListener("resize", () => {
    setWindowsInnerWidth(window.innerWidth);
  });
  let { ownersName } = ConsumeableContext();
  return (
    <div className={ProfileCss.ProfileWrapper}>
      {windowsInnerWidth > 768 && (
        <div className={ProfileCss.leftOfProfile}>
          <LeftSideBusiness />
        </div>
      )}
      <div style={{ padding: "20px" }}>
        <br />
        {<h4>Hello {ownersName} , welcome to Smart Stock management system</h4>}
        <div className={ProfileCss.buttonContainer}>
          <Button
            // className={ProfileCss.editButton}
            onClick={handleEditeProfile}
          >
            Edit My Profile
          </Button>
          <Button
            // className={ProfileCss.deleteButton}
            onClick={() => {
              settargetRender("DeleteProfile");
              setdeleteProfileModal(true);
            }}
          >
            Delete My Profile
          </Button>
          <Button
            //  className={ProfileCss.logoutButton}
            onClick={Logout}
          >
            Logout
          </Button>
        </div>
        {targetRender === "EditProfile" ? (
          <EditProfile
            EditProfileOpen={EditProfileOpen}
            setEditProfileOpen={setEditProfileOpen}
          />
        ) : targetRender === "DeleteProfile" ? (
          <DeleteUsersProfile
            data={{
              deleteProfileModal,
              setdeleteProfileModal,
              settargetRender,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Profile;
