import axios from "axios";
import DecodeJWT from "../Components/Utilities/DecodeJWT";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
async function VerifyLogin() {
  let serverAddress = localStorage.getItem("targetUrl");
  let savedToken = localStorage.getItem("storeToken");
  if (!savedToken || savedToken == "undefined" || savedToken == "null") {
    return null;
  }
  let response = await axios.post(serverAddress + "Login/verifyLogin/", {
    token: savedToken,
  });
  console.log("in verifyLogin", response);

  let { token, data } = response.data;
  if (data == "alreadyConnected") {
    let { usersFullName } = DecodeJWT(token);
    localStorage.setItem("ownersName", usersFullName);
    localStorage.setItem("storeToken", token);
  }

  return response.data;
}

export default VerifyLogin;
