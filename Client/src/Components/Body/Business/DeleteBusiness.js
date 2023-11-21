import axios from "axios";
import $ from "jquery";
let serverAddress = localStorage.getItem("targetUrl");
async function DeleteBusiness(
  businessId,
  businessName,
  getBusiness,
  userPassword
) {
  $(".LinearProgress").css("display", "block");
  $("#LinearProgress").css("display", "block");
  // const [ShowPopUP, setShowPopUP] = useState(false);
  let token = localStorage.getItem("storeToken");
  console.log("userPassword is ", userPassword, " token", token);
  // return;
  let updateRes = await axios.post(`${serverAddress}deleteBusines/`, {
    businessName,
    businessId,
    userPassword,
    token,
  });
  console.log("updateRes", updateRes);
  if (updateRes.data.data == `wrong password.`) {
    return "wrong password.";
  }
  if (updateRes.data.data == "user is not found.") {
    return "user is not found.";
  }
  if (updateRes.data.data.affectedRows > 0) {
    // setShowPopUP(true);
    alert("your Business is  deleted successfully thank you.");
    $("#eachBusiness_" + businessId).remove();
    getBusiness();
    return "deletedWell";
  }
  // $(".LinearProgress").hide();
  return "deletedErr";
}

export default DeleteBusiness;
