import axios from "axios";
import $ from "jquery";
import { InitialContext } from "../UserContext/UserContext";
import { useContext } from "react";
let serverAddress = localStorage.getItem("targetUrl");
let UpdateBusinesssName = async (
  targetBusinessId,
  setShowProgressBar,
  setcreatedBusiness,
  createdBusiness
) => {
  // const userContext = useContext(InitialContext);
  // console.log("userContext", userContext);
  let businessId = "businessName_" + targetBusinessId,
    businessname = $("#" + businessId).val();
  console.log(businessname, targetBusinessId);
  setShowProgressBar(true);
  let updateRes = await axios.post(`${serverAddress}updateBusinessName/`, {
    businessname,
    targetBusinessId,
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

    localStorage.setItem("businessname", businessname);
    createdBusiness?.map((items) => {
      console.log(items);
      if (targetBusinessId == items.businessId) {
        $("#createdBusiness_" + targetBusinessId).remove();
        setcreatedBusiness([
          ...createdBusiness,
          { ...items, businessName: businessname },
        ]);
      }
    });
    return "update is successfull";
  }
};
export default UpdateBusinesssName;
