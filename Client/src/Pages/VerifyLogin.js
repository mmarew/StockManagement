import axios from "axios";
async function VerifyLogin() {
  let serverAddress = localStorage.getItem("targetUrl");
  let savedToken = localStorage.getItem("storeToken");
  console.log("savedToken", savedToken);
  console.log("savedToken", savedToken);
  if (!savedToken || savedToken == "undefined" || savedToken == "null") {
    return null;
  }
  let response = await axios.post(serverAddress + "Login/verifyLogin/", {
    token: savedToken,
  });
  console.log("verifyLogin response", response);
  return response.data;
}

export default VerifyLogin;
