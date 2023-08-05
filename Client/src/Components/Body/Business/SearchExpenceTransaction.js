import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ConfirmDialog from "../Others/Confirm";
function SearchExpenceTransaction({
  showEachItems,
  response,
  setshowEachItems,
}) {
  console.log(
    "showEachItems",
    showEachItems,

    "setshowEachItems",
    setshowEachItems
  );
  let TotalSalesRevenue = 0,
    TotalPurchaseCost = 0;
  console.log("response is == ", response.data.data);
  let data = response.data.data;
  data.map((item) => {
    console.log(item.unitCost, item.purchaseQty);
    console.log(item.unitPrice, item.salesQty);
    TotalPurchaseCost += parseInt(item.unitCost) * parseInt(item.purchaseQty);
    TotalSalesRevenue += parseInt(item.unitPrice) * parseInt(item.salesQty);
  });
  console.log(
    "TotalSalesRevenue==",
    TotalSalesRevenue,
    "TotalPurchaseCost==",
    TotalPurchaseCost
  );
  let openedBusiness = localStorage.getItem("openedBusiness");
  let deleteCostItems = async (items) => {
    console.log({ ...items, businessName });
    // return;
    let responces = await axios.post(serverAddress + "deleteExpencesItem/", {
      ...items,
      businessName,
    });
    console.log("@responces deleteExpencesItem", responces);
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
    let expenceTransaction = response.data.expenceTransaction;
    console.log("expenceTransaction = ", expenceTransaction);
    expenceTransaction.sort((a, b) =>
      a.productName > b.productName ? 1 : b.productName > a.productName ? -1 : 0
    );
    let ListByCostId = {};
    let costList = [];
    let datas = response.data.expenceTransaction;
    expenceTransaction.map((cost) => {
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
            ListByCostId.costAmount += items.costAmount;
            ListByCostId.costId = cost.costId;
            let Time = cost.costRegisteredDate.split("T")[0];
            ListByCostId.costRegisteredDate += Time + ", ";
            ListByCostId.costName = cost.costName;
            ListByCostId.costDescription += items.costDescription + ", ";
          }
        });
        console.log(
          "ListByCostId.costRegisteredDate = ",
          ListByCostId.costRegisteredDate
        );
        ListByCostId.costRegisteredDate = ListByCostId.costRegisteredDate.slice(
          0,
          -2
        );
        ListByCostId.costDescription = ListByCostId.costDescription.slice(
          0,
          -2
        );
        costList.push(ListByCostId);
      }
    });
    setAllMyExpences(costList);
  };
  let modifyAmountOrDescription = (e, updateBtnID) => {
    $("#" + updateBtnID).show();
  };
  // ? setUpdateConfirmation
  //             : setDeleteConfirmation
  const [UpdateConfirmation, setUpdateConfirmation] = useState({});
  useEffect(() => {
    console.log(UpdateConfirmation);
    let items = UpdateConfirmation.items;
    if (UpdateConfirmation.updateStatus == "Confirmed")
      updateExpences(
        items.expenseId,
        `expAmount_${items.expenseId}`,
        `expDescription_${items.expenseId}`,
        UpdateConfirmation.index
      );
  }, [UpdateConfirmation]);

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
  let updateExpences = async (costId, amountId, descriptionId, index) => {
    console.log(costId, amountId, descriptionId);
    let amount = $("#" + amountId).text(),
      description = $("#" + descriptionId).text();
    console.log(amount, description);
    $(".LinearProgress").css("display", "block");
    let responces = await axios.post(serverAddress + "updateMyexpencesList/", {
      amount,
      description,
      businessName,
      ExpId: costId,
    });
    $(".LinearProgress").css("display", "none");
    console.log("responces", responces);
    let answer = responces.data.data;
    console.log(answer);
    if (answer == "updated") {
      alert("Thank you your data is updated successfully");

      let updatedList = ExpencesTransaction?.map((items, i) => {
        if (i == index) {
          return { ...items, contentEditable: false };
        }
        return items;
      });
      // console.log(CostTransaction);
      setViewCostList(updatedList);
    }
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
  let getExpences = async () => {
    handleExpencesTransactions(response);
    setExpencesTransaction(response.data.expenceTransaction);
  };
  useEffect(() => {
    getExpences();
  }, []);
  useEffect(() => {
    console.log("ioioio");
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
  }, [showEachItems]);

  useEffect(() => {
    // send expences data to return using setViewCostList
    let showEachItems = $("#showEachItems").is(":checked");
    setshowEachItems(showEachItems);
    if (showEachItems) setViewCostList(ExpencesTransaction);
    else setViewCostList(AllMyExpences);
    let costAmount = 0;
    AllMyExpences.map((items) => {
      console.log("AllMyExpences", items.costAmount);
      costAmount += items.costAmount;
    });
    setTotalCostAmount(costAmount);
    console.log(costAmount);
  }, [AllMyExpences]);

  return (
    <div>
      {ViewCostList?.length > 0 ? (
        <>
          <TableContainer>
            <Table className="costTransaction">
              <TableHead>
                <TableRow>
                  <TableCell colspan="6">
                    <h2>Expences List table</h2>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell>Cost Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Cost Amount</TableCell>
                  <TableCell> Description</TableCell>
                  <TableCell> Action </TableCell>
                  <TableCell> Decision</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ViewCostList?.map((items, index) => {
                  console.log(items);
                  return (
                    <TableRow id={`expenceWrapper_${items.costId}`}>
                      <TableCell id={`expName_${items.expenseId}`}>
                        {items.costName}
                      </TableCell>
                      <TableCell id={`costRegisteredDate_${items.expenseId}`}>
                        {items.costRegisteredDate.split("T")[0]}
                      </TableCell>
                      <TableCell
                        className={items.contentEditable && "editableTd"}
                        onInput={(e) =>
                          modifyAmountOrDescription(
                            e,
                            "updateExpences_" + items.expenseId
                          )
                        }
                        contenteditable={`${items.contentEditable}`}
                        id={`expAmount_${items.expenseId}`}
                      >
                        {items.costAmount}
                      </TableCell>
                      <TableCell
                        className={items.contentEditable && "editableTd"}
                        onInput={(e) =>
                          modifyAmountOrDescription(
                            e,
                            "updateExpences_" + items.expenseId
                          )
                        }
                        contentEditable={`${items.contentEditable}`}
                        id={`expDescription_${items.expenseId}`}
                      >
                        {items.costDescription}
                      </TableCell>
                      <TableCell>
                        {showEachItems ? (
                          <>
                            {items.contentEditable && (
                              <>
                                {console.log("717", items.contentEditable)}
                                <Button
                                  className="cancelExpeEditing1"
                                  id={`editExpences_` + items.expenseId}
                                  onClick={(e) => {
                                    cancelEditingProcess(e, index);
                                  }}
                                >
                                  CANCEL
                                </Button>
                              </>
                            )}
                            {console.log(
                              "items.contentEditable",
                              items.contentEditable
                            )}

                            {openedBusiness == "myBusiness" && (
                              <>
                                {!items.contentEditable && (
                                  <EditIcon
                                    sx={{ color: "blue" }}
                                    id={`editExpences_` + items.expenseId}
                                    className="editExpences1"
                                    onClick={(e) =>
                                      makeEditableTableData(
                                        index,
                                        `expAmount_${items.expenseId}`,
                                        `expDescription_${items.expenseId}`,
                                        `updateExpences_` + items.expenseId,
                                        `editExpences_` + items.expenseId
                                      )
                                    }
                                  />
                                )}

                                <DeleteIcon
                                  sx={{ color: "red" }}
                                  onClick={(e) => {
                                    setshowConfirmDialog(true);
                                    setconfirmMessages(
                                      "Are you sure to delete this expences?"
                                    );
                                    setconfirmAction("deleteExpencesRecord");
                                    setDeleteConfirmation({
                                      items,
                                      deleteStatus: "notConfirmed",
                                    });
                                    // deleteCostItems(e, items)
                                  }}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell>
                        <>
                          {items.contentEditable && (
                            <Button
                              id={"updateExpences_" + items.expenseId}
                              className="updateExpences"
                              onClick={() => {
                                setconfirmAction("updateExpencesList");
                                setconfirmMessages(
                                  "Are you sure to update this expences record?"
                                );

                                setshowConfirmDialog(true);
                                setUpdateConfirmation((prevstates) => {
                                  return {
                                    ...prevstates,
                                    items,
                                    index,
                                    updateStatus: "notConfirmed",
                                  };
                                });
                              }}
                            >
                              Update
                            </Button>
                          )}
                        </>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableRow>
                <TableCell colSpan={2}>Total Cost</TableCell>
                <TableCell>
                  {TotalCostAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
          Net cash flow is=
          {(
            TotalSalesRevenue -
            TotalPurchaseCost -
            TotalCostAmount
          ).toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
          })}
        </>
      ) : (
        <>
          <br />
          <center>
            Note:- On this day you have not expencess.
            <br /> <br />
            Net Cash Flow &nbsp;&nbsp;&nbsp;
            {(TotalSalesRevenue - TotalPurchaseCost).toLocaleString("en-US", {
              style: "currency",
              currency: "ETB",
            })}
          </center>
        </>
        // ""
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          message={confirmMessages}
          open={showConfirmDialog}
          setShowConfirmDialog={setshowConfirmDialog}
          onConfirm={
            confirmAction == "updateExpencesList"
              ? setUpdateConfirmation
              : setDeleteConfirmation
          }
          // {setConfirmDeletePurchaseAndSales}
        />
      )}
    </div>
  );
}

export default SearchExpenceTransaction;
