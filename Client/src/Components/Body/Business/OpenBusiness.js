import React, { useEffect, useState } from "react";
import Transaction from "../Transaction/Transaction";
import AddTransaction from "./addTransaction.js";
import $ from "jquery";
import "./OpenBusiness.css";
import currentDate from "../Date/currentDate";
import SearchProducts from "./SearchProducts";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AddItems from "./AddItems";
import Employee from "../AddEmployee/Employee";
function OpenBusiness() {
  const [ActiveBody, setBody] = useState();
  const [selectedTime, setselectedTime] = useState("");
  useEffect(() => {
    $("#dateId").val(currentDate());
  }, []);
  let navigate = useNavigate();
  let registerItems = (e) => {
    console.log(e.target);
    $(".openBusinessTab").removeClass("activeLink");
    e.currentTarget.className += " activeLink";
    setBody("loading...");
    console.log(e.target.name);
    if (e.target.name == "") {
      navigate("/");
    }
    if (e.target.name == "addTransaction") {
      setBody(<AddTransaction />);
    } else if (e.target.name == "addItem") {
      // setBody(<AddProducts />);
      setBody(<AddItems />);
    } else if (e.target.name == "View") {
      setBody(<Transaction />);
    } else if (e.target.name == "Search") {
      setBody(<SearchProducts />);
    } else if (e.target.name == "Employee") {
      setBody(<Employee />);
    }
  };

  return (
    <div>
      <h2 className="welcomeInfo">
        Welcome to {localStorage.getItem("businessName")}
      </h2>
      <div className="registerViewSearch">
        <Link
          onClick={registerItems}
          className="openBusinessTab"
          name="gotoHome"
          to="/"
          id="gotoHome"
        >
          Home
        </Link>
        <Link
          onClick={registerItems}
          className="openBusinessTab"
          name="addTransaction"
          to="addTransaction"
          id="addTransaction"
        >
          Transaction
        </Link>
        <Link
          onClick={registerItems}
          className="openBusinessTab"
          name="addItem"
          id="addItem"
          to="additems"
        >
          Items
        </Link>
        <Link
          id="View"
          onClick={registerItems}
          className="openBusinessTab"
          name="View"
          to="view"
        >
          View
        </Link>
        <Link
          onClick={registerItems}
          className="openBusinessTab"
          name="Search"
          to="search"
          id="search"
        >
          Search
        </Link>
        <Link
          onClick={registerItems}
          className="openBusinessTab"
          name="Employee"
          to="Employee"
          id="Employee"
        >
          Employee
        </Link>
      </div>
      <br />
      <br />
      <div className="dates">
        {/* <input
          onChange={(e) => {
            console.log(e.target.value);
            setselectedTime(e.target.value);
          }}
          type="date"
          name=""
          id="dateId"
        /> */}
      </div>
      {/* {ActiveBody} */}
      <Outlet />
    </div>
  );
}

export default OpenBusiness;
