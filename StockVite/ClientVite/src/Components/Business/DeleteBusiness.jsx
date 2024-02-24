import axios from "axios";
let serverAddress = localStorage.getItem("targetUrl");
async function DeleteBusiness({
  setDeleteError,
  setopenBusinessDeletingModal,
  businessId,
  businessName,
  getBusiness,
  userPassword,
  setProccessing,
}) {
  let token = localStorage.getItem("storeToken");
  let deleteUsersBusiness = async () => {
    setProccessing(true);
    try {
      let updateRes = await axios.post(
        `${serverAddress}business/deleteBusines`,
        {
          businessName,
          businessId,
          userPassword,
          token,
        }
      );
      setProccessing(false);
      let data = updateRes.data.data;

      if (data == "user is not found.") {
      } else if (data == "delete success") {
        getBusiness();
        setopenBusinessDeletingModal((prev) => {
          return { ...prev, Open: false };
        });
      } else {
        setDeleteError(data);
      }
    } catch (error) {
      setProccessing(false);
      let err = error.message;

      setDeleteError(err);
      return "deletedErr";
    }
  };

  return await deleteUsersBusiness();
}

export default DeleteBusiness;
