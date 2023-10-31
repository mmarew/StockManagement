import React, { createContext, useContext, useState } from "react";

let InitialContext = createContext();

function UserContext(props) {
  const [ShowProgressBar, setShowProgressBar] = useState(true);
  // This is data where sold by credit and money is not collected so we need it to deduct from sold in cash
  const [accountRecivableAmt, setAccountRecivableAmt] = useState(0);
  // This is data where sold by credit and collected in our selection time range  so we need it to add in net cash-flow
  const [collectedMoney, setCollectedMoney] = useState(0);
  // This is data where sold by credit and money is collected but collected time may or may not in selected time range so we need it to deduct from sold in cash
  const [unTimeRecivableCollected, setunTimeRecivableCollected] = useState(0);

  const [ownersName, setownersName] = useState("");
  const [TransactionData, setTransactionData] = useState([
    {
      TotalSales: 0,
      TotalPurchase: 0,
      TotalExpences: 0,
    },
  ]);
  return (
    <InitialContext.Provider
      value={{
        ownersName,
        setownersName,
        ShowProgressBar,
        setShowProgressBar,
        accountRecivableAmt,
        setAccountRecivableAmt,
        unTimeRecivableCollected,
        setunTimeRecivableCollected,
        collectedMoney,
        setCollectedMoney,
      }}
    >
      {props.children}
    </InitialContext.Provider>
  );
}
export default UserContext;
export { InitialContext };
export let ConsumeableContext = () => {
  return useContext(InitialContext);
};
