import React from "react";
function Localstorage() {
  localStorage.setItem("targetUrl", "https://mar.masetawosha.com/"); //
  // localStorage.setItem("targetUrl", "http://localhost:2020/");
  let setLocalStorage = (targetItem, targetValue) => {
      localStorage.setItem(targetItem, targetValue);
    },
    getLocalStorage = (targetItem) => {
      localStorage.getItem(targetItem);
    };
  return [setLocalStorage, getLocalStorage];
}
export default Localstorage;
