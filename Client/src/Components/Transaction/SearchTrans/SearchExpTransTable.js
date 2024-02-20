import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { DateFormatter } from "../../Body/Date/currentDate";

import ExportToExcel from "../../PDF_EXCEL/PDF_EXCEL";
import CurrencyFormatter from "../../Utilities/Utility";
import { Checkbox } from "@mui/material";
import ExpTransEdit from "../../Expences/ExpTransEdit";
import ExptransDelete from "../../Expences/ExptransDelete";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
function SearchExpTransTable({
  getExpencesTransaction,
  expencesData,
  modifyAmountOrDescription,
  ViewCostList,
  cancelEditingProcess,
  setconfirmAction,
  TotalCostAmount,
  setshowConfirmDialog,
}) {
  expencesData.map((data) => {
    console.log("data", data);
    data.costRegisteredDate = DateFormatter(data.costRegisteredDate);
  });
  const [showEachItems, setshowEachItems] = useState(false);
  console.log("@SearchExpTransTable ViewCostList", ViewCostList);
  const [viewInTable, setviewInTable] = useState(false);

  let openedBusiness = localStorage.getItem("openedBusiness");
  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setdeviceSize(window.innerWidth);
  });
  const [EditExpences, setEditExpences] = useState({ item: "", Open: false });
  const [DeleteConfirmation, setDeleteConfirmation] = useState({
    item: {},
    Open: false,
  });
  const [ExpandView, setExpandView] = useState(false);
  return (
    <Box>
      <Paper>
        <Box
          sx={{
            // borderBottom: "1px solid black",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
          onClick={() => {
            setExpandView(!ExpandView);
          }}
        >
          <Typography>Expences Table </Typography>
          <span>{!ExpandView ? <ExpandMore /> : <ExpandLess />}</span>
        </Box>
        {ExpandView && (
          <>
            {EditExpences && (
              <ExpTransEdit
                getExpencesTransaction={getExpencesTransaction}
                EditExpences={EditExpences}
                setEditExpences={setEditExpences}
              />
            )}
            {DeleteConfirmation.Open && (
              <ExptransDelete
                getExpencesTransaction={getExpencesTransaction}
                DeleteConfirmation={DeleteConfirmation}
                setDeleteConfirmation={setDeleteConfirmation}
              />
            )}
            <ExportToExcel
              data={ViewCostList}
              target={"expencesTransactions"}
            />
            <div>
              {expencesData?.length > 0 ? (
                <>
                  <Checkbox
                    checked={deviceSize > 768 ? true : false}
                    onChange={() => {
                      setviewInTable(!viewInTable);
                      setdeviceSize(deviceSize > 768 ? 700 : 800);
                    }}
                  />
                  View In Table
                  <Checkbox
                    checked={showEachItems}
                    onChange={() => {
                      setshowEachItems(!showEachItems);
                    }}
                  />
                  Show Each Transactions
                  {viewInTable ? (
                    <div>
                      <div>
                        <strong> Decision: </strong>
                      </div>
                      <div>
                        {expencesData?.map((items, index) => {
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
                                        ? DateFormatter(
                                            items.costRegisteredDate
                                          )
                                        : items.costRegisteredDate
                                    }
                                  />
                                </span>
                              </div>
                              <div>
                                <strong>Cost Amount: </strong>
                                <span
                                  className={
                                    items.contentEditable && "editableTd"
                                  }
                                  onInput={(e) =>
                                    modifyAmountOrDescription(
                                      e,
                                      "updateExpences_" + items.expenseId
                                    )
                                  }
                                  contentEditable={`${items.contentEditable}`}
                                  id={`expAmount_${items.expenseId}`}
                                >
                                  {CurrencyFormatter(items.costAmount)}
                                </span>
                              </div>
                              <div>
                                <strong> Description: </strong>
                                <span
                                  className={
                                    items.contentEditable && "editableTd"
                                  }
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
                                          {console.log(
                                            "717",
                                            items.contentEditable
                                          )}
                                          <Button
                                            className="cancelExpeEditing1"
                                            id={
                                              `editExpences_` + items.expenseId
                                            }
                                            onClick={(e) => {
                                              cancelEditingProcess(e, index);
                                            }}
                                          >
                                            CANCEL
                                          </Button>
                                        </>
                                      )}

                                      {openedBusiness == "myBusiness" && (
                                        <>
                                          {!items.contentEditable && (
                                            <EditIcon
                                              sx={{ color: "blue" }}
                                              id={
                                                `editExpences_` +
                                                items.expenseId
                                              }
                                              className="editExpences1"
                                              onClick={(e) =>
                                                setEditExpences({
                                                  Open: true,
                                                  item: items,
                                                })
                                              }
                                            />
                                          )}

                                          <DeleteIcon
                                            sx={{ color: "red" }}
                                            onClick={(e) => {
                                              setDeleteConfirmation({
                                                Open: true,
                                                item: items,
                                              });
                                              console.log("items", items);
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
                                        // setconfirmAction("updateExpencesList");
                                        // setconfirmMessages(
                                        //   "Are you sure to update this expences record?"
                                        // );

                                        setshowConfirmDialog(true);
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
                            <TableCell>Cost Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Cost Amount</TableCell>
                            <TableCell> Description</TableCell>
                            <TableCell> Action </TableCell>
                            <TableCell> Decision</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {expencesData?.map((items, index) => {
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
                                        ? items.costRegisteredDate
                                        : items.costRegisteredDate
                                    }
                                  />
                                </TableCell>
                                <TableCell
                                  className={
                                    items.contentEditable && "editableTd"
                                  }
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
                                  className={
                                    items.contentEditable && "editableTd"
                                  }
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
                                          {console.log(
                                            "717",
                                            items.contentEditable
                                          )}
                                          <Button
                                            className="cancelExpeEditing1"
                                            id={
                                              `editExpences_` + items.expenseId
                                            }
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
                                              id={
                                                `editExpences_` +
                                                items.expenseId
                                              }
                                              className="editExpences1"
                                              onClick={(e) =>
                                                setEditExpences({
                                                  Open: true,
                                                  item: items,
                                                })
                                              }
                                            />
                                          )}

                                          <DeleteIcon
                                            sx={{ color: "red" }}
                                            onClick={(e) => {
                                              setDeleteConfirmation({
                                                Open: true,
                                                item: items,
                                              });
                                              ///////////////
                                              console.log("items", items);
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
                                          setconfirmAction(
                                            "updateExpencesList"
                                          );
                                          // setconfirmMessages(
                                          //   "Are you sure to update this expences record?"
                                          // );

                                          setshowConfirmDialog(true);
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
        )}
      </Paper>
      <br />
      <br />
      <br />
      <br />
    </Box>
  );
}

export default SearchExpTransTable;
