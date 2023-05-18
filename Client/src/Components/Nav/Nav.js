import React, { useEffect } from "react";
import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
export default function Nav() {
  let serverAddress = localStorage.getItem("targetUrl");
  let url = window.location.url;
  console.log(url);
  let navigate = useNavigate();
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
    console.log("response == ", response.data);
    if (response.data.data == "alreadyConnected") {
      console.log("alreadyConnected");
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
        Business
      </Link>
      {/* <Link className="Lists" to="/Transaction">
        Transaction
      </Link> <Link className="Lists" to="/products"></Link>   <Link className="Lists" to="/addEmployee">
        Employee
      </Link> <Link className="Lists" to="/Reports">
        Reports
      </Link> */}
      <Link onClick={hundleNavigationBar} className="Lists" to="/Profiles">
        Profiles
      </Link>
      <Link onClick={hundleNavigationBar} className="Lists" to="/help">
        Help
      </Link>
    </div>
  );
}
