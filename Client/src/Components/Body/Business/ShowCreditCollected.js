import React from "react";
import { ConsumeableContext } from "../UserContext/UserContext";

function ShowCreditCollected({ CreditCollected, accountRecivableData }) {
  const { setAccountRecivableCollected, setCollectedMoney } =
    ConsumeableContext();
  let collectedAmount = 0;
  accountRecivableData.map((item) => {
    collectedAmount += item.salesQty * item.unitPrice;
  });
  setCollectedMoney(collectedAmount);
  console.log("collectedAmount");
  let reciveableAmount = 0;
  CreditCollected.map((item) => {
    reciveableAmount += item.salesQty * item.unitPrice;
  });
  //   alert(reciveableAmount);
  setAccountRecivableCollected(reciveableAmount);
  return (
    <div>
      Total Collected Credits{" "}
      {reciveableAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "ETB",
      })}
    </div>
  );
}

export default ShowCreditCollected;
