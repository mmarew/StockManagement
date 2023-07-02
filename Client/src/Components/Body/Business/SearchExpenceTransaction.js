import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
function SearchExpenceTransaction({
  showEachItems,
  response,
  setshowEachItems,
}) {
  let handleExpencesTransactions = (response) => {
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
                              <div
                                className="cancelExpeEditing"
                                id={`editExpences_` + items.expenseId}
                                onClick={(e) => {
                                  cancelEditingProcess(e, index);
                                }}
                              >
                                CANCEL
                              </div>
                            </>
                          )}
                          {console.log(
                            "items.contentEditable",
                            items.contentEditable
                          )}
                          {!items.contentEditable && (
                            <span
                              id={`editExpences_` + items.expenseId}
                              className="editExpences"
                              onClick={(e) =>
                                makeEditableTableData(
                                  index,
                                  `expAmount_${items.expenseId}`,
                                  `expDescription_${items.expenseId}`,
                                  `updateExpences_` + items.expenseId,
                                  `editExpences_` + items.expenseId
                                )
                              }
                            >
                              Edit
                            </span>
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
                              updateExpences(
                                items.expenseId,
                                `expAmount_${items.expenseId}`,
                                `expDescription_${items.expenseId}`,
                                index
                              );
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
              <TableCell>{TotalCostAmount}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      ) : (
        // <h4>No cost list table</h4>
        ""
      )}
    </div>
  );
}

export default SearchExpenceTransaction;
