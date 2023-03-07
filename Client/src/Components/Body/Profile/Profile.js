import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  let navigate = useNavigate();
  let logoutofThisPage = () => {
    console.log("logoutofThisPage");
    localStorage.setItem("storeToken",'');
    let storeToken = localStorage.getItem("storeToken");
    if (storeToken == "" || storeToken == null) {
      navigate("/login");
    }
  };
  return (
    <div>
      <button onClick={logoutofThisPage} className="LogoutButton">
        Logout
      </button>
    </div>
  );
}

export default Profile;
