import React, { useEffect, useState } from "react";
import OpenBusinessLeftCss from "./OpenBusinessLeftSide.module.css";
import HomeIcon from "../ICONS/BusinessJS/clarity_home-line.svg";
import BusinessIcon from "../ICONS/BusinessJS/BusinessWhite.svg";
import iconView from "../ICONS/BusinessJS/iconView.svg";
import transactioIcon from "../ICONS/BusinessJS/icons_transaction.svg";
import { Link } from "react-router-dom";
import itemsIcon from "../ICONS/BusinessJS/iconItems.svg";
import iconLogout from "../ICONS/Login/logout-svgrepo-com.svg";
import iconEmployee from "../ICONS/BusinessJS/iconEmployee.svg";
import MASETAWOSHAICONICON from "../ICONS/BusinessJS/MASETAWOSHAICON.svg";
import { useLocation } from "react-router-dom";
function OpenBusinessLeftSide() {
  let openedBusiness = localStorage.getItem("openedBusiness");
  const [currentURL, setcurrentURL] = useState("/");
  const location = useLocation();
  useEffect(() => {
    setcurrentURL(location.pathname);
  }, [location]);
  return (
    <div id="Wrapper" className={OpenBusinessLeftCss.Wrapper}>
      <div className={OpenBusinessLeftCss.listWrapper}>
        <div>
          <img
            className={OpenBusinessLeftCss.MASETAWOSHAICONICON}
            src={MASETAWOSHAICONICON}
          />
        </div>
        <Link className={OpenBusinessLeftCss.openBusinessTabLeft} to="/">
          {" "}
          <img
            className={OpenBusinessLeftCss.TransactionIcon}
            src={BusinessIcon}
          />
          <span> Business</span>
        </Link>
        <Link
          className={
            `${OpenBusinessLeftCss.openBusinessTabLeft} ` +
            `  ${
              currentURL == "/OpenBusiness" && OpenBusinessLeftCss.activeClass
            }`
          }
          to="/OpenBusiness"
        >
          <img className={OpenBusinessLeftCss.TransactionIcon} src={HomeIcon} />
          <span> Home</span>
        </Link>

        <Link
          to="addTransaction"
          // onClick={markTargetedLink}
          className={
            `${OpenBusinessLeftCss.openBusinessTabLeft} ` +
            `  ${
              currentURL.startsWith("/OpenBusiness/addTransaction") &&
              OpenBusinessLeftCss.activeClass
            }`
          }
        >
          <img
            className={OpenBusinessLeftCss.TransactionIcon}
            src={transactioIcon}
            alt="Transaction icon"
          />
          <span className={"t"} name="addTransaction" id="addTransaction">
            Sale/Buy
          </span>
        </Link>
        {/* ///////////////////// */}
        {openedBusiness == "myBusiness" && (
          <Link
            to="Items"
            // onClick={markTargetedLink}
            className={
              `${OpenBusinessLeftCss.openBusinessTabLeft} ` +
              `  ${
                currentURL.startsWith("/OpenBusiness/Items") &&
                OpenBusinessLeftCss.activeClass
              }`
            }
          >
            <img
              src={itemsIcon}
              className={OpenBusinessLeftCss.nonTransaction}
            />
            <span name="addItem" id="Items">
              Items
            </span>
          </Link>
        )}
        <Link
          to="search"
          // onClick={markTargetedLink}
          className={
            `${OpenBusinessLeftCss.openBusinessTabLeft} ` +
            `  ${
              currentURL.startsWith("/OpenBusiness/search") &&
              OpenBusinessLeftCss.activeClass
            }`
          }
        >
          <img src={iconView} className={OpenBusinessLeftCss.nonTransaction} />
          <span id="View" name="View">
            View
          </span>
        </Link>
        {/* <Link
          to="search"
          onClick={markTargetedLink}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
        >
          <img
            src={iconSearch}
            className={OpenBusinessLeftCss.nonTransaction}
          />
          <a name="Search" id="search">
            Search
          </a>
        </Link> */}
        {openedBusiness == "myBusiness" && (
          <Link
            to="Employee"
            id="Employee"
            // onClick={markTargetedLink}
            className={
              `${OpenBusinessLeftCss.openBusinessTabLeft} ` +
              `  ${
                currentURL.startsWith("/OpenBusiness/Employee") &&
                OpenBusinessLeftCss.activeClass
              }`
            }
          >
            <img
              src={iconEmployee}
              className={OpenBusinessLeftCss.nonTransaction}
            />
            <span name="Employee">Employee</span>
          </Link>
        )}
        <Link
          id="Logout"
          onClick={() => {
            localStorage.setItem("storeToken", "");
            let storeToken = localStorage.getItem("storeToken");
          }}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
          to="/login"
        >
          <img
            src={iconLogout}
            className={
              OpenBusinessLeftCss.nonTransaction +
              " " +
              OpenBusinessLeftCss.iconLogout
            }
          />
          <span name="Logout">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default OpenBusinessLeftSide;
