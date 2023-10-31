import React from "react";
import { ConsumeableContext } from "../UserContext/UserContext";

function ShowCreditCollected({
  uselessCreditCollected,
  CollectedMoneyFromTotalSales,
}) {
  const { setunTimeRecivableCollected, setCollectedMoney } =
    ConsumeableContext();
  let collectedAmount = 0;
  CollectedMoneyFromTotalSales?.map((item) => {
    collectedAmount += item.creditsalesQty * item.unitPrice;
  });
  setCollectedMoney((prev) => prev + collectedAmount);
  console.log("collectedAmount");
  let reciveableAmount = 0;
  uselessCreditCollected.map((item) => {
    reciveableAmount += item.creditsalesQty * item.unitPrice;
  });
  setunTimeRecivableCollected((prev) => prev + reciveableAmount);
  return (
    <div>
      {reciveableAmount > 0 && (
        <>
          Total Collected Credits{" "}
          {reciveableAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
          })}
        </>
      )}
    </div>
  );
}

export default ShowCreditCollected;
