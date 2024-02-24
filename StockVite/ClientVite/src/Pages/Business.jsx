import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import Businessmodulecss from "../CSS/Business.module.css";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
import SuccessOrError from "../Components/Body/Others/SuccessOrError";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import MiddleBusiness from "../Components/Business/MiddleBusiness";
function Business() {
  const [requestFailOrSuccess, setRequestFailOrSuccess] = useState({
    Responce: "",
    Message: "",
  });

  const [createdBusiness, setcreatedBusiness] = useState([]);
  const { setownersName, ShowProgressBar } = ConsumeableContext();
  let Navigate = useNavigate();
  let token = localStorage.getItem("storeToken");

  useEffect(() => {
    if (token?.length < 5) {
      return Navigate("/login");
    }
  }, [Navigate]);

  useEffect(() => {
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  return (
    <>
      {requestFailOrSuccess.Responce && (
        <SuccessOrError
          request={
            requestFailOrSuccess.Responce == "SUCCESS"
              ? "SUCCESS"
              : requestFailOrSuccess.Message
          }
          setErrors={setRequestFailOrSuccess}
        />
      )}
      {ShowProgressBar && <LinearProgress />}
      <div className={Businessmodulecss.MainBusinessWrapper}>
        {window.innerWidth > 768 && (
          <div className={Businessmodulecss.LeftSideBusinessWrapper}>
            <LeftSideBusiness />
          </div>
        )}
        <MiddleBusiness data={{ createdBusiness, setcreatedBusiness }} />
      </div>
    </>
  );
}
export default Business;
