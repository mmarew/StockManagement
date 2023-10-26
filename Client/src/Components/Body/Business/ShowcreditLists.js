import React from "react";
import { ConsumeableContext } from "../UserContext/UserContext";

function ShowcreditLists({ CreditList }) {
  const { accountRecivableAmt, setAccountRecivableAmt } = ConsumeableContext();
  console.log("CreditList", CreditList);
  let reciveableAmount = 0;
  CreditList.map((item) => {
    reciveableAmount += item.salesQty * item.unitPrice;
  });
  // alert(reciveableAmount);
  setAccountRecivableAmt(reciveableAmount);
  return (
    <div>
      Total sales in credits{" "}
      {reciveableAmount.toLocaleString("en-US", {
        style: "currency",
        currency: "ETB",
      })}
    </div>
  );
}
export default ShowcreditLists;
