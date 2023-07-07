import { useNavigate } from "react-router-dom";

function LogoutofThisPage() {
  let navigate = useNavigate();
  localStorage.setItem("storeToken", "");
  let storeToken = localStorage.getItem("storeToken");
  console.log("storeToken", storeToken);
  if (storeToken == "" || storeToken == null) {
    navigate("/login");
  }
  return <></>;
}
export { LogoutofThisPage };
