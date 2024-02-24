import axios from "axios";
async function VerifyLogin() {
  let serverAddress = localStorage.getItem("targetUrl");
  let savedToken = localStorage.getItem("storeToken");
  if (!savedToken || savedToken == "undefined" || savedToken == "null") {
    return null;
  }
  let response = await axios.post(serverAddress + "Login/verifyLogin/", {
    token: savedToken,
  });
  return response.data;
}

export default VerifyLogin;
