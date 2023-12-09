import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import $ from "jquery";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateFormatter } from "../Date/currentDate";

import ExportToExcel from "../../../PDF_EXCEL/PDF_EXCEL";
function SearchExpTransTable({
  setshowEachItems,
  ExpencesTransaction,
  modifyAmountOrDescription,
  ViewCostList,
  makeEditableTableData,
  cancelEditingProcess,
  setconfirmAction,
  setDeleteConfirmation,
  setconfirmMessages,
  TotalCostAmount,
  showEachItems,
  setshowConfirmDialog,
  setViewCostList,
  setviewInTable,
  viewInTable,
}) {
  console.log("@SearchExpTransTable ViewCostList", ViewCostList);

  // return;
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
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

  let openedBusiness = localStorage.getItem("openedBusiness");
  return (
    <>
      <ExportToExcel data={ViewCostList} target={"expencesTransactions"} />
      <div>
        {ViewCostList?.length > 0 ? (
          <>
            {!viewInTable ? (
              <div>
                <h2>Expences List table</h2>
                <div>
                  <strong> Decision: </strong>
                </div>
                <div>
                  {ViewCostList?.map((items, index) => {
                    console.log(items);
                    return (
                      <Paper
                        sx={{
                          padding: "20px",
                          margin: "10px 0",
                          width: "300px",
                        }}
                        key={"expenceWrapper_" + index}
                        id={`expenceWrapper_${items.costId}`}
                      >
                        <div>
                          <strong>Cost Name : </strong>
                          <span id={`expName_${items.expenseId}`}>
                            {items.costName}
                          </span>
                        </div>
                        <div>
                          <strong>Date: </strong>
                          <span
                            onClick={() => {
                              setshowEachItems(!showEachItems);
                            }}
                            sx={{ maxWidth: "120px" }}
                            id={`costRegisteredDate_${items.expenseId}`}
                          >
                            <Chip
                              style={{
                                maxWidth: "120px",
                                color: "rgb(25,118,210)",
                                backgroundColor: "rgb(248,248,248)",
                              }}
                              label={
                                showEachItems
                                  ? DateFormatter(items.costRegisteredDate)
                                  : items.costRegisteredDate
                              }
                            />
                          </span>
                        </div>
                        <div>
                          <strong>Cost Amount: </strong>
                          <span
                            className={items.contentEditable && "editableTd"}
                            onInput={(e) =>
                              modifyAmountOrDescription(
                                e,
                                "updateExpences_" + items.expenseId
                              )
                            }
                            contentEditable={`${items.contentEditable}`}
                            id={`expAmount_${items.expenseId}`}
                          >
                            {items.costAmount}
                          </span>
                        </div>
                        <div>
                          <strong> Description: </strong>
                          <span
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
                          </span>
                        </div>
                        <div>
                          <strong> Action : </strong>
                          <span>
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
                                        setconfirmAction(
                                          "deleteExpencesRecord"
                                        );
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
                          </span>
                        </div>
                        <div>
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
                        </div>
                      </Paper>
                    );
                  })}
                  <div>
                    <strong>Total Expences: </strong>
                    <span>
                      {TotalCostAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
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
                        <TableRow
                          key={"expenceWrapper_" + index}
                          id={`expenceWrapper_${items.costId}`}
                        >
                          <TableCell id={`expName_${items.expenseId}`}>
                            {items.costName}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setshowEachItems(!showEachItems);
                            }}
                            sx={{ maxWidth: "120px" }}
                            id={`costRegisteredDate_${items.expenseId}`}
                          >
                            <Chip
                              style={{
                                color: "rgb(25,118,210)",
                                backgroundColor: "rgb(248,248,248)",
                              }}
                              label={
                                showEachItems
                                  ? DateFormatter(items.costRegisteredDate)
                                  : items.costRegisteredDate
                              }
                            />
                            {/* {DateFormatter(items.costRegisteredDate)} */}
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
                                        setconfirmAction(
                                          "deleteExpencesRecord"
                                        );
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
                    <TableCell colSpan={2}>Total Expences</TableCell>
                    <TableCell>
                      {TotalCostAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Chip
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "red",
              margin: "10px",
            }}
            label={<h3>On this date no expences transaction</h3>}
          />
        )}
      </div>
    </>
  );
}

export default SearchExpTransTable;
