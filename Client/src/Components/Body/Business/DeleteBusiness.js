import axios from "axios";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert";

let serverAddress = localStorage.getItem("targetUrl");
async function DeleteBusiness(
  businessId,
  businessName,
  getBusiness,
  setBusinessLists
) {
  confirmAlert({
    title: "Confirm to submit",
    message: `Are you sure to delete ${businessName}?`,
    buttons: [
      {
        label: "yes",
        onClick: async () => {
          $(".LinearProgress").show();
          let updateRes = await axios.post(`${serverAddress}deleteBusines/`, {
            businessName,
            businessId,
          });
          if (updateRes.data.data.affectedRows > 0) {
            alert("your database  is deleted successfully thank you.");
            $("#eachBusiness_" + businessId).remove();
            getBusiness();
          }
          $(".LinearProgress").hide();
        },
      },
      {
        label: "No",
        onClick: () => console.log("Click No"),
      },
    ],
  });

  //   return <div>DeleteBusiness</div>;
}

export default DeleteBusiness;
