import React, { useEffect } from "react";
import helpStyles from "../CSS/Help.module.css";
import { Link, useNavigate } from "react-router-dom";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import { Button } from "@mui/material";
function Help() {
  let navigate = useNavigate();
  let goTo = (data) => {
    console.log("data", data);
    navigate("/");
  };
  let storeToken = localStorage.getItem("storeToken");
  console.log("storeToken", storeToken);
  // useEffect(() => {
  //   if (storeToken == null || storeToken == undefined || storeToken == "") {
  //     console.log("storeToken", storeToken);
  //     console.log("in navigation", navigate("/login"));
  //   }
  // }, [storeToken, navigate]);

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
          <br />
          <button
            style={{ margin: "auto", width: "200px" }}
            className={helpStyles.backButton}
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </button>
          <h1>This part of web is under development</h1>
          <br />
          <h3> Manuals on how to use stock managements</h3>
          <br />
          <ul className={helpStyles.helpUL}>
            <li>
              <Link
                className={helpStyles.TitleOfHelp}
                onClick={() => {
                  goTo("loginAndRegister");
                }}
              >
                How to register and login
              </Link>
              <br /> <br />
              <Button variant="contained">Learn More</Button>
            </li>
            <li>
              <Link
                className={helpStyles.TitleOfHelp}
                onClick={() => {
                  goTo("loginAndRegister");
                }}
              >
                How to create business{" "}
              </Link>
              <br /> <br />
              <Button variant="contained">Learn More</Button>
            </li>
            <li>
              <Link
                className={helpStyles.TitleOfHelp}
                onClick={() => {
                  goTo("loginAndRegister");
                }}
              >
                How to register sales an costs{" "}
              </Link>
              <br /> <br />
              <Button variant="contained">Learn More</Button>
            </li>
            <li>
              <Link
                className={helpStyles.TitleOfHelp}
                onClick={() => {
                  goTo("loginAndRegister");
                }}
              >
                How to update datas
              </Link>
              <br /> <br />
              <Button variant="contained">Learn More</Button>
            </li>
            <li>
              <Link
                className={helpStyles.TitleOfHelp}
                onClick={() => {
                  goTo("loginAndRegister");
                }}
              >
                How to hire employee
              </Link>
              <br /> <br />
              <Button variant="contained">Learn More</Button>
            </li>
          </ul>

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
