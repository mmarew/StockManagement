import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import ConfirmDialog from "../../Body/Others/Confirm";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { Paper } from "@mui/material";
import ModalToshowCollectedMoneyDetails from "../../CreditMGMT/ModalToshowCollectedMoneyDetails";
import SearchExpTransTable from "./SearchExpTransTable";
import { DateFormatter } from "../../Body/Date/currentDate";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import CurrencyFormatter from "../../Utilities/Utility";
function SearchExpenceTransaction({
  showEachItems,
  setshowEachItems,
  fromDate,
  toDate,
  InputValue,
  searchTarget,
}) {
  console.log("searchTarget", searchTarget);
  const [expencesData, setexpencesData] = useState([]);
  let businessId = localStorage.getItem("businessId");
  const [Errors, setErrors] = useState("");
  let token = localStorage.getItem("storeToken");

  const { accountRecivableAmt, collectedMoney, setProcessing } =
    ConsumeableContext();
  const [ShowMoneyDetailModal, setShowMoneyDetailModal] = useState(false);

  let TotalSalesRevenue = 0,
    TotalPurchaseCost = 0;
  let { TransactionData } = ConsumeableContext();

  TotalSalesRevenue = TransactionData.TotalSales;
  TotalPurchaseCost = TransactionData.TotalPurchase;

  let openedBusiness = localStorage.getItem("openedBusiness");

  let handleExpencesTransactions = async (response) => {
    response.sort((a, b) =>
      a.productName > b.productName ? 1 : b.productName > a.productName ? -1 : 0
    );
    let ListByCostId = {};
    let costList = [];
    let datas = response;
    response.map((cost) => {
      ListByCostId = {};
      cost.contentEditable = false;
      cost.isSingleExpence = true;
      ListByCostId.costAmount = 0;
      ListByCostId.costDescription = "";
      ListByCostId.costId = cost.costId;
      ListByCostId.costRegisteredDate = "";
      let inList = "NotFound";
      // check if it is in list
      for (let i = 0; i < costList.length; i++) {
        if (costList[i].costId == cost.costId) {
          inList = "Found";
          return;
        }
      }
      if (inList == "NotFound") {
        datas.map((items) => {
          // check similarity
          if (items.costId == cost.costId) {
            ListByCostId.isSingleExpence = false;
            ListByCostId.contentEditable = false;
            ListByCostId.costAmount += Number(items.costAmount);
            ListByCostId.costId = cost.costId;
            let Time = DateFormatter(cost.costRegisteredDate);
            ListByCostId.costRegisteredDate += Time + ", ";
            ListByCostId.costName = cost.costName;
            ListByCostId.costDescription += items.costDescription + ", ";
          }
        });

        costList.push(ListByCostId);
      }
    });
    setAllMyExpences(costList);
  };
  useEffect(() => {
    if (expencesData.length > 0) {
      handleExpencesTransactions(expencesData);
      setExpencesTransaction(expencesData);
    }
  }, [expencesData]);
  let getExpencesTransaction = async () => {
    setexpencesData([]);
    setProcessing(true);
    try {
      let results = await axios.get(
        serverAddress + "Expences/getExpTransactions",
        {
          params: {
            token,
            businessId,
            fromDate,
            toDate,
            searchTarget,
            InputValue,
          },
        }
      );
      setProcessing(false);
      let { expenceTransaction } = results.data;
      if (expenceTransaction == "error no 113") {
        return setErrors("error no 113 on get expences data");
      }

      setexpencesData(expenceTransaction);
    } catch (error) {
      setProcessing(false);

      setErrors(error.message);
    }
  };
  useEffect(() => {
    getExpencesTransaction();
  }, [, InputValue]);

  let modifyAmountOrDescription = (e, updateBtnID) => {};

  const [DeleteConfirmation, setDeleteConfirmation] = useState({});
  const [confirmAction, setconfirmAction] = useState("");
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [TotalCostAmount, setTotalCostAmount] = useState(0);
  const [ExpencesTransaction, setExpencesTransaction] = useState([]);
  let serverAddress = localStorage.getItem("targetUrl");
  const [ViewCostList, setViewCostList] = useState([]);
  const [AllMyExpences, setAllMyExpences] = useState([]);
  let cancelEditingProcess = (e, index) => {
    let updatedList = ExpencesTransaction.map((items, i) => {
      if (i == index) {
        return { ...items, contentEditable: false };
      }
      return items;
    });
    setViewCostList(updatedList);
  };

  useEffect(() => {
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
  }, [showEachItems]);

  useEffect(() => {
    setshowEachItems(showEachItems);
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
    let costAmount = 0;
    AllMyExpences.map((items) => {
      costAmount += Number(items.costAmount);
    });
    setTotalCostAmount(costAmount);
  }, [AllMyExpences]);

  return (
    <div>
      {ViewCostList.length > 0 ? (
        <SearchExpTransTable
          getExpencesTransaction={getExpencesTransaction}
          expencesData={expencesData}
          ExpencesTransaction={ExpencesTransaction}
          setViewCostList={setViewCostList}
          cancelEditingProcess={cancelEditingProcess}
          modifyAmountOrDescription={modifyAmountOrDescription}
          setshowConfirmDialog={setshowConfirmDialog}
          TotalCostAmount={TotalCostAmount}
          setDeleteConfirmation={setDeleteConfirmation}
          setconfirmAction={setconfirmAction}
          ViewCostList={ViewCostList}
        />
      ) : (
        <h3>no expence transaction</h3>
      )}
      {Errors && <SuccessOrError setErrors={setErrors} request={Errors} />}
      {searchTarget !== "singleTransaction" && (
        <Paper style={{ padding: "20px" }}>
          <Typography
            variant="body1"
            sx={{ color: "black", cursor: "default" }}
          >
            Total Sales Revenue = {CurrencyFormatter(TotalSalesRevenue)}
          </Typography>
          <br />
          <Typography
            sx={{ cursor: "pointer", color: "blue" }}
            variant="body1"
            onClick={(e) => setShowMoneyDetailModal(true)}
          >
            Collected Money = {CurrencyFormatter(collectedMoney.Money)}
          </Typography>
          <br />
          <Typography
            variant="body1"
            sx={{ color: "black", cursor: "default" }}
          >
            Total Purchase Cost ={" "}
            {openedBusiness === "myBusiness"
              ? CurrencyFormatter(TotalPurchaseCost)
              : 0}
          </Typography>
          <br />
          <Typography
            variant="body1"
            sx={{ color: "black", cursor: "default" }}
          >
            Account Receivable = {CurrencyFormatter(accountRecivableAmt)}
          </Typography>
          <br />
          {/* ///////////////// */}
          <Typography
            variant="body1"
            sx={{ color: "black", cursor: "default" }}
          >
            Net Cash Flow (Total Sales - Total Costs - Sold In Credit)
            &nbsp;&nbsp;&nbsp;
            {openedBusiness === "myBusiness"
              ? CurrencyFormatter(
                  TotalSalesRevenue -
                    TotalPurchaseCost -
                    TotalCostAmount -
                    accountRecivableAmt +
                    collectedMoney.Money
                )
              : CurrencyFormatter(
                  TotalSalesRevenue -
                    TotalCostAmount -
                    accountRecivableAmt +
                    collectedMoney.Money
                )}
          </Typography>
        </Paper>
      )}
      {ShowMoneyDetailModal && (
        <ModalToshowCollectedMoneyDetails
          setShowMoneyDetailModal={setShowMoneyDetailModal}
          ShowMoneyDetailModal={ShowMoneyDetailModal}
        />
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          open={showConfirmDialog}
          setShowConfirmDialog={setshowConfirmDialog}
        />
      )}
    </div>
  );
}

export default SearchExpenceTransaction;
