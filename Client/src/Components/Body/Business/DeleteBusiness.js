import axios from "axios";
import $ from "jquery";
import { ConsumeableContext } from "../UserContext/UserContext";
import { useEffect } from "react";
let serverAddress = localStorage.getItem("targetUrl");
async function DeleteBusiness(
  businessId,
  businessName,
  getBusiness,
  userPassword,
  setOpen,
  setProccessing
) {
  let token = localStorage.getItem("storeToken");
  let deleteUsersBusiness = async () => {
    setProccessing(true);
    let updateRes = await axios.post(`${serverAddress}deleteBusines/`, {
      businessName,
      businessId,
      userPassword,
      token,
    });
    setProccessing(false);
    setOpen({ open: false });
    console.log("updateRes", updateRes);
    if (updateRes.data.data == `wrong password.`) {
      return "wrong password.";
    }
    if (updateRes.data.data == "user is not found.") {
      return "user is not found.";
    }
    if (updateRes.data.data.affectedRows > 0) {
      // setShowPopUP(true);
      // alert("your Business is  deleted successfully thank you.");
      // $("#eachBusiness_" + businessId).remove();
      getBusiness();
      return "deletedWell";
    }

    // $(".LinearProgress").hide();
    return "deletedErr";
  };

  return await deleteUsersBusiness();
}

export default DeleteBusiness;
