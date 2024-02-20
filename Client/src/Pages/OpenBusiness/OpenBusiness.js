import React, { useEffect, useState, useContext } from "react";
import homeIcon from "../../Components/ICONS/BusinessJS/iconHomeBlack.svg";
import businessIcon from "../../Components/ICONS/BusinessJS/businessBlack.svg";
import transactionIcon from "../../Components/ICONS/BusinessJS/transactionBlack.svg";
import EmployeeIcon from "../../Components/ICONS/BusinessJS/iconEmployee.svg";
import viewIcon from "../../Components/ICONS/BusinessJS/iconView.svg";
import ItemsIcon from "../../Components/ICONS/BusinessJS/iconItems.svg";
import OpenBusinesscss from "../../CSS/OpenBusiness.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, LinearProgress, Menu } from "@mui/material";
import { ConsumeableContext } from "../../Components/Body/UserContext/UserContext";

import { AppBar, Box, MenuItem, Toolbar } from "@mui/material";
import OpenBusinessLeftSide from "../../Components/OPEN/OpenBusinessLeftSide";
import HoverableLink from "../../Components/Body/HoverableLink";

function OpenBusiness() {
  const [HoverableTitle, setHoverableTitle] = useState("");

  let Navigate = useNavigate();
  const { ownersName, setownersName, ShowProgressBar, setShowProgressBar } =
    ConsumeableContext();
  useEffect(() => {
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  let registerItems = (activeTab) => {
    setActiveTab(activeTab);
  };

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
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  useEffect(() => {
    console.log("first location", location);
    setActiveTab(location.pathname);
  }, [location]);
  //////////////////////////
  return (
    <div className={OpenBusinesscss.openBusinesswrapper}>
      <div className={OpenBusinesscss.navBar}>
        <AppBar sx={{ backgroundColor: "white" }} position="static">
          <Toolbar>
            <div className={OpenBusinesscss.registerViewSearch}>
              <span
                // style={{ display: "none  !important" }}
                title="Open Business"
                onClick={() => {
                  Navigate("/OpenBusiness");
                  registerItems("Home");
                }}
                className={`${
                  activeTab == "/OpenBusiness" ? OpenBusinesscss.activeLink : ""
                }`}
                name="gotoHome"
                id="OpenBusiness"
              >
                <IconButton className={OpenBusinesscss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={OpenBusinesscss.openBusIcon}
                    src={homeIcon}
                  />
                  <span className={OpenBusinesscss.Title}>Home</span>
                </IconButton>
              </span>{" "}
              <span
                title="Transaction"
                onClick={(e) => {
                  Navigate("addTransaction");
                  registerItems("Transaction");
                  setHoverableTitle();
                }}
                className={`${
                  activeTab.startsWith("/OpenBusiness/addTransaction")
                    ? OpenBusinesscss.activeLink
                    : ""
                }`}
                name="addTransaction"
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
              </span>
              <span
                title="Add Item"
                onClick={() => {
                  Navigate("additems");
                  registerItems("addItem");
                }}
                className={`${
                  activeTab.startsWith("/OpenBusiness/additems")
                    ? OpenBusinesscss.activeLink
                    : ""
                }`}
                name="addItem"
                id="addItem"
                // to="additems"
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
              </span>
              <span
                title="Search"
                onClick={() => {
                  Navigate("search");
                  registerItems("Search");
                }}
                className={`${
                  activeTab.startsWith("/OpenBusiness/search")
                    ? OpenBusinesscss.activeLink
                    : ""
                }`}
                name="Search"
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
              </span>
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
