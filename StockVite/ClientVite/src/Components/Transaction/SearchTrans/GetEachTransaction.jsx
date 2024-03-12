import {
  Box,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import currentDates, { DateFormatter } from "../../Body/Date/currentDate";
import CurrencyFormatter, { ButtonProcessing } from "../../Utilities/Utility";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { Checkbox, Paper } from "@mui/material";
import ExportToExcel from "../../PDF_EXCEL/PDF_EXCEL";

import { ExpandMore, ExpandLess } from "@mui/icons-material";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import ModalTodeleteEachTransaction from "./ModalTodeleteEachTransaction";
import ModalToEditEachTransaction from "./ModalToEditEachTransaction";
import HRTAG from "../../Utilities/HRTAG";

function GetEachTransaction({
  RandValue,
  ProductId,
  searchInput,
  currentDay,
  productName,
  fromDate,
  toDate,
}) {
  let token = localStorage.getItem("storeToken");
  let openedBusiness = localStorage.getItem("openedBusiness");
  // use state starts here
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState("");
  const [EditSingleItem, setEditSingleItem] = useState({
    open: false,
    Items: {},
  });
  const [ShowDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState({
      open: false,
      Items: {},
    });
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const { Processing, setProcessing } = ConsumeableContext();

  let Today = currentDates();
  const [DailyTransaction, setDailyTransaction] = useState([]);
  const [mergedDataArray, setmergedDataArray] = useState([]);
  /**getDailyTransaction start here */
  let getDailyTransaction = async (targetproductId) => {
    try {
      // searchInput, currentDay;
      let OB = {
        productName,
        currentDates: currentDay ? currentDay : Today,
        businessId,
        productId: targetproductId,
        businessName,
        token,
        searchInput,
        fromDate,
        toDate,
      };
      // console.log("OB", OB);
      // return;
      setProcessing(true);
      setErrorsOrSuccess();
      setTransactionData((prev) => ({ TotalSales: 0, TotalPurchase: 0 }));
      let responce = await axios.post(
        serverAddress + "Transaction/getDailyTransaction/",
        {
          ...OB,
        }
      );
      // console.log("responce", responce);
      // return;
      setProcessing(false);
      let mydata = responce.data.data;
      if (mydata == "Error") {
        setErrorsOrSuccess(responce.data.Error);
        return;
      }
      const data = [...mydata];
      data.sort((a, b) => {
        return (
          new Date(a.registeredTimeDaily) - new Date(b.registeredTimeDaily)
        );
      });
      // console.log("data", data);
      // return;

      const mergedData = {};

      data.forEach((current) => {
        const { unitPrice, productRegistrationDate } = current;
        const key = `${unitPrice}-${productRegistrationDate}`;

        if (!mergedData[key]) {
          mergedData[key] = { ...current };
        } else {
          mergedData[key].purchaseQty += current.purchaseQty || 0;
          mergedData[key].salesQty += current.salesQty || 0;
          mergedData[key].creditsalesQty += current.creditsalesQty || 0;
          mergedData[key].brokenQty += current.brokenQty || 0;
        }
      });

      setmergedDataArray(Object.values(mergedData));

      if (mydata.length == 0) {
        return setErrorsOrSuccess("There is no registered data on this date.");
      }
      let i = 0;
      let Description = "",
        brokenQty = 0,
        productsIdList = [],
        ProductId = "",
        purchaseQty = 0,
        creditSalesQty = 0,
        salesQty = 0,
        registrationDate = "",
        prevProductId = 0,
        dailySales = {},
        productDetail = [],
        creditDueDate = "",
        creditPaymentDate = "",
        salesTypeValues = "",
        mydataLength = mydata.length,
        registrationSource = "Single";
      // collect same products to add qty
      for (; i < mydataLength; i++) {
        ProductId = mydata[i].ProductId;
        creditDueDate = dailySales[`creditDueDate` + ProductId];
        salesTypeValues = dailySales[`salesTypeValues` + ProductId];
        creditSalesQty = Number(dailySales["creditSalesQty" + ProductId]);
        salesQty = Number(dailySales["salesQuantity" + ProductId]);
        purchaseQty = Number(dailySales["purchaseQty" + ProductId]);
        brokenQty = Number(dailySales["wrickageQty" + ProductId]);
        Description = dailySales["Description" + ProductId];
        creditPaymentDate = dailySales["Description" + creditPaymentDate];
        // return
        if (
          !creditPaymentDate ||
          creditPaymentDate == undefined ||
          creditPaymentDate == "null"
        )
          creditPaymentDate = "";
        if (!creditDueDate) creditDueDate = "";
        if (salesTypeValues == undefined) salesTypeValues = "";
        if (isNaN(creditSalesQty)) creditSalesQty = 0;
        if (isNaN(salesQty)) salesQty = 0;
        if (isNaN(purchaseQty)) purchaseQty = 0;
        if (isNaN(brokenQty)) brokenQty = 0;
        if (isNaN(salesQty)) salesQty = 0;
        if (Description == undefined) Description = "";

        // return;
        ////////////////////////////
        creditPaymentDate += mydata[i].creditPaymentDate;
        salesTypeValues += mydata[i].salesTypeValues + ", ";
        creditSalesQty += mydata[i].creditsalesQty;
        productName = mydata[i].productName;
        Description += mydata[i].Description + " ";
        brokenQty += mydata[i].brokenQty;
        purchaseQty += mydata[i].purchaseQty;
        registrationDate = mydata[i].registrationDate;
        salesQty += mydata[i].salesQty;

        dailySales["registrationSource" + ProductId] = registrationSource;
        dailySales["creditPaymentDate" + ProductId] = creditPaymentDate;
        dailySales[`creditDueDate` + ProductId] = creditDueDate;
        dailySales[`salesTypeValues` + ProductId] = salesTypeValues;
        dailySales["creditSalesQty" + ProductId] = creditSalesQty;
        dailySales["salesQuantity" + ProductId] = salesQty;
        dailySales["purchaseQty" + ProductId] = purchaseQty;
        dailySales["wrickageQty" + ProductId] = brokenQty;
        dailySales["Description" + ProductId] = Description;

        // collect products id only
        if (prevProductId != ProductId) {
          productsIdList.push({
            ProductId,
          });
        }
        // to get last collection
        productDetail[0] = {
          productName: productName,
          PurchaseQty: purchaseQty,
          SalesQty: salesQty,
          BrokenQty: brokenQty,
        };
        prevProductId = ProductId;
      }

      setDailyTransaction(mydata);
    } catch (error) {
      setProcessing(false);
      setErrorsOrSuccess(error.message);
    }
  };

  useEffect(() => {
    setDailyTransaction([]);
    getDailyTransaction(ProductId);
  }, [, RandValue, ProductId]);

  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setdeviceSize(window.innerWidth);
  });
  let { TransactionData, setTransactionData } = ConsumeableContext();
  useEffect(() => {
    DailyTransaction.map((items) => {
      setTransactionData((prev) => {
        return {
          ...prev,
          TotalSales:
            Number(prev.TotalSales) +
            Number(items.salesQty + items.creditsalesQty) *
              Number(items.unitPrice),
          TotalPurchase:
            Number(prev.TotalPurchase) +
            Number(items.purchaseQty) * Number(items.unitCost),
        };
      });
    });
  }, [DailyTransaction]);
  const [viewEachTransactions, setviewEachTransactions] = useState(true);

  const [viewableData, setviewableData] = useState([]);
  useEffect(() => {
    setviewableData(viewEachTransactions ? DailyTransaction : mergedDataArray);
  }, [viewEachTransactions, DailyTransaction, mergedDataArray]);
  const [ExpandView, setExpandView] = useState(true);
  return (
    <div style={{ marginTop: "40px" }}>
      {Processing ? (
        <LinearProgress />
      ) : (
        <div>
          <Box
            sx={{
              padding: "30px",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "white",
            }}
            onClick={() => {
              setExpandView(!ExpandView);
            }}
          >
            <Typography>Sales & Purchase Transaction Table </Typography>
            <span>{ExpandView ? <ExpandMore /> : <ExpandLess />}</span>
          </Box>
          <HRTAG />
          {ExpandView && (
            <Paper>
              {ErrorsOrSuccess && (
                <SuccessOrError
                  request={ErrorsOrSuccess}
                  setErrorsOrSuccess={setErrorsOrSuccess}
                />
              )}

              <div>
                <br />
                <div>
                  Total Sales :- {CurrencyFormatter(TransactionData.TotalSales)}
                </div>
                <div>
                  Total Cost:-{" "}
                  {CurrencyFormatter(TransactionData.TotalPurchase)}
                </div>
                {DailyTransaction.length > 0 && (
                  <div>
                    <Checkbox
                      checked={deviceSize > 768 ? true : false}
                      onChange={() => {
                        setdeviceSize(deviceSize > 768 ? 700 : 800);
                      }}
                    />{" "}
                    View in table
                    <Checkbox
                      onChange={() =>
                        setviewEachTransactions(!viewEachTransactions)
                      }
                      checked={viewEachTransactions}
                    />{" "}
                    View Each Transaction
                    {deviceSize < 768 ? (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {viewableData?.map((items, index) => {
                          return (
                            <Paper
                              sx={{
                                padding: "20px",
                                margin: "10px",
                                width: "300px",
                              }}
                              key={"details_" + index}
                            >
                              <div>
                                <strong>Product Name: </strong>
                                {items.itemDetailInfo
                                  ? JSON.parse(items.itemDetailInfo).productName
                                  : ""}
                              </div>
                              <div>
                                <strong>Registration Date: </strong>
                                {DateFormatter(items.registeredTimeDaily)}
                              </div>
                              <div>
                                <strong>Registered By:- </strong>
                                {items.employeeName}
                              </div>
                              <div>
                                <strong>Purchase QTY: </strong>
                                {items.purchaseQty}
                              </div>
                              <div>
                                <strong>Unit Cost:- </strong>
                                <span>{CurrencyFormatter(items.unitCost)}</span>
                              </div>
                              <div>
                                <strong>Total Cost:- </strong>
                                <span>
                                  {CurrencyFormatter(
                                    items.purchaseQty * items.unitCost
                                  )}
                                </span>
                              </div>
                              <div>
                                <strong>Sales QTY: </strong>
                                {items.salesQty ? items.salesQty : 0}
                              </div>
                              <div>
                                <strong>Sales QTY Credit: </strong>
                                {items.creditsalesQty
                                  ? items.creditsalesQty
                                  : 0}
                              </div>
                              <div
                                style={{
                                  color: "white",
                                  backgroundColor: "green",
                                }}
                              >
                                <strong>Inventory: </strong>
                                {items.inventoryItem}
                              </div>

                              <div>
                                <strong>Unit Price: </strong>
                                {CurrencyFormatter(items.unitPrice)}
                              </div>
                              <div>
                                <strong>Total Price: </strong>
                                {CurrencyFormatter(
                                  items.unitPrice *
                                    (Number(items.creditsalesQty) +
                                      Number(items.salesQty))
                                )}
                              </div>

                              <div>
                                <strong>Payment Date: </strong>
                                {DateFormatter(items.creditPaymentDate)}
                              </div>
                              <div>
                                <strong>Sales Type : </strong>
                                {items.salesTypeValues}
                              </div>
                              {/* {(creditPaymentDate, creditsalesQty,)} */}
                              <div>
                                <strong>Broken QTY: </strong>
                                {items.brokenQty}
                              </div>
                              <div>
                                <strong>Description: </strong>{" "}
                                {items.Description}
                              </div>
                              <div>
                                <strong>Actions: </strong>
                                {openedBusiness !== "employersBusiness"
                                  ? viewEachTransactions && (
                                      <>
                                        <IconButton
                                          onClick={() => {
                                            setShowDeleteConfirmationModal({
                                              open: true,
                                              Items: items,
                                            });
                                          }}
                                          aria-label="delete"
                                        >
                                          <DeleteIcon color="error" />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => {
                                            setEditSingleItem(
                                              (previousState) => {
                                                return {
                                                  ...previousState,
                                                  open: true,
                                                  Items: items,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          <EditIcon color="info" />
                                        </IconButton>
                                      </>
                                    )
                                  : ""}
                              </div>
                            </Paper>
                          );
                        })}
                      </div>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead className="tableHeader">
                            <TableRow>
                              <TableCell>NO</TableCell>
                              <TableCell className="thTitle">
                                Product Name
                              </TableCell>
                              <TableCell className="thTitle">
                                Sales Date
                              </TableCell>
                              <TableCell className="thTitle">
                                Registered by
                              </TableCell>
                              <TableCell className="thTitle">
                                Purchase Qty{" "}
                              </TableCell>
                              <TableCell className="thTitle">
                                Unit Cost{" "}
                              </TableCell>
                              <TableCell className="thTitle">
                                Total Cost{" "}
                              </TableCell>
                              <TableCell className="thTitle">
                                Total Sales
                              </TableCell>
                              <TableCell className="thTitle">
                                Sales Qty Credit
                              </TableCell>
                              <TableCell className="thTitle">
                                unit Price
                              </TableCell>
                              <TableCell className="thTitle">
                                Sales in cash
                              </TableCell>

                              <TableCell className="thTitle">
                                Credit Payment Date
                              </TableCell>
                              <TableCell className="thTitle">
                                {" "}
                                Sales Type
                              </TableCell>
                              <TableCell className="thTitle">
                                {" "}
                                Inventory
                              </TableCell>
                              <TableCell className="thTitle">
                                Broken Qty
                              </TableCell>
                              <TableCell className="thTitle">
                                Description
                              </TableCell>
                              {viewEachTransactions &&
                                openedBusiness !== "employersBusiness" && (
                                  <TableCell className="thTitle">
                                    {" "}
                                    Update / Delete{" "}
                                  </TableCell>
                                )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {viewableData?.map((items, index) => {
                              return (
                                <TableRow key={"detailes_" + index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    {items.itemDetailInfo
                                      ? JSON.parse(items.itemDetailInfo)
                                          .productName
                                      : ""}
                                  </TableCell>
                                  <TableCell>
                                    {DateFormatter(items.registeredTimeDaily)}
                                  </TableCell>
                                  <TableCell>{items.employeeName}</TableCell>
                                  <TableCell>{items.purchaseQty}</TableCell>
                                  <TableCell>
                                    {CurrencyFormatter(items.unitCost)}
                                  </TableCell>
                                  <TableCell>
                                    {CurrencyFormatter(
                                      items.purchaseQty * items.unitCost
                                    )}
                                  </TableCell>
                                  <TableCell>{items.salesQty}</TableCell>
                                  <TableCell>{items.creditsalesQty}</TableCell>
                                  <TableCell>
                                    {CurrencyFormatter(items.unitPrice)}
                                  </TableCell>
                                  <TableCell>
                                    {CurrencyFormatter(
                                      (items.salesQty + items.creditsalesQty) *
                                        items.unitPrice
                                    )}
                                  </TableCell>

                                  <TableCell>
                                    {DateFormatter(items.creditPaymentDate)}
                                  </TableCell>
                                  <TableCell>{items.salesTypeValues}</TableCell>
                                  <TableCell>{items.inventoryItem}</TableCell>
                                  {/* {(creditPaymentDate, creditsalesQty,)} */}
                                  <TableCell> {items.brokenQty} </TableCell>
                                  <TableCell> {items.Description}</TableCell>
                                  <TableCell>
                                    {openedBusiness !== "employersBusiness"
                                      ? viewEachTransactions && (
                                          <>
                                            <IconButton
                                              onClick={() => {
                                                setShowDeleteConfirmationModal({
                                                  open: true,
                                                  Items: items,
                                                });
                                              }}
                                              aria-label="delete"
                                            >
                                              <DeleteIcon color="error" />
                                            </IconButton>
                                            <IconButton
                                              onClick={() => {
                                                setEditSingleItem(
                                                  (previousState) => {
                                                    return {
                                                      ...previousState,
                                                      open: true,
                                                      Items: items,
                                                    };
                                                  }
                                                );
                                              }}
                                            >
                                              <EditIcon color="info" />
                                            </IconButton>
                                          </>
                                        )
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow>
                              <TableCell colSpan={6}></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {!Processing ? (
                        <div style={{ width: "600px", margin: "auto" }}>
                          <ExportToExcel
                            data={DailyTransaction}
                            target="dailySales"
                          />
                        </div>
                      ) : (
                        <>
                          <ButtonProcessing />
                          <LinearProgress />
                        </>
                      )}
                    </Box>
                  </div>
                )}
                {/*ModalToEditEachTransaction  */}
                {EditSingleItem.open && (
                  <ModalToEditEachTransaction
                    Data={{
                      EditSingleItem,
                      setEditSingleItem,
                      setErrorsOrSuccess,
                      getDailyTransaction: getDailyTransaction,
                    }}
                  />
                )}
                {/* modal to delete items */}
                {ShowDeleteConfirmationModal.open && (
                  <ModalTodeleteEachTransaction
                    getDailyTransaction={getDailyTransaction}
                    setShowDeleteConfirmationModal={
                      setShowDeleteConfirmationModal
                    }
                    ShowDeleteConfirmationModal={ShowDeleteConfirmationModal}
                  />
                )}
              </div>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}

export default GetEachTransaction;
// dani biruk ,saron asech, bek seif
