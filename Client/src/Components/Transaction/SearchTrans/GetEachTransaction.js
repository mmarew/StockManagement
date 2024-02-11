import {
  Box,
  Button,
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
import singleSalesCss from "../AddTrans/AddSingleSales.module.css";
import React, { useEffect, useState } from "react";
import currentDates, { DateFormatter } from "../../Body/Date/currentDate";
import CurrencyFormatter, { ButtonProcessing } from "../../Utilities/Utility";
import CloseIcon from "@material-ui/icons/Close";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { Checkbox, Paper } from "@mui/material";
import ExportToExcel from "../../PDF_EXCEL/PDF_EXCEL";

import { ExpandMore, ExpandLess } from "@mui/icons-material";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import ModalTodeleteEachTransaction from "./ModalTodeleteEachTransaction";

function GetEachTransaction({
  RandValue,
  ProductId,
  searchInput,
  currentDay,
  setGetAllDailyRegisters,
  fromDate,
  toDate,
  // ErrorsProps,
}) {
  const [Errors, setErrors] = useState("");
  let token = localStorage.getItem("storeToken");
  let openedBusiness = localStorage.getItem("openedBusiness");
  let { setShowProgressBar, setProccessing } = ConsumeableContext();
  // use state starts here
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
    try {
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
      setTransactionData((prev) => ({ TotalSales: 0, TotalPurchase: 0 }));
      let responce = await axios.post(
        serverAddress + "Transaction/getDailyTransaction/",
        {
          ...OB,
        }
      );
      setShowProgressBar(false);
      setProccessing(false);
      let mydata = responce.data.data;
      console.log("mydata", mydata);
      // return;
      if (mydata == "Error") {
        setErrors(responce.data.Error);
        return;
      }
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
        setErrors("There is no registered data on this date.");
        setTimeout(() => {
          setGetAllDailyRegisters({
            Open: false,
            ProductId: 0,
          });
        }, 3000);
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
    } catch (error) {
      setShowProgressBar(false);
      setProccessing(false);
      setErrors(error.message);
    }
  };

  const editDailyTransaction = async (e) => {
    e.preventDefault();

    try {
      formInputValues.token = token;
      console.log("formInputValues", formInputValues);
      // return;

      const response = await axios.put(
        serverAddress + "Transaction/updateDailyTransactions",
        {
          ...formInputValues,
        }
      );

      const { data } = response.data;

      if (data === "update successfully") {
        setEditSingleItem((prevstate) => ({ ...prevstate, open: false }));
        alert(`Thank you. ${data}`);
        await getTotalRegisters("getAllTransaction");
      }
    } catch (error) {
      console.error(error);
      setErrors(error.message);
    }
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
  }, [, RandValue, ProductId]);
  ////////// *** **** *** **** *** *** ////////////////////

  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setdeviceSize(window.innerWidth);
  });
  let { TransactionData, setTransactionData } = ConsumeableContext();
  useEffect(() => {
    console.log("==DailyTransaction", DailyTransaction);
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
            Number(items.purchaseQty) * Number(items.unitCost),
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
      {Errors && <SuccessOrError request={Errors} setErrors={setErrors} />}
      <Box
        sx={{
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
                              {console.log("items==", items)}
                              <IconButton
                                onClick={() => {
                                  setFormInputValues({
                                    ...items,
                                  });
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
                        <TableCell>Total Cost </TableCell>
                        <TableCell>Total Sales</TableCell>
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
            // onClose={() => {
            //   setEditSingleItem((prev) => {
            //     return { ...prev, open: false };
            //   });
            // }}
          >
            {/* {console.log("formInputValues", formInputValues)} */}
            <Box
              sx={{
                height: "90%",
                overflow: "scroll",
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
                    value={formInputValues.unitCost}
                    type="number"
                    className=""
                    label="Unit Cost"
                    name={"unitCost"}
                    onInput={(e) => {
                      handleSalesTransactionInput(
                        e,
                        EditSingleItem.Items.ProductId
                      );
                    }}
                  />
                  <br />
                  <div>
                    {" "}
                    Total Cost{" "}
                    {CurrencyFormatter(
                      formInputValues.purchaseQty * formInputValues.unitCost
                    )}
                  </div>
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
                  <br /> <br />
                  <TextField
                    value={formInputValues.unitPrice}
                    name="unitPrice"
                    fullWidth
                    required
                    type="number"
                    label="Unit price"
                  />{" "}
                  <br />
                  Total Sales={" "}
                  {CurrencyFormatter(
                    (Number(formInputValues.creditsalesQty) +
                      Number(formInputValues.salesQty)) *
                      Number(formInputValues.unitPrice)
                  )}
                  <br />
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
          {/* modal to delete items */}
          {ShowDeleteConfirmationModal.open && (
            <ModalTodeleteEachTransaction
              getTotalRegisters={getTotalRegisters}
              setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
              ShowDeleteConfirmationModal={ShowDeleteConfirmationModal}
            />
          )}
        </div>
      )}
    </Paper>
  );
}

export default GetEachTransaction;
