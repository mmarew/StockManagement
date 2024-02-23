import React from "react";
import LeftSideBusinessCss from "./LeftSideBusiness.module.css";
import masetawoshaIcon from "../ICONS/BusinessJS/MASETAWOSHAICON.svg";
import userProfileIcon from "../ICONS/BusinessJS/userIcon.svg";
import BusinessIcon from "../ICONS/BusinessJS/businessBlack.svg";
import SupportIcon from "../ICONS/BusinessJS/SupportBlack.svg";
import { useNavigate } from "react-router-dom";
function LeftSideBusiness() {
  let Navigate = useNavigate();
  let navigeteToTargetedURL = (e, path) => {
    Navigate(path);
  };
  return (
    <div className={LeftSideBusinessCss.LeftSideWrapper}>
      <img
        className={LeftSideBusinessCss.masetawoshaIcon}
        src={masetawoshaIcon}
      />
      <ul className="">
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
        <li
          className={LeftSideBusinessCss.leftsideLi}
          onClick={(e) => navigeteToTargetedURL(e, "/Profiles")}
        >
          <div>
            <img
              className={LeftSideBusinessCss.imgLeft + " imgLeft "}
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
            />
            <p>Support</p>
          </div>
        </li>
      </ul>
    </div>
  );
}
export default LeftSideBusiness;
