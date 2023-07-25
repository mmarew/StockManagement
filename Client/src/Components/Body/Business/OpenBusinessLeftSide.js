import React from "react";
import OpenBusinessLeftCss from "./OpenBusinessLeftSide.module.css";
import HomeIcon from "../../ICONS/BusinessJS/clarity_home-line.svg";
import $ from "jquery";
import iconView from "../../ICONS/BusinessJS/iconView.svg";
import transactioIcon from "../../ICONS/BusinessJS/icons_transaction.svg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import itemsIcon from "../../ICONS/BusinessJS/iconItems.svg";
import iconLogout from "../../ICONS/Login/logout-svgrepo-com.svg";
import iconEmployee from "../../ICONS/BusinessJS/iconEmployee.svg";
import iconSearch from "../../ICONS/BusinessJS/iconSearch.svg";
import MASETAWOSHAICONICON from "../../ICONS/BusinessJS/MASETAWOSHAICON.svg";
function OpenBusinessLeftSide() {
  let Navigate = useNavigate();
  let openedBusiness = localStorage.getItem("openedBusiness");

  let markTargetedLink = (e) => {
    // e.preventDefault();
    // Navigate("/OpenBusiness/" + e.target.id);
    console.log(e.target.id);
    $("." + OpenBusinessLeftCss.openBusinessTabLeft).removeClass(
      OpenBusinessLeftCss.activeClass
    );
    e.currentTarget.className += " " + OpenBusinessLeftCss.activeClass + " ";
  };

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
          <img className={OpenBusinessLeftCss.TransactionIcon} src={HomeIcon} />
          <a> Home</a>
        </Link>
        <Link
          to="addTransaction"
          onClick={markTargetedLink}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
        >
          <img
            className={OpenBusinessLeftCss.TransactionIcon}
            src={transactioIcon}
            alt="Transaction icon"
          />
          <a className={"t"} name="addTransaction" id="addTransaction">
            Transaction
          </a>
        </Link>
        {/* ///////////////////// */}
        {openedBusiness == "myBusiness" && (
          <Link
            to="additems"
            onClick={markTargetedLink}
            className={OpenBusinessLeftCss.openBusinessTabLeft}
          >
            <img
              src={itemsIcon}
              className={OpenBusinessLeftCss.nonTransaction}
            />
            <a name="addItem" id="additems">
              Items
            </a>
          </Link>
        )}
        <Link
          to="search"
          onClick={markTargetedLink}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
        >
          <img src={iconView} className={OpenBusinessLeftCss.nonTransaction} />
          <a id="View" name="View">
            View
          </a>
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
            onClick={markTargetedLink}
            className={OpenBusinessLeftCss.openBusinessTabLeft}
          >
            <img
              src={iconEmployee}
              className={OpenBusinessLeftCss.nonTransaction}
            />
            <a name="Employee">Employee</a>
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
          <a name="Logout">Logout</a>
        </Link>
      </div>
    </div>
  );
}

export default OpenBusinessLeftSide;
