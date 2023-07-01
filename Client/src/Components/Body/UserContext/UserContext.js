import React, { createContext, useState } from "react";

let InitialContext = createContext();

function UserContext(props) {
  const [ShowProgressBar, setShowProgressBar] = useState(true);
  const [ownersName, setownersName] = useState("");
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
