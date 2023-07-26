import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserContext from "./Components/Body/UserContext/UserContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

localStorage.setItem("targetUrl", "https://mar.masetawosha.com/");

root.render(
  <UserContext>
    <App />
  </UserContext>
);
