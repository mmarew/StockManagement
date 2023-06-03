import React, { createContext, useState } from "react";

let InitialContext = createContext();

function UserContext(props) {
  const [userData, setUserData] = useState({});

  const [ownersName, setownersName] = useState("");
  return (
    <InitialContext.Provider value={[ownersName, setownersName]}>
      {props.children}
    </InitialContext.Provider>
  );
}
export default UserContext;
export { InitialContext };
