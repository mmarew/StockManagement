import React, { useEffect, useState, useContext } from "react";
import $ from "jquery";
import homeIcon from "../../ICONS/BusinessJS/iconHomeBlack.svg";
import transactionIcon from "../../ICONS/BusinessJS/transactionBlack.svg";
import EmployeeIcon from "../../ICONS/BusinessJS/iconEmployee.svg";
import viewIcon from "../../ICONS/BusinessJS/iconView.svg";
import ItemsIcon from "../../ICONS/BusinessJS/iconItems.svg";
import OpenBusinesscss from "./OpenBusiness.module.css";
import currentDate from "../Date/currentDate";
import { Outlet, useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { ConsumeableContext } from "../UserContext/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import OpenBusinessLeftSide from "./OpenBusinessLeftSide";
import HoverableLink from "./HoverableLink";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "white",
    // backgroundColor: "rgb(25,118,210)",
    // color: "#333",
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
  const [HoverableTitle, setHoverableTitle] = useState("");
  // localStorage.setItem("openedBusiness", "myBusiness");
  // const savedContext = ConsumeableContext();
  const { ownersName, setownersName } = ConsumeableContext();
  setownersName(localStorage.getItem("ownersName"));

  let navigate = useNavigate();
  let registerItems = (e) => {
    console.log(e.target);
    $("." + OpenBusinesscss.openBusinessTab).removeClass(
      OpenBusinesscss.activeLink
    );
    e.currentTarget.className += " " + OpenBusinesscss.activeLink;
  };

  const classes = useStyles();
  window.addEventListener("locationchange", function () {
    console.log("location changed!");
  });
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  useEffect(() => {
    $("#dateId").val(currentDate());
    $(".LinearProgress").css("display", "none");
    window.addEventListener("resize", setScreenSize(window.innerWidth));
  }, []);
  return (
    <div className={OpenBusinesscss.openBusinesswrapper}>
      <div className={OpenBusinesscss.navBar}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <div className={OpenBusinesscss.registerViewSearch}>
              <HoverableLink
                title="Go To Home"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="gotoHome"
                to="/"
                id="gotoHome"
              >
                <img className={OpenBusinesscss.openBusIcon} src={homeIcon} />
              </HoverableLink>

              <HoverableLink
                title="Transaction"
                onClick={(e) => {
                  registerItems(e);

                  setHoverableTitle();
                }}
                className={OpenBusinesscss.openBusinessTab}
                name="addTransaction"
                to="addTransaction"
                id="addTransaction"
              >
                <img
                  className={OpenBusinesscss.openBusIcon}
                  src={transactionIcon}
                  alt="transaction"
                />
              </HoverableLink>

              <HoverableLink
                title="Add Item"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="addItem"
                id="addItem"
                to="additems"
              >
                <img src={ItemsIcon} />
              </HoverableLink>

              <HoverableLink
                title="Search"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="Search"
                to="search"
                id="search"
              >
                <img src={viewIcon} />
              </HoverableLink>

              <HoverableLink
                title="Employee"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="Employee"
                to="Employee"
                id="Employee"
              >
                <img src={EmployeeIcon} />
              </HoverableLink>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <main className={OpenBusinesscss.MainWrapper}>
        {console.log("screenSize == " + screenSize)}
        {screenSize > 768 && (
          <div className={OpenBusinesscss.leftSideDiv}>
            <OpenBusinessLeftSide />
          </div>
        )}
        <div className={OpenBusinesscss.middeleSideDiv}>
          <div className={OpenBusinesscss.dates}></div>
          <LinearProgress id="LinearProgress" className={"LinearProgress"} />
          <h2 className={OpenBusinesscss.welcomeInfo}>
            Dear {ownersName}, Welcome to {localStorage.getItem("businessName")}
          </h2>
          <div className={OpenBusinesscss.businessInfoWrapper}>
            <Outlet />
            <div></div>
          </div>
        </div>
      </main>
      {HoverableTitle}
    </div>
  );
}

export default OpenBusiness;
