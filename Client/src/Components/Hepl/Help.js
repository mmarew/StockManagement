import React from "react";
import helpStyles from "./Help.module.css";
import { Link, useNavigate } from "react-router-dom";
function Help() {
  let navigate = useNavigate();
  let goTo = (data) => {
    console.log("data", data);
    navigate("#/");
  };

  return (
    <div className={helpStyles.helpContainer}>
      <h1>This part of web is under development</h1>
      <br />
      <h3> Manuals on how to use stock managements</h3>
      <br />
      <ul className={helpStyles.helpUL}>
        <li>
          <Link
            onClick={() => {
              goTo("loginAndRegister");
            }}
          >
            How to register and login
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              goTo("loginAndRegister");
            }}
          >
            How to create business{" "}
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              goTo("loginAndRegister");
            }}
          >
            How to register sales an costs{" "}
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              goTo("loginAndRegister");
            }}
          >
            How to update datas
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              goTo("loginAndRegister");
            }}
          >
            How to hire employee
          </Link>
        </li>
      </ul>
      <button
        className={helpStyles.backButton}
        onClick={() => {
          navigate("/");
        }}
      >
        BACK
      </button>
    </div>
  );
}
export default Help;
