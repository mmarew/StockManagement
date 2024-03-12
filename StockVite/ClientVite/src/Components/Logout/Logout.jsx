import { useNavigate } from "react-router-dom";
let counter = 0;

function LogoutofThisPage() {
  // let navigate = useNavigate();
  localStorage.removeItem("storeToken");
  localStorage.removeItem("ownersName");
  localStorage.clear();
  counter++;
  let storeToken = localStorage.getItem("storeToken");
  if (!storeToken) {
    window.location.href = "/login";
  } else {
    if (counter <= 3) LogoutofThisPage();
  }
}
export { LogoutofThisPage };
