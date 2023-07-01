import React from "react";
import OpenBusinessLeftCss from "./OpenBusinessLeftSide.module.css";
import $ from "jquery";
import transactioIcon from "../../ICONS/BusinessJS/icons_transaction.svg";
import { Link, Outlet, useNavigate } from "react-router-dom";
import itemsIcon from "../../ICONS/BusinessJS/iconItems.svg";
import iconView from "../../ICONS/BusinessJS/iconView.svg";
import iconEmployee from "../../ICONS/BusinessJS/iconEmployee.svg";
import iconSearch from "../../ICONS/BusinessJS/iconSearch.svg";

function OpenBusinessLeftSide() {
  let Navigate = useNavigate();
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
        <Link
          to="additems"
          onClick={markTargetedLink}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
        >
          <img src={itemsIcon} className={OpenBusinessLeftCss.nonTransaction} />
          <a name="addItem" id="additems">
            Items
          </a>
        </Link>
        <Link
          to="view"
          onClick={markTargetedLink}
          className={OpenBusinessLeftCss.openBusinessTabLeft}
        >
          <img src={iconView} className={OpenBusinessLeftCss.nonTransaction} />
          <a id="View" name="View">
            View
          </a>
        </Link>
        <Link
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
        </Link>
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
      </div>
    </div>
  );
}

export default OpenBusinessLeftSide;
