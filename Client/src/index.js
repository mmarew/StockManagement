import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
localStorage.setItem("targetUrl", "https://masetawosha.com/stock/");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
