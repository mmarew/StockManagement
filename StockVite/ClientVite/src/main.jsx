import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserContext from "./Components/Body/UserContext/UserContext";
import Localstorage from "./Components/Body/LocalStorage/Localstorage";
const root = ReactDOM.createRoot(document.getElementById("root"));
Localstorage();
root.render(
  <>
    <UserContext>
      <App />
    </UserContext>{" "}
  </>
);
