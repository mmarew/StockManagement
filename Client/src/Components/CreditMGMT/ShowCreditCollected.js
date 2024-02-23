import React, { useEffect } from "react";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
function ShowCreditCollected({ Results }) {
  const { setCollectedMoney, setAccountRecivableAmt } = ConsumeableContext();
  useEffect(() => {
    let { data } = Results.data,
      totalCollectedAmount = 0,
      unCollectedMoney = 0,
      partiallySold = 0;
    data.map((d, dindex) => {
      let {
          partiallyPaiedInfo,
          salesTypeValues,
          creditsalesQty,
          productsUnitPrice,
        } = d,
        paiedInfo = JSON.parse(partiallyPaiedInfo);

      if (salesTypeValues == "Partially paied") {
        partiallySold += Number(creditsalesQty) * Number(productsUnitPrice);
      }
      paiedInfo?.map((info, infoIndex) => {
        let { collectedAmount, creditPaymentDate } = info;
        totalCollectedAmount += collectedAmount;
      });
    });
    unCollectedMoney = partiallySold - totalCollectedAmount;
    setAccountRecivableAmt(() => unCollectedMoney);
    setCollectedMoney((prev) => prev + totalCollectedAmount);
  }, []);
  let recivableAmount = 0;
  return (
    <div>
      {recivableAmount > 0 && (
        <>
          Total Collected Credits{" "}
          {recivableAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
          })}
        </>
      )}
    </div>
  );
}
export default ShowCreditCollected;
