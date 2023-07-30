import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserContext from "./Components/Body/UserContext/UserContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    {
      // localStorage.setItem("targetUrl", "https://mar.masetawosha.com/")
      localStorage.setItem("targetUrl", "http://localhost:2020/")
    }
    <UserContext>
      <App />
    </UserContext>{" "}
  </>
);
