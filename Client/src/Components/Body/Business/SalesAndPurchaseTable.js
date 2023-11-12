import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CurrencyFormatter from "../../utility/Utility";
import { useNavigate } from "react-router-dom";
import SearchSales_PurchaseCss from "./SearchSales_Purchase.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConsumeableContext } from "../UserContext/UserContext";
import { DateFormatter } from "../Date/currentDate";
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
}) {
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
              <TableCell>Product name</TableCell>
              <TableCell>
                {showEachItems ? " Registration Date" : " Registration Dates"}
              </TableCell>
              <TableCell>Unit price</TableCell>
              <TableCell>Sold Qty</TableCell>
              <TableCell>Sold Qty incredit</TableCell>
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
              {console.log("ListOfSalesAndPurchase", ListOfSalesAndPurchase)}
              {ListOfSalesAndPurchase?.map((items, index) => {
                return (
                  <TableRow
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
                      {
                        <Chip
                          style={{
                            marginTop: "5px",
                            backgroundColor: "transparent",
                          }}
                          key={"dateOfRegistration_"}
                          label={DateFormatter(items.registeredTime)}
                        />
                      }
                    </TableCell>
                    <TableCell
                      className={"unitPrice" + items.transactionId}
                      id={"unitPrice_" + items.transactionId}
                      type="text"
                    >
                      {CurrencyFormatter(items.productsUnitPrice)}
                    </TableCell>
                    <TableCell
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
                      {items.salesQty}
                    </TableCell>
                    <TableCell
                      onInput={() =>
                        changesOnInputsOfTransaction("updateId_" + index, index)
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
                      {CurrencyFormatter(items.unitCost)}
                    </TableCell>
                    <TableCell
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
                      {items.purchaseQty}
                    </TableCell>
                    <TableCell
                      className={`totalCost${items.transactionId}`}
                      name="totalCost"
                      id={"totalPurchase_" + items.transactionId}
                      type="text"
                    >
                      {CurrencyFormatter(items.unitCost * items.purchaseQty)}
                    </TableCell>
                    <TableCell
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
                      {items.description}
                    </TableCell>
                    {showEachItems ? (
                      !items.contentEditable ? (
                        openedBusiness == "myBusiness" && (
                          <>
                            <TableCell
                              onClick={(e) => {
                                openedBusiness == "myBusiness" &&
                                  editSalesAndPurchase(e, items, index);
                              }}
                              className="cancelOrEditTransaction"
                            >
                              {openedBusiness == "myBusiness" && (
                                <EditIcon sx={{ color: "blue" }} />
                              )}
                            </TableCell>
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
                <TableCell colSpan={2}>Sum of Sales</TableCell>
                <TableCell>{CurrencyFormatter(TotalSalesRevenue)}</TableCell>
                <TableCell colSpan={2}>Sum of Purchase</TableCell>
                <TableCell>{CurrencyFormatter(TotalPurchaseCost)}</TableCell>
                <TableCell colSpan={2}>Sales - Purchases</TableCell>
                <TableCell>
                  {CurrencyFormatter(TotalSalesRevenue - TotalPurchaseCost)}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
