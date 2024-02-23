import Businessmodulecss from "../../CSS/Business.module.css";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
function CurrencyFormatter(money) {
  money = Number(money);
  return (
    " " +
    money.toLocaleString("en-US", {
      style: "currency",
      currency: "ETB",
    })
  );
}
export function ButtonProcessing() {
  return <Button disabled>Processing.. </Button>;
}

export let TimeCounter = () => {
  // Define state variables to hold the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect hook to update the time every second
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    // Clean-up function to clear the interval when the component unmounts
    return () => {
      clearInterval(timerID);
    };
  }, []); // Empty dependency array means this effect runs only once after initial render

  // Function to update the current time
  const tick = () => {
    setCurrentTime(new Date());
  };

  return (
    <p className={Businessmodulecss.welcomeMessage}>
      Today is {currentTime.toDateString()} , {currentTime.getHours()}:
      {currentTime.getMinutes()} : {currentTime.getSeconds()}
    </p>
  );
};

export default CurrencyFormatter;
