import React, { useEffect } from "react";
import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Nav() {
  let navigate = useNavigate();
  let VerifyLogin = async () => {
    let savedStore = localStorage.getItem("storeToken");
    console.log("savedStore ===== " + savedStore);
    if (savedStore == null || savedStore == "") {
      navigate("/login");
      return;
    }
    let response = await axios.post("http://localhost:2020/verifyLogin", {
      token: savedStore,
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

  return (
    <div className="navLinks">
      <Link className="Lists" to="/Business">
        Business
      </Link>
      {/* <Link className="Lists" to="/Transaction">
        Transaction
      </Link> <Link className="Lists" to="/products"></Link>   <Link className="Lists" to="/addEmployee">
        Employee
      </Link> <Link className="Lists" to="/Reports">
        Reports
      </Link> */}
      <Link className="Lists" to="/Profiles">
        Profiles
      </Link>
    </div>
  );
}
