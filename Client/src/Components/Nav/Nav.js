import React, { useContext, useEffect, useState } from "react";
import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { InitialContext } from "../Body/UserContext/UserContext";

export default function Nav() {
  const savedContext = useContext(InitialContext);
  const [ownersName, setownersName] = savedContext;
  console.log(savedContext);
  let serverAddress = localStorage.getItem("targetUrl");
  let url = window.location.url;
  let navigate = useNavigate();
  // const [ownersName, setownersName] = useState("");
  let VerifyLogin = async () => {
    let savedToken = localStorage.getItem("storeToken");
    console.log("savedStore ===== " + savedToken);
    if (savedToken == null || savedToken == "") {
      navigate("/login");
      return;
    }
    let response = await axios.post(serverAddress + "verifyLogin/", {
      token: savedToken,
    });
    if (response.data.data == "alreadyConnected") {
      let employeeName = response.data.result[0].employeeName;
      employeeName = employeeName.split(" ")[0];
      setownersName(employeeName);
      // navigate("/");
    } else {
      navigate("/Login");
    }
  };
  useEffect(() => {
    VerifyLogin();
  }, []);
  let hundleNavigationBar = (e) => {
    console.log(e.target);
    $(".Lists").removeClass("active");
    $(e.target).addClass("active");
  };
  return (
    <div className="navLinks">
      <Link onClick={hundleNavigationBar} className="Lists" to="/Business">
        BUSSINESS
      </Link>
      <Link onClick={hundleNavigationBar} className="Lists" to="/help">
        HELP
      </Link>
      <Link
        onClick={hundleNavigationBar}
        className="Lists ownerName"
        to="/Profiles"
      >
        {ownersName != "" ? ownersName : "PROFILE"}
      </Link>
    </div>
  );
}
