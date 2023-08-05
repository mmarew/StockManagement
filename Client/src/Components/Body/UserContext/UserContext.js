import React, { createContext, useContext, useState } from "react";

let InitialContext = createContext();

function UserContext(props) {
  const [ShowProgressBar, setShowProgressBar] = useState(true);
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
      value={[ownersName, setownersName, ShowProgressBar, setShowProgressBar]}
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
