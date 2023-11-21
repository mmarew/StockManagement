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
import { ButtonProcessing } from "../../utility/Utility";
import CloseIcon from "@material-ui/icons/Close";
import { ConsumeableContext } from "../UserContext/UserContext";
function GetEachTransaction({
  RandValue,
  ProductId,
  searchInput,
  currentDay,
  setGetAllDailyRegisters,
}) {
  let openedBusiness = localStorage.getItem("openedBusiness");
  let { setShowProgressBar, setProccessing } = ConsumeableContext();
  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
  });
  console.log(
    "ProductId = ",
    ProductId,
    "searchInput = ",
    searchInput,
    " currentDay = ",
    currentDay
  );
  // return;
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
  let token = localStorage.getItem("storeToken");
  let Today = currentDates();
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});

  const [DailyTransaction, setDailyTransaction] = useState([]);

  /**getTotalRegisters start here */

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
    console.log("getDailyTransaction== ", responce.data);
    // return;
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
      // console.log("productDetail = ", productDetail);
      prevProductId = ProductId;
    }
    console.log("mydata", mydata);
    setAllDailySales(dailySales);
    setproductDetailes(mydata);
    setDailyTransaction(mydata);
  };
  let deleteDailyTransaction = (items) => {
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
    console.log("formInputValues", formInputValues);

    axios
      .put(serverAddress + "editDailyTransaction", { items: formInputValues })
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
  useEffect(() => {
    setDailyTransaction([]);
    getTotalRegisters(ProductId);
    // getTotalRegisters(ProductId);
  }, [RandValue, ProductId]);
  let RegiterCollectedDailyTransaction = async (e) => {
    e.preventDefault();
    setProccess(true);
    // return;
    let serverAddress = localStorage.getItem("targetUrl"),
      businessName = localStorage.getItem("businessName"),
      BusinessId = localStorage.getItem("businessId"),
      ProductsList = [];
    // Filter each products list to register in db. DailyTransaction is a collection of many transaction. so one product may be sold many times but to make registration we need it only once and that is why we make filteration to this product
    DailyTransaction.map((item) => {
      let existsInProductsList = false;
      // to check existance of item in ProductsList
      ProductsList.map((products) => {
        // Check existance of item in ProductsList and if exist please change existsInProductsList to true
        if (products.ProductId == item.ProductId) {
          existsInProductsList = true;
        }
      });
      // if not exist in ProductsList add to ProductsList
      if (existsInProductsList == false) {
        ProductsList.push(item);
      }
    });

    let productsInfo = {
      ...allDailySales,
      businessName: businessName,
      businessId: BusinessId,
      token,
      // it is only information of product and no need of repetation is nedded
      ProductsList,
      dates: currentDay ? currentDay : Today,
    };
    // $(".LinearProgress").css("display", "block");
    console.log("ProductsInfo == ", productsInfo);
    // return;
    let Response = await axios.post(
      serverAddress + "registerTransaction/",
      productsInfo
    );
    setProccess(false);
    // console.log("Response", Response);
    let datas = Response.data.data;
    console.log("Response.data.data,", Response.data);
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      alert("successfully registered. Thank you.");
    } else if (datas == "allDataAreRegisteredBefore") {
      alert(
        "These datas are registered before. so please remove registered datas first"
      );
    } else {
      alert("unkown error");
    }
  };
  return (
    <>
      {DailyTransaction.length > 0 && (
        <div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Purchase Qty </TableCell>
                  <TableCell>Sales Qty In Cash</TableCell>
                  <TableCell>Sales Qty Credit</TableCell>
                  <TableCell>unit Price</TableCell>
                  <TableCell>Sales Date</TableCell>
                  <TableCell>Credit Payment Date</TableCell>
                  <TableCell> Sales Type</TableCell>
                  <TableCell>Broken Qty</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell> Update / Delete </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DailyTransaction?.map((items, index) => {
                  console.log(items.itemDetailInfo);

                  return (
                    <TableRow key={"detailes_" + index}>
                      <TableCell>
                        {items.itemDetailInfo
                          ? JSON.parse(items.itemDetailInfo).productName
                          : ""}
                      </TableCell>
                      <TableCell>{items.purchaseQty}</TableCell>
                      <TableCell>{items.salesQty}</TableCell>
                      <TableCell>{items.creditsalesQty}</TableCell>
                      <TableCell>
                        {JSON.parse(items.itemDetailInfo)?.productsUnitPrice}
                      </TableCell>
                      <TableCell>
                        {DateFormatter(items.registeredTimeDaily)}
                      </TableCell>
                      <TableCell>
                        {DateFormatter(items.creditPaymentDate)}
                      </TableCell>
                      <TableCell>{items.salesTypeValues}</TableCell>
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {!Proccess ? (
              <Button
                variant="contained"
                color="primary"
                className={singleSalesCss.btnAddTotalSales}
                onClick={RegiterCollectedDailyTransaction}
              >
                Generate Reports
              </Button>
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
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
                <Box sx={{ width: "100%" }}>
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
                  handleSalesTransactionInput(e, EditSingleItem.Items.ProductId)
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
    </>
  );
}

export default GetEachTransaction;
