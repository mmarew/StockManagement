import React, { useEffect } from "react";
import helpStyles from "../CSS/Help.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import { Button } from "@mui/material";
// 250,250,250
function Help() {
  let navigate = useNavigate();
  let goTo = (Path) => {
    navigate("" + Path);
  };
  let storeToken = localStorage.getItem("storeToken");
  let helpData = [
    { Title: "How to register and login in stock", Path: "loginAndRegister" },
    { Title: "How to create business  in stock", Path: "howToCreateBusiness" },
    {
      Title: "How to register Product and Expence items  in stock",
      Path: "registerProductsAndExpencesItems",
    },
    {
      Title: "How to register sales and purchase transaction in stock",
      Path: "registerSalesAndPurchaseTransaction",
    },
    {
      Title: "How to register Expences  in stock",
      Path: "registerExpencesTransaction",
    },
  ];
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className={helpStyles.helpContainer}>
        {window.innerWidth > 768 && (
          <div className={helpStyles.LeftHelpContainer}>
            <LeftSideBusiness className={helpStyles.LeftSideBusiness} />
          </div>
        )}
        <div className={helpStyles.helpMiddelContainer}>
          <h3 style={{ color: "red" }}>
            This part of web is under development
          </h3>
          <br />
          <h3> Manuals on how to use stock managements</h3>
          <br />
          <ul className={helpStyles.helpUL}>
            {helpData.map((item, index) => {
              return (
                <li key={index}>
                  <span className={helpStyles.TitleOfHelp}>{item.Title}</span>
                  <br /> <br />
                  <Button
                    onClick={() => {
                      goTo(item.Path);
                    }}
                  >
                    Learn More
                  </Button>
                </li>
              );
            })}
          </ul>
          <Outlet />
          <h3>More help on contact</h3>
          <ul className={helpStyles.helpContact}>
            <li></li>
            <li>
              Phone &nbsp; <a href="tel:+251922112480">+251922112480</a>
            </li>

            <li>
              Message me on &nbsp;
              <a href="https://wa.me/+251922112480"> WhatsApp</a>
            </li>
            <li>
              Message me on &nbsp;<a href="tel:+251922112480"> Telegram</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Help;
