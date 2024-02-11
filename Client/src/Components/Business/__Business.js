import axios from "axios";
let serverAddress = localStorage.getItem("targetUrl");

let token = localStorage.getItem("storeToken");
let RemoveMyEmployeersBusiness = async (
  BusinessID,
  ownerId,
  BusinessName,
  getBusiness
) => {
  console.log(
    BusinessID,
    ownerId,
    BusinessName,
    "getBusiness ---===--  ",
    getBusiness
  );
  //   return;
  let responce = await axios.post(`${serverAddress}removeEmployeersBusiness/`, {
    token,
    BusinessID,
    ownerId,
    BusinessName,
  });
  return responce;
};
export { RemoveMyEmployeersBusiness };
