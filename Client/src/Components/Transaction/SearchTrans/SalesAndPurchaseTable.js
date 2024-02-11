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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CurrencyFormatter from "../../../utility/Utility";
import { useNavigate } from "react-router-dom";
import SearchSales_PurchaseCss from "./SearchSales_Purchase.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConsumeableContext } from "../../UserContext/UserContext";
import { DateFormatter } from "../../Date/currentDate";
function SalesAndPurchaseTable({
  ListOfSalesAndPurchase,
  showEachItems,
  setshowEachItems,
  changesOnInputsOfTransaction,
  setListOfSalesAndPurchase,
  cancelSalesAndPurchase,
  setConfirmMessages,
  deleteSales_purchase,
  setConfirmAction,
  setUpdateSalesAndPurchase,
  setShowConfirmDialog,
  TotalSalesRevenue,
  TotalPurchaseCost,
  seteditTransactions,
  viewInTable,
}) {
  // opopopop;
  let { singleSalesInputValues, setSinlgeSalesInputValues } =
    ConsumeableContext();
  useEffect(() => {
    if (
      singleSalesInputValues.singleSalesDate !== null &&
      singleSalesInputValues.searchInput !== null
    ) {
      let btnsearchSingleProduct = document.getElementById(
        "btnsearchSingleProduct"
      );
      btnsearchSingleProduct?.click();
    }
  }, [singleSalesInputValues]);

  let Navigate = useNavigate();
  let openedBusiness = localStorage.getItem("openedBusiness");
  let businessName = localStorage.getItem("businessName");
  let editSalesAndPurchase = async (e, item, index) => {
    console.log("item", item);
    let { registrationSource } = item;

    if (registrationSource == "Total")
      seteditTransactions({ Open: true, item });
    else {
      let { productName, registrationDate } = item;
      // `singleSalesDate,
      // btnsearchSingleProduct,
      // searchInputToSingleProducts;`;
      // let singleSalesDate = document.getElementById("singleSalesDate");
      setSinlgeSalesInputValues({
        singleSalesDate: registrationDate,
        searchInput: productName,
      });
      Navigate(
        "/OpenBusiness/addTransaction/AddSalesTranaction/addSingleSales"
      );
    }
  };
  // return console.log("ListOfSalesAndPurchase", ListOfSalesAndPurchase);
  return (
    <Box>
      {ListOfSalesAndPurchase.length > 0 ? (
        <>
          {!viewInTable ? (
            <Box>
              {console.log("ListOfSalesAndPurchase", ListOfSalesAndPurchase)}
              {ListOfSalesAndPurchase?.map((items, index) => {
                return (
                  <Paper
                    key={"ListOfSalesAndPurchase_" + index}
                    sx={{ padding: "20px", margin: "10px", width: "320px" }}
                    className={
                      SearchSales_PurchaseCss.searchedDatas +
                      " Transaction_" +
                      index
                    }
                  >
                    <div id={"productName_" + items.transactionId} type="text">
                      <strong>Product Name:- </strong>
                      {items.productName}
                    </div>
                    <div
                      type="text"
                      id={"RegistrationDate_" + items.transactionId}
                      className={
                        items.contentEditable && "date" + items.transactionId
                      }
                    >
                      {console.log(
                        "items.registrationDate",
                        items.regiteredTime
                      )}
                      <strong> Registration Time :-</strong>
                      {
                        <Chip
                          style={{
                            color: "rgb(25,118,210)",
                            backgroundColor: "transparent",
                          }}
                          key={"dateOfRegistration_"}
                          label={
                            showEachItems
                              ? DateFormatter(items.registeredTime)
                              : items.registeredTime
                          }
                        />
                      }
                    </div>
                    <div
                      className={"unitPrice" + items.transactionId}
                      id={"unitPrice_" + items.transactionId}
                      type="text"
                    >
                      <strong>Unit Price </strong>
                      {CurrencyFormatter(items.productsUnitPrice)}
                    </div>
                    <div
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `salesQty${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"salesQty_" + items.transactionId}
                      type="text"
                    >
                      <strong>Sales qty</strong> {items.salesQty}
                    </div>
                    <div
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `salesQty${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"salesQtyInCredit_" + items.transactionId}
                      type="text"
                    >
                      <strong>Credit Sales QTY</strong>
                      {items.creditsalesQty}
                    </div>
                    <div
                      className={`totalSales${items.transactionId}`}
                      id={"totalSales_" + items.transactionId}
                      type="text"
                    >
                      <strong>Total Sales:-</strong>
                      {CurrencyFormatter(
                        (items.salesQty + items.creditsalesQty) *
                          items.productsUnitPrice
                      )}
                    </div>
                    <div
                      className={`unitCost${items.transactionId}`}
                      name="unitCost"
                      id={"unitCost_" + items.transactionId}
                      type="text"
                    >
                      <strong>Unit Cost:- </strong>
                      {openedBusiness == "myBusiness"
                        ? CurrencyFormatter(items.unitCost)
                        : 0}
                    </div>
                    <div
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `purchaseQty${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"purchaseQty_" + items.transactionId}
                      type="text"
                      name="purchaseQty"
                    >
                      <strong>Purchasing Qty :- </strong>
                      {items.purchaseQty}
                    </div>
                    <div
                      className={`totalCost${items.transactionId}`}
                      name="totalCost"
                      id={"totalPurchase_" + items.transactionId}
                      type="text"
                    >
                      <strong>Purchase Cost</strong>{" "}
                      {openedBusiness == "myBusiness"
                        ? CurrencyFormatter(items.unitCost * items.purchaseQty)
                        : CurrencyFormatter(0)}
                    </div>
                    <div
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable &&
                        `broken${items.transactionId} editableTD`
                      }
                      contentEditable={items.contentEditable}
                      id={"wrickages_" + items.transactionId}
                      type="text"
                      name="broken"
                    >
                      <strong>Broken QTY</strong> {items.wrickages}
                    </div>
                    <div
                      className={`inventory${items.transactionId}`}
                      id={"Inventory_" + items.transactionId}
                      type="text"
                    >
                      <strong>Inventory :- </strong> {items.Inventory}
                    </div>
                    <div
                      sx={{ minWidth: "300px" }}
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
                      }
                      className={
                        items.contentEditable
                          ? `description${items.transactionId} editableTD`
                          : ""
                      }
                      contentEditable={items.contentEditable}
                      id={"Description_" + items.transactionId}
                      type="text"
                      name="description"
                    >
                      <strong> Description :- </strong>
                      {items.description}
                    </div>
                    {showEachItems ? (
                      !items.contentEditable ? (
                        openedBusiness == "myBusiness" && (
                          <>
                            <div onClick={() => deleteSales_purchase(items)}>
                              {openedBusiness == "myBusiness" && (
                                <DeleteIcon sx={{ color: "red" }} />
                              )}
                            </div>
                          </>
                        )
                      ) : (
                        <div
                          className="cancelOrEditTransaction"
                          onClick={(e) => cancelSalesAndPurchase(e, index)}
                        >
                          <Button>cancel </Button>
                        </div>
                      )
                    ) : (
                      <div></div>
                    )}
                    {items.updateEditedContent ? (
                      <div>
                        <Button
                          variant="contained"
                          color="info"
                          className="updateTransaction"
                          id={"updateId_" + index}
                          onClick={(e) => {
                            setConfirmMessages(
                              "Are you sure to update this data?"
                            );
                            setConfirmAction("updateSalesAndPurchaseData");
                            setUpdateSalesAndPurchase({
                              items,
                              index,
                              status: "notVerified",
                            });
                            setShowConfirmDialog(true);
                          }}
                        >
                          {/* kkkkkkkkk */}
                          Update
                        </Button>
                      </div>
                    ) : (
                      <div>&nbsp;</div>
                    )}
                  </Paper>
                );
              })}
              <div
                className={SearchSales_PurchaseCss.salesPurchaseLastRow}
                style={{
                  backgroundColor: "#B3E5FC",
                  padding: "20px",
                  width: "300px",
                }}
              >
                <div>Sum of Sales = {CurrencyFormatter(TotalSalesRevenue)}</div>
                <div>
                  Sum of Purchase =
                  {openedBusiness == "myBusiness"
                    ? CurrencyFormatter(TotalPurchaseCost)
                    : CurrencyFormatter(0)}
                </div>
                <div>
                  Sales - Purchases={" "}
                  {CurrencyFormatter(TotalSalesRevenue - TotalPurchaseCost)}
                </div>
              </div>
            </Box>
          ) : (
            <TableContainer>
              <Table id="productTransaction">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={15}>
                      <h3>purchase , sales, inventory and description table</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>Product&nbsp;&nbsp;&nbsp;&nbsp;name</TableCell>
                  <TableCell>
                    {showEachItems
                      ? " Registration Date"
                      : " Registration Dates"}
                  </TableCell>
                  <TableCell>Unit price</TableCell>
                  <TableCell>
                    Sold&nbsp;&nbsp;Qty&nbsp;&nbsp;In&nbsp;&nbsp;Cash
                  </TableCell>
                  <TableCell>Sold Qty In Credit</TableCell>
                  <TableCell>Total sales</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>purchase Qty</TableCell>
                  <TableCell>Total Purchase</TableCell>
                  <TableCell>Broken</TableCell>
                  <TableCell>Inventory</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell colSpan={2}>Action</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
                <TableBody>
                  {console.log(
                    "ListOfSalesAndPurchase",
                    ListOfSalesAndPurchase
                  )}
                  {ListOfSalesAndPurchase?.map((items, index) => {
                    return (
                      <TableRow
                        key={"ListOfSalesAndPurchase_1" + index}
                        className={
                          SearchSales_PurchaseCss.searchedDatas +
                          " Transaction_" +
                          index
                        }
                      >
                        <TableCell
                          id={"productName_" + items.transactionId}
                          type="text"
                        >
                          {items.productName}
                        </TableCell>
                        <TableCell
                          onClick={() => setshowEachItems(!showEachItems)}
                          type="text"
                          id={"RegistrationDate_" + items.transactionId}
                          className={
                            items.contentEditable &&
                            "date" + items.transactionId
                          }
                        >
                          {console.log(
                            "items.registrationDate",
                            items.regiteredTime
                          )}
                          <Chip
                            sx={{
                              maxWidth: "200px",
                              fontWeight: "700",
                              color: "rgb(25,118,210)",
                              cursor: "pointer",
                            }}
                            label={
                              showEachItems
                                ? DateFormatter(items.registeredTime)
                                : items.registeredTime
                            }
                          />
                        </TableCell>
                        <TableCell
                          className={"unitPrice" + items.transactionId}
                          id={"unitPrice_" + items.transactionId}
                          type="text"
                        >
                          {CurrencyFormatter(items.unitPrice)}
                        </TableCell>
                        <TableCell
                          onInput={() =>
                            changesOnInputsOfTransaction(
                              "updateId_" + index,
                              index
                            )
                          }
                          className={
                            items.contentEditable &&
                            `salesQty${items.transactionId} editableTD`
                          }
                          contentEditable={items.contentEditable}
                          id={"salesQty_" + items.transactionId}
                          type="text"
                        >
                          {items.salesQty}
                        </TableCell>
                        <TableCell
                          onInput={() =>
                            changesOnInputsOfTransaction(
                              "updateId_" + index,
                              index
                            )
                          }
                          className={
                            items.contentEditable &&
                            `salesQty${items.transactionId} editableTD`
                          }
                          contentEditable={items.contentEditable}
                          // className={`salesQtyInCredit${items.transactionId}  `}
                          // contentEditable={items.contentEditable}
                          id={"salesQtyInCredit_" + items.transactionId}
                          type="text"
                        >
                          {items.creditsalesQty}
                        </TableCell>
                        <TableCell
                          className={`totalSales${items.transactionId}`}
                          id={"totalSales_" + items.transactionId}
                          type="text"
                        >
                          {CurrencyFormatter(
                            (items.salesQty + items.creditsalesQty) *
                              items.productsUnitPrice
                          )}
                        </TableCell>
                        <TableCell
                          className={`unitCost${items.transactionId}`}
                          name="unitCost"
                          id={"unitCost_" + items.transactionId}
                          type="text"
                        >
                          {openedBusiness == "myBusiness"
                            ? CurrencyFormatter(items.unitCost)
                            : 0}
                        </TableCell>
                        <TableCell
                          onInput={() =>
                            changesOnInputsOfTransaction(
                              "updateId_" + index,
                              index
                            )
                          }
                          className={
                            items.contentEditable &&
                            `purchaseQty${items.transactionId} editableTD`
                          }
                          contentEditable={items.contentEditable}
                          id={"purchaseQty_" + items.transactionId}
                          type="text"
                          name="purchaseQty"
                        >
                          {items.purchaseQty}
                        </TableCell>
                        <TableCell
                          className={`totalCost${items.transactionId}`}
                          name="totalCost"
                          id={"totalPurchase_" + items.transactionId}
                          type="text"
                        >
                          {openedBusiness == "myBusiness"
                            ? CurrencyFormatter(
                                items.unitCost * items.purchaseQty
                              )
                            : CurrencyFormatter(0)}
                        </TableCell>
                        <TableCell
                          onInput={() =>
                            changesOnInputsOfTransaction(
                              "updateId_" + index,
                              index
                            )
                          }
                          className={
                            items.contentEditable &&
                            `broken${items.transactionId} editableTD`
                          }
                          contentEditable={items.contentEditable}
                          id={"wrickages_" + items.transactionId}
                          type="text"
                          name="broken"
                        >
                          {items.wrickages}
                        </TableCell>
                        <TableCell
                          className={`inventory${items.transactionId}`}
                          id={"Inventory_" + items.transactionId}
                          type="text"
                        >
                          {items.Inventory}
                        </TableCell>
                        <TableCell
                          sx={{ minWidth: "300px" }}
                          onInput={() =>
                            changesOnInputsOfTransaction(
                              "updateId_" + index,
                              index
                            )
                          }
                          className={
                            items.contentEditable
                              ? `description${items.transactionId} editableTD`
                              : ""
                          }
                          contentEditable={items.contentEditable}
                          id={"Description_" + items.transactionId}
                          type="text"
                          name="description"
                        >
                          {items.description}
                        </TableCell>
                        {showEachItems ? (
                          !items.contentEditable ? (
                            openedBusiness == "myBusiness" && (
                              <>
                                <TableCell
                                  onClick={() => deleteSales_purchase(items)}
                                >
                                  {openedBusiness == "myBusiness" && (
                                    <DeleteIcon sx={{ color: "red" }} />
                                  )}
                                </TableCell>
                              </>
                            )
                          ) : (
                            <TableCell
                              className="cancelOrEditTransaction"
                              onClick={(e) => cancelSalesAndPurchase(e, index)}
                            >
                              <Button>cancel </Button>
                            </TableCell>
                          )
                        ) : (
                          <TableCell></TableCell>
                        )}
                        {items.updateEditedContent ? (
                          <TableCell>
                            <Button
                              variant="contained"
                              color="info"
                              className="updateTransaction"
                              id={"updateId_" + index}
                              onClick={(e) => {
                                setConfirmMessages(
                                  "Are you sure to update this data?"
                                );
                                setConfirmAction("updateSalesAndPurchaseData");
                                setUpdateSalesAndPurchase({
                                  items,
                                  index,
                                  status: "notVerified",
                                });
                                setShowConfirmDialog(true);
                              }}
                            >
                              {/* kkkkkkkkk */}
                              Update
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell>&nbsp;</TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                  <TableRow
                    className={SearchSales_PurchaseCss.salesPurchaseLastRow}
                    style={{ backgroundColor: "#B3E5FC" }}
                  >
                    <TableCell colSpan={2}></TableCell>
                    <TableCell colSpan={2}>
                      Sum of Sales = {CurrencyFormatter(TotalSalesRevenue)}
                    </TableCell>
                    <TableCell colSpan={2}>
                      Sum of Purchase =
                      {openedBusiness == "myBusiness"
                        ? CurrencyFormatter(TotalPurchaseCost)
                        : CurrencyFormatter(0)}
                    </TableCell>
                    <TableCell colSpan={5}>
                      Sales - Purchases={" "}
                      {CurrencyFormatter(TotalSalesRevenue - TotalPurchaseCost)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <>
          <Chip
            style={{ backgroundColor: "rgba(255, 0, 0, 0.2)", color: "red" }}
            label={<h3>On this date no sales and purchase transaction</h3>}
          />
          {}
        </>
      )}
    </Box>
  );
}

export default SalesAndPurchaseTable;
