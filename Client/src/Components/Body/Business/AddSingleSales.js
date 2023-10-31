import axios from "axios";
import React, { useEffect, useState } from "react";
import singleSalesCss from "./AddSingleSales.module.css";
import $ from "jquery";
import currentDates, { DateFormatter } from "../Date/currentDate";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function AddSingleSales() {
  // setShowHiddenProducts;
  const [Proccess, setProccess] = useState(false);

  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: false,
  });

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
  const [inputValues, setInputValues] = useState({});
  // formInputValues is uesd to tollect data of form to update and registere
  const [formInputValues, setformInputValues] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [allDailySales, setAllDailySales] = useState({});
  // get single products
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    // clear all detailes of product
    setproductDetailes([]);
    $(".LinearProgress").css("display", "block");
    let singleSalesDate = $("#singleSalesDate").val();
    let responce = await axios.post(serverAddress + "getsingleProducts/", {
      ...singleSalesDate,
      ...inputValues,
      ...{ BusinessId: localStorage.getItem("businessId") },
      ...{ businessName: localStorage.getItem("businessName") },
    });
    console.log("@getsingleProducts responce");
    console.log(responce.data.data);
    if (responce.data.data.length == 0) alert("No products found here ");
    else setSearchedProducts(responce.data.data);
    $(".LinearProgress").hide();
  };
  let handleSalesTransactionInput = (e, ProductId) => {
    console.log(e.target.value);
    setformInputValues({
      ...formInputValues,
      [e.target.name]: e.target.value,
      ProductId,
    });
  };
  // collect input values of search form
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };
  let registerSinglesalesTransaction = async (e, items) => {
    e.preventDefault();
    console.log("formInputValues", formInputValues, " items", items);
    // return;
    setProccess(true);
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(
      serverAddress + "registerSinglesalesTransaction/",
      {
        // registerTransaction
        items,
        ...formInputValues,
        businessId: localStorage.getItem("businessId"),
        currentDate: $("#singleSalesDate").val(),
      }
    );
    setProccess(false);
    console.log(responce.data.data);
    if (responce.data.data == "successfullyRegistered") {
      alert("Successfully Registered");
      $(".dailyRegistrationInputs input").val("");
    }
    $(".LinearProgress").hide();
  };

  let getTotalRegiters = async (targetproductId) => {
    // clear datas of product detailes
    // console.log('$("#singleSalesDate").val()', $("#singleSalesDate").val());
    setSearchedProducts([]);
    let businessId = localStorage.getItem("businessId");
    let businessName = localStorage.getItem("businessName");
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "getDailyTransaction/", {
      currentDates: $("#singleSalesDate").val(),
      businessId,
      productId: targetproductId,
      businessName,
    });
    let mydata = responce.data.data;
    // console.log("getDailyTransaction== ", responce.data);

    if (mydata.length == 0) {
      alert("There is no registered data on this date.");
    }

    $(".LinearProgress").hide();
    let i = 0;
    let Description = "",
      brokenQty = 0,
      productsIdList = [],
      ProductId = "",
      dailySalesId = "",
      purchaseQty = 0,
      searchedProductsData = "",
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
      mydataLength = mydata.length;
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
      // console.log("productId is ", ProductId);
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

    setAllDailySales(dailySales);
    setproductDetailes(mydata);
    setDailyTransaction(mydata);
  };
  ///////////////////////////////
  let RegiterCollectedDailyTransaction = async (e) => {
    e.preventDefault();
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
      BusinessId: BusinessId,
      // it is only information of product and no need of repetation is nedded
      ProductsList,
      dates: $("#singleSalesDate").val(),
    };
    $(".LinearProgress").css("display", "block");
    console.log("ProductsInfo == ", productsInfo);
    // return;
    let Response = await axios.post(
      serverAddress + "registerTransaction/",
      productsInfo
    );
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
    $(".LinearProgress").hide();
  };
  /////////////////////////////////
  let token = localStorage.getItem("token");
  useEffect(() => {
    $("#singleSalesDate").val(currentDates());
    $(".LinearProgress").css("display", "none");
  }, []);
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
            getTotalRegiters(items.ProductId);
          } else {
            alert("unknown error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editDailyTransaction = (e) => {
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
            getTotalRegiters(formInputValues.ProductId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
  const [EditSingleItem, setEditSingleItem] = useState({
    open: false,
    Items: {},
  });
  const [ShowDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState({
      open: false,
      Items: {},
    });

  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      <form
        className={singleSalesCss.formToSearchItems}
        form
        onSubmit={handleSearchSubmit}
      >
        <label>Select Date</label>
        <br />
        <TextField name="singleSalesDate" id="singleSalesDate" type="date" />
        <br />
        <div style={{ display: "flex" }}>
          <TextField
            required
            name="searchInput"
            onInput={handleSearchableProductInput}
            label="Type Product Name"
            id=""
            className=""
            type={"search"}
          />

          <Button sx={{ marginLeft: "3px" }} type="submit" variant="contained">
            Search
          </Button>
        </div>
        <br />
        <Button
          variant="contained"
          color="success"
          onClick={() => getTotalRegiters("getAllTransaction")}
        >
          View All Daily Transactions
        </Button>
      </form>

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
                        onClick={() => getTotalRegiters(items.ProductId)}
                        className={singleSalesCss.getProducts}
                      >
                        Get
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>
      )}
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
                setformInputValues([]);
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
              <Select
                value={formInputValues.salesType}
                name="salesType"
                onChange={(e) =>
                  handleSalesTransactionInput(
                    e,
                    RegisterableItems.items.ProductId
                  )
                }
                sx={{ margin: "20px auto" }}
                fullWidth
                required
              >
                <MenuItem value={"On cash"}>On cash</MenuItem>
                <MenuItem value={"By bank"}>By bank</MenuItem>
                <MenuItem value={"On credit"}>On credit</MenuItem>
              </Select>
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
                {!Proccess ? (
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
                    setProccess(false);
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
      {DailyTransaction.length > 0 && (
        <div>
          <TableContainer
            style={{
              maxWidth: "80vw",
              overflowX: "auto !important",
            }}
          >
            <Table sx={{ width: "fit-content" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Purchase Qty </TableCell>
                  <TableCell>Sales Qty</TableCell>
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
                        {JSON.parse(items.itemDetailInfo).productsUnitPrice}
                      </TableCell>
                      <TableCell>
                        {DateFormatter(items.registrationDate)}
                      </TableCell>
                      <TableCell>
                        {DateFormatter(items.creditPaymentDate)}
                      </TableCell>
                      <TableCell>{items.salesTypeValues}</TableCell>
                      {/* {(creditPaymentDate, creditsalesQty,)} */}
                      <TableCell> {items.brokenQty} </TableCell>
                      <TableCell> {items.Description}</TableCell>
                      <TableCell>
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
                            setformInputValues(items);
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
            <Button
              sx={{ margin: "auto" }}
              variant="contained"
              color="primary"
              className={singleSalesCss.btnAddTotalSales}
              onClick={RegiterCollectedDailyTransaction}
            >
              Add As Total Sales
            </Button>
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
                "formInputValues.salesTypeValues",
                formInputValues.salesTypeValues
              )}
              <br />
              <TextField
                fullWidth
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
              <label>payment type</label>
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
  );
}
export default AddSingleSales;
