import axios from "axios";
import React, { useEffect, useState } from "react";
import singleSalesCss from "./AddSingleSales.module.css";
import CloseIcon from "@material-ui/icons/Close";
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { ConsumeableContext } from "../UserContext/UserContext";
import { ButtonProcessing } from "../../utility/Utility";
import AddSingleSales_GetItems from "./AddSingleSales_GetItems";
import GetEachTransaction from "./GetEachTransaction";

function AddSingleSales() {
  // setShowHiddenProducts;
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
  });
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");

  let token = localStorage.getItem("storeToken");
  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: false,
  });
  const [tabValue, setTabValue] = useState(0);
  const handleClose = () => {
    steRegisterableItems({
      items: {},
      Open: false,
    });
  };
  const [showHiddenProducts, setShowHiddenProducts] = useState(false);
  // is used to store daily sales
  const [DailyTransaction, setDailyTransaction] = useState([]);
  let serverAddress = localStorage.getItem("targetUrl");
  const [productDetailes, setproductDetailes] = useState([]);
  const {
    singleSalesInputValues,
    setSinlgeSalesInputValues,
    Proccessing,
    setProccessing,
  } = ConsumeableContext();
  // formInputValues is uesd to tollect data of form to update and registere

  const [formInputValues, setformInputValues] = useState({
    salesType: "Default",
  });
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});
  // get single products
  {
    /*submit search starts here*/
  }
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    setproductDetailes([]);
    setSearchedProducts([]);
    setDailyTransaction([]);
    // return;
    setProccessing(true);
    let responce = await axios.post(serverAddress + "getsingleProducts/", {
      ...singleSalesInputValues,
      token,
      businessId: localStorage.getItem("businessId"),
      businessName: localStorage.getItem("businessName"),
    });
    setProccessing(false);
    if (responce.data.data.length == 0) alert("No products found here ");
    else setSearchedProducts(responce.data.data);
  };
  // submit search ends here
  let handleSalesTransactionInput = (e, ProductId) => {
    console.log(e.target.value);
    setformInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
      ProductId,
    });
  };
  const [singleSalesError, setsingleSalesError] = useState({});
  // collect input values of search form
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [event.target.name]: event.target.value,
    });
  };
  //
  let registerSinglesalesTransaction = async (e, items) => {
    e.preventDefault();
    let { brokenQty, salesType } = formInputValues;
    console.log(
      "formInputValues",
      formInputValues,
      " items",
      items,
      "brokenQty",
      brokenQty
    );

    if (salesType == "Default") {
      setsingleSalesError((reviousErrors) => ({
        ...reviousErrors,
        salesType: "Sales type values has to be selected",
      }));
      return;
    }
    // Default;
    console.log("formInputValues", formInputValues);
    // return;
    setProccessing(true);
    let responce = await axios.post(
      serverAddress + "registerSinglesalesTransaction/",
      {
        // registerTransaction
        items,
        ...formInputValues,
        businessId: localStorage.getItem("businessId"),
        currentDate: "",
      }
    );
    setformInputValues({ salesType: "Default" }); // Reset the form values to default
    setProccessing(false);
    ////////////////
    console.log(responce.data.data);
    /////////////////
    if (responce.data.data == "successfullyRegistered") {
      alert("Successfully Registered");
    }
  };

  let getTotalRegiters = async (targetproductId) => {
    console.log("targetproductId", targetproductId);
    // setSearchedProducts([]);
    let OB = {
      currentDates: "",
      businessId,
      productId: targetproductId,
      businessName,
      token,
    };
    console.log("OB", OB);
    // return;
    setSearchedProducts([]);
    let responce = await axios.post(serverAddress + "getDailyTransaction/", {
      ...OB,
    });
    let mydata = responce.data.data;
    // console.log("getDailyTransaction== ", responce.data);

    if (mydata.length == 0) {
      alert("There is no registered data on this date.");
    }
    let i = 0;
    let Description = "",
      brokenQty = 0,
      productsIdList = [],
      ProductId = "",
      dailySalesId = "",
      purchaseQty = 0,
      // searched products will be here
      creditSalesQty = 0,
      registrationDate = "",
      productName = "",
      salesQty = 0;
    let prevProductId = 0,
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
      console.log(
        "ProductId",
        ProductId,
        "i",
        i,
        "Description",
        Description,
        "brokenQty",
        brokenQty,
        "purchaseQty",
        purchaseQty,
        "salesQty",
        salesQty,
        "creditSalesQty",
        creditSalesQty,
        "salesTypeValues",
        salesTypeValues,
        "creditPaymentDate",
        creditPaymentDate
      );
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
    // To make collections on multiple single item sales
    // console.log("dailySales", dailySales);
    console.log("mydata", mydata);
    // return;
    setAllDailySales(dailySales);
    setproductDetailes(mydata);
    setDailyTransaction(mydata);
  };
  ///////////////////////////////
  let RegiterCollectedDailyTransaction = async (e) => {
    e.preventDefault();
    setProccessing(true);
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
      dates: "",
    };
    console.log("ProductsInfo == ", productsInfo);
    // return;
    let Response = await axios.post(
      serverAddress + "registerTransaction/",
      productsInfo
    );
    setProccessing(false);
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
  /////////////////////////////////

  useEffect(() => {
    setGetAllDailyRegisters({
      Open: false,
    });
  }, [singleSalesInputValues]);

  const [EditSingleItem, setEditSingleItem] = useState({
    open: false,
    Items: {},
  });
  const [ShowDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState({
      open: false,
      Items: {},
    });

  let updateUnreportedData = async () => {
    let Results = await axios.put(
      serverAddress + "updateUnreportedDataAsReported",
      { token }
    );
    console.log(Results.data);
  };
  let handleTabChanges = (event, newTab) => {
    setGetAllDailyRegisters({ Open: false });
    setSearchedProducts([]);
    setDailyTransaction([]);
    setTabValue(newTab);
  };
  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      <Tabs
        value={tabValue}
        onChange={(event, newTab) => {
          setSinlgeSalesInputValues({});
          handleTabChanges(event, newTab);
        }}
      >
        <Tab label="Products" value={0} />
        <Tab label="Search" value={1} />
        <Tab label="View daily" value={2} />
      </Tabs>
      {tabValue == 0 && (
        <>
          <AddSingleSales_GetItems />
        </>
      )}
      {tabValue == 1 && (
        <form
          className={singleSalesCss.formToSearchItems}
          form
          onSubmit={(e) => {
            handleSearchSubmit(e);
          }}
        >
          <label
            style={{
              textAlign: "center",
              paddingLeft: "100px",
              width: "fit-content ",
            }}
          >
            Select Date
          </label>
          <br />
          <TextField
            onChange={handleSearchableProductInput}
            value={singleSalesInputValues.singleSalesDate}
            required
            fullWidth
            name="singleSalesDate"
            id="singleSalesDate"
            type="date"
          />
          <br />

          <TextField
            required
            name="searchInput"
            value={singleSalesInputValues.searchInput}
            onChange={handleSearchableProductInput}
            label="Type Product Name"
            className=""
            type={"search"}
            id="searchInputToSingleProducts"
          />
          <br />
          {!Proccessing ? (
            <Button
              id="btnsearchSingleProduct"
              fullWidth
              type="submit"
              variant="contained"
            >
              Search
            </Button>
          ) : (
            <ButtonProcessing />
          )}
          <br />
        </form>
      )}
      {tabValue == 2 && (
        <>
          <form
            style={{ maxWidth: "300px", padding: "2px 20px" }}
            onSubmit={(e) => {
              e.preventDefault();
              setGetAllDailyRegisters({
                Open: true,
                ProductId: "getAllTransaction",
              });
              // getTotalRegiters("getAllTransaction");
            }}
          >
            <label
              style={{
                textAlign: "center",
                paddingLeft: "100px",
                width: "fit-content ",
                marginTop: "30px",
              }}
            >
              Select Date
            </label>
            <br />
            <TextField
              onChange={handleSearchableProductInput}
              value={singleSalesInputValues.singleSalesDate}
              required
              fullWidth
              name="singleSalesDate"
              id="singleSalesDate"
              type="date"
            />
            {!Proccessing ? (
              <Button
                fullWidth
                sx={{ marginTop: "10px" }}
                variant="contained"
                type="submit"
              >
                View
              </Button>
            ) : (
              <ButtonProcessing />
            )}
          </form>
        </>
      )}
      {searchedProducts.length > 0 && (
        <TableContainer className={singleSalesCss.TableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Register</TableCell>
                <TableCell>Get</TableCell>
              </TableRow>
            </TableHead>

            {searchedProducts?.map((items) => {
              return (
                <TableBody key={items.ProductId}>
                  <TableRow>
                    <TableCell>{items.productName}</TableCell>
                    <TableCell>
                      <Button
                        className={
                          "class_" +
                          items.ProductId +
                          " " +
                          singleSalesCss.getProducts
                        }
                        onClick={() => {
                          steRegisterableItems({ items: items, Open: true });
                        }}
                      >
                        Register
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setGetAllDailyRegisters({
                            Open: true,
                            ProductId: items.ProductId,
                          });
                        }}
                        className={singleSalesCss.getProducts}
                      >
                        view
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>
      )}
      {console.log("formInputValues", formInputValues)}
      <Modal open={RegisterableItems.Open} onClose={handleClose}>
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
              Single registration to {RegisterableItems.items.productName}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" component="p">
            <form
              className={singleSalesCss.singleTransactionForm}
              onSubmit={(e) => {
                registerSinglesalesTransaction(e, RegisterableItems.items);
              }}
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
                    RegisterableItems.items.ProductId
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
                    RegisterableItems.items.ProductId
                  )
                }
                name="salesQty"
                label="Sales quantity"
                value={formInputValues.salesQty}
              />
              <br />
              <TextField
                required
                fullWidth
                type="number"
                className={"dailyRegistrationInputs"}
                onInput={(e) =>
                  handleSalesTransactionInput(
                    e,
                    RegisterableItems.items.ProductId
                  )
                }
                name="brokenQty"
                label="Broken quantity"
                value={formInputValues.brokenQty}
              />
              <br />

              <label>payment type</label>
              {console.log(
                "formInputValues.salesType",
                formInputValues.salesType
              )}
              <Select
                value={formInputValues.salesType}
                name="salesType"
                onChange={(e) => {
                  setsingleSalesError({});
                  handleSalesTransactionInput(
                    e,
                    RegisterableItems.items.ProductId
                  );
                }}
                sx={{ margin: "20px auto" }}
                fullWidth
                required
              >
                <MenuItem defaultValue={"Default"}>Choose values </MenuItem>
                <MenuItem value={"On cash"}>On cash</MenuItem>
                <MenuItem value={"By bank"}>By bank</MenuItem>
                <MenuItem value={"On credit"}>On credit</MenuItem>
                {/* <MenuItem value={"On credit"}>On credit</MenuItem> */}
              </Select>
              <Box sx={{ color: "red", marginBottom: "20px" }}>
                {" "}
                {singleSalesError.salesType}
              </Box>
              {formInputValues.salesType == "On credit" && (
                <Box sx={{ width: "100%" }}>
                  <label>Payment date</label>
                  <TextField
                    id=""
                    onChange={(e) =>
                      handleSalesTransactionInput(
                        e,
                        RegisterableItems.items.ProductId
                      )
                    }
                    value={formInputValues.creditPaymentDate}
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
                    RegisterableItems.items.ProductId
                  )
                }
                value={formInputValues.Description}
                name="Description"
                label="Description"
              />
              <br />
              <Box>
                {!Proccessing ? (
                  <Button color="primary" variant="contained" type="submit">
                    ADD
                  </Button>
                ) : (
                  <Button disabled variant="contained">
                    Proccessing...
                  </Button>
                )}
                &nbsp; &nbsp; &nbsp;
                <Button
                  onClick={(e) => {
                    steRegisterableItems((prevItems) => {
                      return {
                        ...prevItems,
                        Open: false,
                      };
                    });
                    setProccessing(false);
                    setShowHiddenProducts(false);
                  }}
                  color="warning"
                  variant="contained"
                >
                  CANCEL
                </Button>
              </Box>
            </form>
          </Typography>
        </Box>
      </Modal>
      {getAllDailyRegisters.Open && (
        <GetEachTransaction
          setGetAllDailyRegisters={setGetAllDailyRegisters}
          currentDay={singleSalesInputValues.singleSalesDate}
          ProductId={getAllDailyRegisters.ProductId}
          searchInput={singleSalesInputValues.searchInput}
        />
      )}
    </div>
  );
}
export default AddSingleSales;
