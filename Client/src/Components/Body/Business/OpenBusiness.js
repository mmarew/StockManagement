import React, { useEffect, useState, useContext } from "react";
import Transaction from "../Transaction/Transaction";
import AddTransaction from "./addTransaction.js";
import $ from "jquery";
import OpenBusinesscss from "./OpenBusiness.module.css";
import currentDate from "../Date/currentDate";
import SearchProducts from "./SearchManager.js";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AddItems from "./AddItems";
import Employee from "../AddEmployee/Employee";
import { LinearProgress } from "@mui/material";
import { InitialContext } from "../UserContext/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import OpenBusinessLeftSide from "./OpenBusinessLeftSide";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "rgb(25,118,210)",
    color: "#333",
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "white",
  },
  navLink: {
    textDecoration: "none",
    color: "white",
    marginLeft: theme.spacing(3),
    "&.active": {
      fontWeight: "bold",
    },
  },
}));

function OpenBusiness() {
  localStorage.setItem("openedBusiness", "myBusiness");
  const savedContext = useContext(InitialContext);
  const [ownersName, setownersName] = savedContext;
  useEffect(() => {
    $("#dateId").val(currentDate());
  }, []);
  let navigate = useNavigate();
  let registerItems = (e) => {
    console.log(e.target);
    $(".openBusinessTab").removeClass("activeLink");
    e.currentTarget.className += " activeLink";
  };

  const classes = useStyles();
  window.addEventListener("locationchange", function () {
    console.log("location changed!");
  });
  useEffect(() => {
    $("#LinearProgress").hide();
  }, []);

  return (
    <div>
      <h2 className={OpenBusinesscss.welcomeInfo}>
        Dear {savedContext}, Welcome to {localStorage.getItem("businessName")}
      </h2>
      <div className={OpenBusinesscss.openBusinesswrapper}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            {/* <div className={OpenBusinesscss.openBusinessHeader"> </div> */}

            <div className={OpenBusinesscss.registerViewSearch}>
              <Link
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="gotoHome"
                to="/"
                id="gotoHome"
              >
                Home
              </Link>
              <Link
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="addTransaction"
                to="addTransaction"
                id="addTransaction"
              >
                Transaction
              </Link>
              <Link
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="addItem"
                id="addItem"
                to="additems"
              >
                Items
              </Link>
              <Link
                id="View"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="View"
                to="view"
              >
                View
              </Link>
              <Link
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="Search"
                to="search"
                id="search"
              >
                Search
              </Link>
              <Link
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="Employee"
                to="Employee"
                id="Employee"
              >
                Employee
              </Link>
            </div>
          </Toolbar>
        </AppBar>
        <main className={OpenBusinesscss.MainWrapper}>
          <div className={OpenBusinesscss.leftSideDiv}>
            <OpenBusinessLeftSide />
          </div>
          <div className={OpenBusinesscss.middeleSideDiv}>
            <div className={OpenBusinesscss.dates}></div>
            <LinearProgress
              id="LinearProgress"
              className={OpenBusinesscss.LinearProgress}
            />
            <div className={OpenBusinesscss.businessInfoWrapper}>
              <Outlet />
              <div></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OpenBusiness;
