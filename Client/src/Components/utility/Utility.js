import React from "react";
import Button from "@mui/material/Button";
function CurrencyFormatter(money) {
  // console.log("CurrencyFormatter", money);
  // console.log("money", money);
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

export default CurrencyFormatter;
