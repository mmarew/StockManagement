import axios from "axios";
import $ from "jquery";
let serverAddress = localStorage.getItem("targetUrl");
let UpdateBusinesssName = async (
  targetBusinessId,
  setShowProgressBar,
  setcreatedBusiness,
  createdBusiness
) => {
  let businessId = "businessName_" + targetBusinessId,
    businessname = $("#" + businessId).val();
  console.log(businessname, targetBusinessId);
  setShowProgressBar(true);
  alert("ooooooooooooooo");
  return;
  let updateRes = await axios.post(`${serverAddress}updateBusinessName/`, {
    businessname,
    targetBusinessId,
    token: localStorage.getItem("storeToken"),
  });
  setShowProgressBar(false);
  console.log(updateRes.data);
  let data = updateRes.data.data;
  if (data == "reservedByOtherBusiness") {
    alert(
      "This name is reserved by another company. So please try to use another name to remove naming conflicts. Thankyou"
    );
    return "reservedByOtherBusiness";
  } else if (data == "update is successfull") {
    alert(data);
    $("#businessWrapper_" + targetBusinessId).hide();
    $("#openEditWrapper" + targetBusinessId).show();
    $("#businessNameH2_" + targetBusinessId).text(businessname);
    return "update is successfull";
  }
};
export default UpdateBusinesssName;
