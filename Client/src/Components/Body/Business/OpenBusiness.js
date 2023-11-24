import React, { useEffect, useState, useContext } from "react";
import $ from "jquery";
import homeIcon from "../../ICONS/BusinessJS/iconHomeBlack.svg";
import businessIcon from "../../ICONS/BusinessJS/businessBlack.svg";
import transactionIcon from "../../ICONS/BusinessJS/transactionBlack.svg";
import EmployeeIcon from "../../ICONS/BusinessJS/iconEmployee.svg";
import viewIcon from "../../ICONS/BusinessJS/iconView.svg";
import ItemsIcon from "../../ICONS/BusinessJS/iconItems.svg";
import OpenBusinesscss from "./OpenBusiness.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, LinearProgress, Menu } from "@mui/material";
import { ConsumeableContext } from "../UserContext/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Box, MenuItem, Toolbar } from "@material-ui/core";
import OpenBusinessLeftSide from "./OpenBusinessLeftSide";
import HoverableLink from "./HoverableLink";
import BadgeIcons from "../../utility/BadgeIcons";
import OpenBusinessHome from "./OpenBusinessHome";
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
  const { ownersName, setownersName, ShowProgressBar, setShowProgressBar } =
    ConsumeableContext();
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
    setShowProgressBar(false);
    window.addEventListener("resize", setScreenSize(window.innerWidth));
  }, []);
  /////////////////////////////////////

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    // Handle the option click here
    console.log("Option clicked:", option);
    handleMenuClose();
  };
  //////////////////////////
  return (
    <div className={OpenBusinesscss.openBusinesswrapper}>
      <div className={OpenBusinesscss.navBar}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <div className={OpenBusinesscss.registerViewSearch}>
              <HoverableLink
                title="Open Business"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="gotoHome"
                to="/OpenBusiness"
                id="Open Business"
              >
                <IconButton className={OpenBusinesscss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={OpenBusinesscss.openBusIcon}
                    src={homeIcon}
                  />
                  <span className={OpenBusinesscss.Title}>Home</span>
                </IconButton>
              </HoverableLink>{" "}
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
                <IconButton className={OpenBusinesscss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={OpenBusinesscss.openBusIcon}
                    src={transactionIcon}
                    alt="transaction"
                  />{" "}
                  <span className={OpenBusinesscss.Title}>Sale/Buy</span>
                </IconButton>
              </HoverableLink>
              <HoverableLink
                title="Add Item"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="addItem"
                id="addItem"
                to="additems"
              >
                <IconButton className={OpenBusinesscss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={OpenBusinesscss.openBusIcon}
                    src={ItemsIcon}
                    alt="transaction"
                  />{" "}
                  <span className={OpenBusinesscss.Title}>Item</span>
                </IconButton>
              </HoverableLink>
              <HoverableLink
                title="Search"
                onClick={registerItems}
                className={OpenBusinesscss.openBusinessTab}
                name="Search"
                to="search"
                id="search"
              >
                <IconButton className={OpenBusinesscss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={OpenBusinesscss.openBusIcon}
                    src={viewIcon}
                    alt="transaction"
                  />{" "}
                  <span className={OpenBusinesscss.Title}>View</span>
                </IconButton>
                {/* <img src={viewIcon} /> */}
              </HoverableLink>
              <span>
                <IconButton
                  sx={{ display: "flex", flexDirection: "column" }}
                  aria-label="Options"
                  aria-controls="three-dot-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon sx={{ color: "black", marginTop: "10px" }} />

                  <span style={{}} className={OpenBusinesscss.Title}>
                    More
                  </span>
                </IconButton>
                <Menu
                  id="three-dot-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleOptionClick("Option 1")}>
                    <HoverableLink
                      title="Employee"
                      onClick={registerItems}
                      className={OpenBusinesscss.openBusinessTab}
                      name="Employee"
                      to="Employee"
                      id="Employee"
                    >
                      <IconButton
                        className={OpenBusinesscss.iconButton}
                        style={{ flexDirection: "row" }}
                      >
                        <img
                          style={{ width: "30px", marginRight: "10px" }}
                          className={OpenBusinesscss.openBusIcon}
                          src={EmployeeIcon}
                          alt="transaction"
                        />{" "}
                        <span className={OpenBusinesscss.Title}>Employee</span>
                      </IconButton>
                      {/* <img src={E} /> */}
                    </HoverableLink>
                  </MenuItem>
                  <MenuItem>
                    <HoverableLink
                      title="Open Business"
                      onClick={registerItems}
                      className={OpenBusinesscss.openBusinessTab}
                      name="gotoBusiness"
                      to="/"
                      id="Open Business"
                    >
                      <IconButton
                        style={{ flexDirection: "row" }}
                        className={OpenBusinesscss.iconButton}
                      >
                        <img
                          style={{ width: "30px", marginRight: "10px" }}
                          className={OpenBusinesscss.openBusIcon}
                          src={businessIcon}
                        />
                        <span className={OpenBusinesscss.Title}>Business</span>
                      </IconButton>
                    </HoverableLink>
                  </MenuItem>
                </Menu>
              </span>
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

          <h2 className={OpenBusinesscss.welcomeInfo}>
            Dear {ownersName}, Welcome to {localStorage.getItem("businessName")}
          </h2>

          <div className={OpenBusinesscss.businessInfoWrapper}>
            <Outlet />
            {ShowProgressBar && (
              <Box sx={{ padding: "10px 0" }}>
                <LinearProgress />
              </Box>
            )}
            <div></div>
          </div>
        </div>
      </main>
      {HoverableTitle}
    </div>
  );
}

export default OpenBusiness;
