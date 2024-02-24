import axios from "axios";
import React, { useEffect, useState } from "react";
import { LogoutofThisPage } from "../Logout/Logout";
import currentDates from "../Body/Date/currentDate";
import { Button, LinearProgress } from "@mui/material";
import AddCostTransactionCss from "../Costs/AddCostTransaction.module.css";
import SuccessOrError from "../Body/Others/SuccessOrError";
import AddExpTransaction from "../Transaction/AddTrans/AddExpTransaction";
function GetExpencesLists() {
  const [RegisterableCots, setRegisterableCots] = useState([{}]);
  let serverAddress = localStorage.getItem("targetUrl");
  const businessId = localStorage.getItem("businessId");
  const token = localStorage.getItem("storeToken");
  let businessName = localStorage.getItem("businessName");
  const [errorsOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  const [open, setopen] = useState(false);
  const [expenceList, setexpenceList] = useState([]);
  const [ShowProgressBar, setShowProgressBar] = useState(false);

  const [Procecssing, setProcecssing] = useState(false);
  const [showCostForm, setshowCostForm] = useState(false);
  let getListOfCosts = async () => {
    try {
      setProcecssing(true);
      setShowProgressBar(true);
      // return;
      let response = await axios.get(serverAddress + "getExpencesLists/", {
        params: {
          businessName,
          businessId,
          token,
        },
      });
      setShowProgressBar(false);
      setProcecssing(false);
      setshowCostForm(true);
      let data = response.data.data;
      if (data == "you are not owner of this business") {
        setexpenceList([]);
        LogoutofThisPage();
        return setErrorsOrSuccess({
          Message: "FAIL",
          Detail: "you are not the owner of the business.",
        });
      }
      if (data == "err") {
        setErrorsOrSuccess({ Message: "Fail", Detail: response.data.err });
        setexpenceList([]);
        return;
      }
      let costData = data;

      if (costData.length == 0) {
        setErrorsOrSuccess({ Message: "Fail", Detail: "No cost list data." });
        setexpenceList([]);
        return;
      } else {
        setErrorsOrSuccess({ Message: "", Detail: "" });
      }
      setexpenceList(costData);
    } catch (error) {
      setProcecssing(false);
      setShowProgressBar(false);
      setErrorsOrSuccess({ Message: "Fail", Detail: error.message });
      return;
    }
  };

  useEffect(() => {
    if (showCostForm) {
      let costDate = "";
      if (costDate == "") {
        costDate = currentDates();
      }
    }
    getListOfCosts();
  }, []);

  return (
    <div>
      {errorsOrSuccess.Message && (
        <SuccessOrError
          request={
            errorsOrSuccess.Message == "Fail"
              ? errorsOrSuccess.Detail
              : "SUCCESS"
          }
          se
        />
      )}
      {Procecssing && <LinearProgress />}
      <>
        {expenceList?.length > 0 ? (
          <div className={AddCostTransactionCss.costItems}>
            {expenceList?.map((items) => {
              return (
                <div
                  className={AddCostTransactionCss.costItem}
                  key={"CostTransAction_" + items.costsId}
                >
                  <div> {items.costName}</div>
                  <Button
                    onClick={() => {
                      setRegisterableCots([items]);
                      setopen(true);
                    }}
                    color="primary"
                  >
                    Add Transaction
                  </Button>
                </div>
              );
            })}
            <br />
          </div>
        ) : (
          ""
        )}
      </>
      {open && (
        <AddExpTransaction
          data={{
            open,
            setopen,
            RegisterableCots,
            setRegisterableCots,
            errorsOrSuccess,
            setErrorsOrSuccess,
          }}
        />
      )}
    </div>
  );
}

export default GetExpencesLists;
