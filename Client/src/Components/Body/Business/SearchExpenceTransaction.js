import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import { Typography } from "@mui/material";
import ConfirmDialog from "../Others/Confirm";
import { ConsumeableContext } from "../UserContext/UserContext";
import CurrencyFormatter from "../../utility/Utility";
import { Paper } from "@material-ui/core";
import ModalToshowCollectedMoneyDetails from "./ModalToshowCollectedMoneyDetails";
import SearchExpTransTable from "./SearchExpTransTable";
import { DateFormatter } from "../Date/currentDate";
function SearchExpenceTransaction({
  showEachItems,
  SearchedDatas,
  setshowEachItems,
  setviewInTable,
  viewInTable,
  fromDate,
  toDate,
}) {
  const [expencesData, setexpencesData] = useState([]);
  let businessId = localStorage.getItem("businessId");

  let token = localStorage.getItem("storeToken");

  const { accountRecivableAmt, collectedMoney } = ConsumeableContext();
  const [ShowMoneyDetailModal, setShowMoneyDetailModal] = useState(false);

  let TotalSalesRevenue = 0,
    TotalPurchaseCost = 0;
  let { TransactionData } = ConsumeableContext();
  //  TotalSales: 0,
  //       TotalPurchase: 0,
  //       TotalExpences: 0,
  TotalSalesRevenue = TransactionData.TotalSales;
  TotalPurchaseCost = TransactionData.TotalPurchase;

  let openedBusiness = localStorage.getItem("openedBusiness");
  let deleteCostItems = async (items) => {
    let responces = await axios.post(serverAddress + "deleteExpencesItem/", {
      ...items,
      businessName,
    });
    let copy = [];
    if (responces.data.data == "deleteSuccess") {
      ViewCostList.map((cost) => {
        if (cost.expenseId !== items.expenseId) {
          copy.push(cost);
        }
        setViewCostList(copy);
      });
      alert("Deleted success");
    }
  };
  let handleExpencesTransactions = async (response) => {
    console.log("response = ", response);
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
        console.log(costList[i]);
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
        console.log(
          "ListByCostId.costRegisteredDate = ",
          ListByCostId.costRegisteredDate
        );

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
    let results = await axios.get(serverAddress + "getExpTransactions", {
      params: { token, businessId, fromDate, toDate },
    });
    let { expenceTransaction } = results.data;
    if (expenceTransaction == "error no 113") {
      return alert(expenceTransaction);
    }
    setexpencesData(expenceTransaction);
    // console.log(
    //   "getExpencesTransaction results",
    //   results.data.expenceTransaction
    // );
  };
  useEffect(() => {
    getExpencesTransaction();
  }, []);

  let modifyAmountOrDescription = (e, updateBtnID) => {
    $("#" + updateBtnID).show();
  };

  const [DeleteConfirmation, setDeleteConfirmation] = useState({});
  useEffect(() => {
    console.log(DeleteConfirmation);
    if (DeleteConfirmation.deleteStatus == "Confirmed") {
      deleteCostItems(DeleteConfirmation.items);
    }
  }, [DeleteConfirmation]);
  //  confirmAction, confirmMessages;
  const [confirmAction, setconfirmAction] = useState("");
  const [confirmMessages, setconfirmMessages] = useState("");

  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [TotalCostAmount, setTotalCostAmount] = useState(0);
  const [ExpencesTransaction, setExpencesTransaction] = useState([]);
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [ViewCostList, setViewCostList] = useState([]);
  const [AllMyExpences, setAllMyExpences] = useState([]);

  let cancelEditingProcess = (e, index) => {
    console.log(e);

    let updatedList = ExpencesTransaction.map((items, i) => {
      if (i == index) {
        return { ...items, contentEditable: false };
      }
      return items;
    });
    // console.log(CostTransaction);
    setViewCostList(updatedList);
  };
  let makeEditableTableData = (index) => {
    let updatedList = ExpencesTransaction?.map((items, i) => {
      if (i == index) {
        return { ...items, contentEditable: true };
      }
      return items;
    });
    // console.log(CostTransaction);
    setViewCostList(updatedList);
  };

  useEffect(() => {
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
  }, [showEachItems]);

  useEffect(() => {
    // send expences data to return using setViewCostList

    setshowEachItems(showEachItems);
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
    let costAmount = 0;
    AllMyExpences.map((items) => {
      costAmount += Number(items.costAmount);
    });
    setTotalCostAmount(costAmount);
  }, [AllMyExpences]);
  // useEffect(() => {
  //   console.log("@ViewCostList", ViewCostList);
  // }, [ViewCostList]);

  return (
    <div>
      {ViewCostList.length > 0 && (
        <SearchExpTransTable
          setviewInTable={setviewInTable}
          viewInTable={viewInTable}
          setshowEachItems={setshowEachItems}
          ExpencesTransaction={ExpencesTransaction}
          setViewCostList={setViewCostList}
          makeEditableTableData={makeEditableTableData}
          cancelEditingProcess={cancelEditingProcess}
          modifyAmountOrDescription={modifyAmountOrDescription}
          setshowConfirmDialog={setshowConfirmDialog}
          showEachItems={showEachItems}
          TotalCostAmount={TotalCostAmount}
          setconfirmMessages={setconfirmMessages}
          setDeleteConfirmation={setDeleteConfirmation}
          setconfirmAction={setconfirmAction}
          ViewCostList={ViewCostList}
        />
      )}

      <Paper style={{ padding: "20px" }}>
        <Typography variant="body1" sx={{ color: "black", cursor: "default" }}>
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
        <Typography variant="body1" sx={{ color: "black", cursor: "default" }}>
          Total Purchase Cost ={" "}
          {openedBusiness === "myBusiness"
            ? CurrencyFormatter(TotalPurchaseCost)
            : 0}
        </Typography>
        <br />
        <Typography variant="body1" sx={{ color: "black", cursor: "default" }}>
          Account Receivable = {CurrencyFormatter(accountRecivableAmt)}
        </Typography>
        <br />
        {/* ///////////////// */}
        <Typography variant="body1" sx={{ color: "black", cursor: "default" }}>
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

      {ShowMoneyDetailModal && (
        <ModalToshowCollectedMoneyDetails
          setShowMoneyDetailModal={setShowMoneyDetailModal}
          ShowMoneyDetailModal={ShowMoneyDetailModal}
        />
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          message={confirmMessages}
          open={showConfirmDialog}
          setShowConfirmDialog={setshowConfirmDialog}
          // onConfirm={
          //   confirmAction == "updateExpencesList"
          //     ? setUpdateConfirmation
          //     : setDeleteConfirmation
          // }
          // {setConfirmDeletePurchaseAndSales}
        />
      )}
    </div>
  );
}

export default SearchExpenceTransaction;
