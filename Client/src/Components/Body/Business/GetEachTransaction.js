import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import singleSalesCss from "./AddSingleSales.module.css";
import React, { useEffect, useState } from "react";
import currentDates, { DateFormatter } from "../Date/currentDate";
import CurrencyFormatter, { ButtonProcessing } from "../../utility/Utility";
import CloseIcon from "@material-ui/icons/Close";
import { ConsumeableContext } from "../UserContext/UserContext";
import { Checkbox, Paper } from "@material-ui/core";
import ExportToExcel from "../../../PDF_EXCEL/PDF_EXCEL";

import { ExpandMore, ExpandLess } from "@mui/icons-material";

function GetEachTransaction({
  RandValue,
  ProductId,
  searchInput,
  currentDay,
  setGetAllDailyRegisters,
  fromDate,
  toDate,
}) {
  let token = localStorage.getItem("storeToken");
  let openedBusiness = localStorage.getItem("openedBusiness");
  let { setShowProgressBar, setProccessing } = ConsumeableContext();
  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
    token: token,
  });
  const [EditSingleItem, setEditSingleItem] = useState({
    open: false,
    Items: {},
  });
  const [ShowDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState({
      open: false,
      Items: {},
    });
  const [productDetailes, setproductDetailes] = useState([]);
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [Proccess, setProccess] = useState(false);

  let Today = currentDates();
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});

  const [DailyTransaction, setDailyTransaction] = useState([]);

  /**getTotalRegisters start here */
  const [mergedDataArray, setmergedDataArray] = useState([]);

  let getTotalRegisters = async (targetproductId) => {
    console.log("targetproductId", targetproductId);
    setSearchedProducts([]);
    // searchInput, currentDay;
    let OB = {
      currentDates: currentDay ? currentDay : Today,
      businessId,
      productId: targetproductId,
      businessName,
      token,
      searchInput,
      fromDate,
      toDate,
    };
    console.log("@getDailyTransaction", OB);
    // return;
    setShowProgressBar(true);
    setProccessing(true);
    let responce = await axios.post(serverAddress + "getDailyTransaction/", {
      ...OB,
    });
    setShowProgressBar(false);
    setProccessing(false);
    let mydata = responce.data.data;

    const data = [...mydata];

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
        // mergedData[key].productsUnitCost += current.productsUnitCost || 0;
      }
    });

    setmergedDataArray(Object.values(mergedData));

    console.log("mergedDataArray===", mergedDataArray);

    if (mydata.length == 0) {
      setGetAllDailyRegisters({
        Open: false,
        ProductId: 0,
      });
      alert("There is no registered data on this date.");
    }
    let i = 0;
    let Description = "",
      brokenQty = 0,
      productsIdList = [],
      ProductId = "",
      purchaseQty = 0,
      // searched products will be here
      creditSalesQty = 0,
      productName = "",
      salesQty = 0,
      registrationDate = "",
      dailySalesId = "",
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
      if (creditPaymentDate == undefined || creditPaymentDate == "null")
        creditPaymentDate = "";
      if (creditDueDate == null || creditDueDate == undefined)
        creditDueDate = "";
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
      dailySalesId = mydata[i].dailySalesId;
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

    setAllDailySales(dailySales);
    setproductDetailes(mydata);
    setDailyTransaction(mydata);
  };
  let deleteDailyTransaction = (items) => {
    items.token = token;
    axios
      .delete(serverAddress + "deleteDailyTransaction", {
        headers: {
          Authorization: token,
        },
        data: {
          source: items,
        },
      })
      .then((Responces) => {
        console.log(Responces.data);
        let { data } = Responces.data;
        if (data == "success") {
          alert("you have deleted data successfully");
          getTotalRegisters(items.ProductId);
        } else {
          alert("unknown error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let editDailyTransaction = (e) => {
    e.preventDefault();
    formInputValues.token = token;
    console.log("formInputValues", formInputValues);
    // return;
    axios
      .put(serverAddress + "updateDailyTransactions", {
        items: formInputValues,
      })
      .then((Responces) => {
        console.log(Responces.data);
        let { data } = Responces.data;
        if (data == "update successfully") {
          setEditSingleItem((prevstate) => {
            return { ...prevstate, open: false };
          });
          alert("Thankyou. " + data);
          getTotalRegisters(formInputValues.ProductId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let handleSalesTransactionInput = (e, ProductId) => {
    console.log(e.target.value);
    setFormInputValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        ProductId,
      };
    });
  };
  console.log("RandValue", RandValue);
  useEffect(() => {
    setDailyTransaction([]);
    getTotalRegisters(ProductId);
    // getTotalRegisters(ProductId);
  }, [RandValue, ProductId]);
  ////////// *** **** *** **** *** *** ////////////////////

  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setdeviceSize(window.innerWidth);
  });
  let { TransactionData, setTransactionData } = ConsumeableContext();
  useEffect(() => {
    DailyTransaction.map((items) => {
      setTransactionData((prev) => {
        console.log("prev", prev);
        return {
          ...prev,
          TotalSales:
            Number(prev.TotalSales) +
            Number(items.salesQty + items.creditsalesQty) *
              Number(items.unitPrice),
          TotalPurchase:
            Number(prev.TotalPurchase) +
            Number(items.purchaseQty) *
              Number(JSON.parse(items.itemDetailInfo).productsUnitCost),
        };
      });
    });
  }, [DailyTransaction]);
  const [downloadExcel, setDownloadExcel] = useState(false);
  const [viewEachTransactions, setviewEachTransactions] = useState(true);

  const [viewableData, setviewableData] = useState([]);
  useEffect(() => {
    setviewableData(viewEachTransactions ? DailyTransaction : mergedDataArray);
  }, [viewEachTransactions, DailyTransaction, mergedDataArray]);
  const [ExpandView, setExpandView] = useState(false);
  return (
    <Paper style={{ padding: "20px", margin: "30px auto" }}>
      <Box
        sx={{
          // borderBottom: "1px solid black",

          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
        onClick={() => {
          setExpandView(!ExpandView);
        }}
      >
        <Typography>Transaction Table </Typography>
        <span>{ExpandView ? <ExpandMore /> : <ExpandLess />}</span>
      </Box>
      {!ExpandView && (
        <div>
          <br />
          <div>
            Total Sales :- {CurrencyFormatter(TransactionData.TotalSales)}
          </div>
          <div>
            Total Cost:- {CurrencyFormatter(TransactionData.TotalPurchase)}
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
                onChange={() => setviewEachTransactions(!viewEachTransactions)}
                checked={viewEachTransactions}
              />{" "}
              View Each Transaction
              {/* opop opopo po popo po pop po popo po popop p opopo pop o po opop */}
              {deviceSize < 768 ? (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {viewableData?.map((items, index) => {
                    console.log(items.itemDetailInfo);

                    return (
                      <Paper
                        style={{
                          padding: "20px",
                          margin: "10px",
                          width: "300px",
                        }}
                        key={"detailes_" + index}
                      >
                        <div>
                          <strong>Product Name: </strong>
                          {items.itemDetailInfo
                            ? JSON.parse(items.itemDetailInfo).productName
                            : ""}
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
                          <span>
                            {CurrencyFormatter(
                              JSON.parse(items.itemDetailInfo).productsUnitCost
                            )}
                          </span>
                        </div>
                        <div>
                          <strong>Total Cost:- </strong>
                          <span>
                            {CurrencyFormatter(
                              items.purchaseQty *
                                JSON.parse(items.itemDetailInfo)
                                  .productsUnitCost
                            )}
                          </span>
                        </div>
                        <div>
                          <strong>Sales QTY: </strong>
                          {items.salesQty}
                        </div>
                        <div>
                          <strong>Sales QTY Credit: </strong>
                          {items.creditsalesQty}
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
                          <strong>Registration Date: </strong>
                          {DateFormatter(items.registeredTimeDaily)}
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
                          {" "}
                          <strong>Broken QTY: </strong>
                          {items.brokenQty}{" "}
                        </div>
                        <div>
                          <strong>Description: </strong> {items.Description}
                        </div>
                        <div>
                          <strong>Actions: </strong>
                          {openedBusiness !== "employersBusiness" ? (
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
                                  setFormInputValues(items);
                                  setEditSingleItem((previousState) => {
                                    return {
                                      ...previousState,
                                      open: true,
                                      Items: items,
                                    };
                                  });
                                }}
                              >
                                <EditIcon color="info" />
                              </IconButton>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </Paper>
                    );
                  })}
                </div>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: "rgba(50,256,100,0.5)" }}>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Registered by</TableCell>
                        <TableCell>Purchase Qty </TableCell>
                        <TableCell>Unit Cost </TableCell>
                        <TableCell>Purchase in cash </TableCell>
                        <TableCell>Sales Qty In Cash</TableCell>
                        <TableCell>Sales Qty Credit</TableCell>
                        <TableCell>unit Price</TableCell>
                        <TableCell>Sales in cash</TableCell>
                        <TableCell>Sales Date</TableCell>
                        <TableCell>Credit Payment Date</TableCell>
                        <TableCell> Sales Type</TableCell>
                        <TableCell> Inventory</TableCell>
                        <TableCell>Broken Qty</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell> Update / Delete </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log("@DailyTransaction", DailyTransaction)}
                      {viewableData?.map((items, index) => {
                        console.log(items.itemDetailInfo);

                        return (
                          <TableRow key={"detailes_" + index}>
                            <TableCell>
                              {items.itemDetailInfo
                                ? JSON.parse(items.itemDetailInfo).productName
                                : ""}
                            </TableCell>
                            <TableCell>{items.employeeName}</TableCell>
                            <TableCell>{items.purchaseQty}</TableCell>
                            <TableCell>
                              {CurrencyFormatter(
                                JSON.parse(items.itemDetailInfo)
                                  .productsUnitCost
                              )}
                            </TableCell>
                            <TableCell>
                              {CurrencyFormatter(
                                items.purchaseQty *
                                  JSON.parse(items.itemDetailInfo)
                                    .productsUnitCost
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
                              {DateFormatter(items.registeredTimeDaily)}
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
                              {openedBusiness !== "employersBusiness" ? (
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
                                      setFormInputValues(items);
                                      setEditSingleItem((previousState) => {
                                        return {
                                          ...previousState,
                                          open: true,
                                          Items: items,
                                        };
                                      });
                                    }}
                                  >
                                    <EditIcon color="info" />
                                  </IconButton>
                                </>
                              ) : (
                                ""
                              )}
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
                {!Proccess ? (
                  <div style={{ width: "600px", margin: "auto" }}>
                    <ExportToExcel
                      data={DailyTransaction}
                      target="dailySales"
                    />
                  </div>
                ) : (
                  <ButtonProcessing />
                )}
              </Box>
            </div>
          )}
          <Modal
            open={EditSingleItem.open}
            onClose={() => {
              setEditSingleItem((prev) => {
                return { ...prev, open: false };
              });
            }}
          >
            {/* {console.log("formInputValues", formInputValues)} */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h2">
                  Edit Item {EditSingleItem.Items.productName}
                </Typography>
                <IconButton
                  onClick={() =>
                    setEditSingleItem((prev) => {
                      return { ...prev, open: false };
                    })
                  }
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" component="p">
                <form
                  className={singleSalesCss.singleTransactionForm}
                  onSubmit={(e) => editDailyTransaction(e)}
                >
                  <TextField
                    fullWidth
                    type="number"
                    required
                    value={formInputValues.purchaseQty}
                    className={"dailyRegistrationInputs"}
                    onInput={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    name="purchaseQty"
                    label="purchase quantity"
                  />
                  <br />
                  <TextField
                    fullWidth
                    type="number"
                    required
                    className={"dailyRegistrationInputs"}
                    onInput={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    name={
                      formInputValues.salesTypeValues == "On credit" ||
                      formInputValues.salesTypeValues == "credit paied"
                        ? "creditsalesQty"
                        : "salesQty"
                    }
                    label="Sales quantity"
                    value={
                      formInputValues.salesTypeValues == "On credit" ||
                      formInputValues.salesTypeValues == "credit paied"
                        ? formInputValues.creditsalesQty
                        : formInputValues.salesQty
                    }
                  />
                  {console.log(
                    "formInputValues.salesType",
                    formInputValues.salesType
                  )}
                  <br />
                  <TextField
                    fullWidth
                    required
                    type="number"
                    className={"dailyRegistrationInputs"}
                    onInput={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    name="brokenQty"
                    label="Broken quantity"
                    value={formInputValues.brokenQty}
                  />

                  <br />
                  <label>payment type</label>
                  {console.log(
                    "inselect formInputValues",
                    formInputValues.salesTypeValues
                  )}
                  <Select
                    value={formInputValues.salesTypeValues}
                    name="salesTypeValues"
                    onChange={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    sx={{ margin: "20px auto" }}
                    fullWidth
                    required
                  >
                    <MenuItem value={"On cash"}>On cash</MenuItem>
                    <MenuItem value={"By bank"}>By bank</MenuItem>
                    <MenuItem value={"On credit"}>On credit</MenuItem>
                    <MenuItem value={"credit paied"}>credit paied</MenuItem>
                  </Select>
                  {console.log(
                    "formInputValues.salesTypeValues" +
                      formInputValues.salesTypeValues
                  )}
                  {formInputValues.salesTypeValues == "On credit" && (
                    <Box>
                      <lab>Payment date</lab>
                      <TextField
                        id=""
                        onChange={(e) =>
                          handleSalesTransactionInput(
                            e,
                            EditSingleItem.Items.ProductId
                          )
                        }
                        value={DateFormatter(formInputValues.creditPaymentDate)}
                        name="creditPaymentDate"
                        className=""
                        required
                        fullWidth
                        type="date"
                      />
                      <br /> <br />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    required
                    className={"dailyRegistrationInputs"}
                    onInput={(e) =>
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      )
                    }
                    value={formInputValues.Description}
                    name="Description"
                    label="Description"
                  />
                  <br />
                  <Box>
                    <Button color="primary" variant="contained" type="submit">
                      UPDATE
                    </Button>
                    &nbsp; &nbsp; &nbsp;
                    <Button
                      onClick={() =>
                        setEditSingleItem((prevstate) => {
                          return { ...prevstate, open: false };
                        })
                      }
                      color="warning"
                      variant="contained"
                      type="submit"
                    >
                      CANCEL
                    </Button>
                  </Box>
                </form>
              </Typography>
            </Box>
          </Modal>
          <Dialog
            open={ShowDeleteConfirmationModal.open}
            onClose={() => {
              setShowDeleteConfirmationModal({ open: false, Items: {} });
            }}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this item?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  setShowDeleteConfirmationModal({ open: false, Items: {} })
                }
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteConfirmationModal({ open: false, Items: {} });
                  deleteDailyTransaction(ShowDeleteConfirmationModal.Items);
                }}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Paper>
  );
}

export default GetEachTransaction;
