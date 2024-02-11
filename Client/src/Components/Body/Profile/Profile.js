import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ProfileCss from "./Profile.module.css";
import EditProfile from "./EditProfile";
import axios from "axios";
import $ from "jquery";
import LeftSideBusiness from "../../LeftSide/LeftSideBusiness";
import { Box, Button, Modal, TextField } from "@mui/material";
function Profile() {
  const [targetRender, settargetRender] = useState("");
  let navigate = useNavigate();
  let serverUrl = localStorage.getItem("targetUrl");
  let storeToken = localStorage.getItem("storeToken");
  console.log("storeToken", storeToken);

  useEffect(() => {
    if (storeToken == null || storeToken == undefined || storeToken == "") {
      console.log("storeToken", storeToken);
      navigate("/login");
    }
  }, [navigate, storeToken]);
  const [deleteProfileModal, setdeleteProfileModal] = useState(false);
  const [Password, setPassword] = useState(null);
  let deleteProfile = async () => {
    $("button").removeClass(ProfileCss.ActiveButton);
    settargetRender("DeleteProfile");

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
  };
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

  return (
    <div className={ProfileCss.ProfileWrapper}>
      {windowsInnerWidth > 768 && (
        <div className={ProfileCss.leftOfProfile}>
          <LeftSideBusiness />
        </div>
      )}
      <div>
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
              }}
            >
              <form
                className={ProfileCss.deleteProfileForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  deleteProfile();
                }}
              >
                <TextField
                  className={ProfileCss.passwordInput}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={Password}
                  label="Enter Your Password"
                />
                <br />
                <br />
                <Box className={ProfileCss.deleteProfileButtons}>
                  <Button
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
              </form>
            </Box>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Profile;
