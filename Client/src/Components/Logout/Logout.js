import { useNavigate } from "react-router-dom";

function LogoutofThisPage() {
  let navigate = useNavigate();
  localStorage.removeItem("storeToken");
  localStorage.removeItem("ownersName");
  localStorage.clear();
  let storeToken = localStorage.getItem("storeToken");
  console.log("storeToken", storeToken);
  if (storeToken == "" || storeToken == null) {
    navigate("/login");
  }
  return <></>;
}
export { LogoutofThisPage };
