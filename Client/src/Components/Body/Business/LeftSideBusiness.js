import React from "react";
import LeftSideBusinessCss from "./LeftSideBusiness.module.css";
import masetawoshaIcon from "../../ICONS/BusinessJS/MASETAWOSHAICON.svg";
import userProfileIcon from "../../ICONS/BusinessJS/userIcon.svg";
import BusinessIcon from "../../ICONS/BusinessJS/businessBlack.svg";
import $ from "jquery";

import SupportIcon from "../../ICONS/BusinessJS/SupportBlack.svg";
import { useNavigate } from "react-router-dom";
function LeftSideBusiness() {
  let Navigate = useNavigate();
  let navigeteToTargetedURL = (e, path) => {
    console.log(e);
    Navigate(path);

    e.currentTarget.className += " " + LeftSideBusinessCss.activeClass + " ";
  };
  return (
    <div className={LeftSideBusinessCss.LeftSideWrapper}>
      <img width="100px" src={masetawoshaIcon} />
      <ul>
        <li onClick={(e) => navigeteToTargetedURL(e, "/")}>
          <div>
            <img
              className={LeftSideBusinessCss.imgLeftBusiness}
              alt="Business icon"
              src={BusinessIcon}
            />
            <span>Business</span>
          </div>
        </li>
        <li onClick={(e) => navigeteToTargetedURL(e, "/Profiles")}>
          <div>
            <img
              className={LeftSideBusinessCss.imgLeft}
              alt="Profile icon"
              src={userProfileIcon}
            />
            <span>Profile</span>
          </div>
        </li>
        <li onClick={(e) => navigeteToTargetedURL(e, "/help")}>
          <div>
            <img
              className={LeftSideBusinessCss.imgLeft}
              src={SupportIcon}
              alt="Support icon"
            />{" "}
            <p>Support</p>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default LeftSideBusiness;
