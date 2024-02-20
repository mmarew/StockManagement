import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../../../Components/Body/Date/currentDate";
import CloseIcon from "@mui/icons-material/Close";

import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Select, MenuItem } from "@mui/material";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import AddTotalSalesCss from "../../../CSS/AddTotalSales.module.css";
import { useNavigate } from "react-router-dom";
import { ButtonProcessing } from "../../../Components/Utilities/Utility";
function AddTotalSales({ Time }) {
  let navigate = useNavigate();
  const [Processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [RegistrableProducts, setRegistrableProducts] = useState([{}]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [RegistrationModal, setRegistrationModal] = useState();
  let serverAddress = localStorage.getItem("targetUrl");
  const [ProductsList, setProductsList] = useState("Wait");
  const [CollectedProducts, setCollectedProducts] = useState({
    transactionDates: currentDates(),
  });
  // alert(currentDates());
  const [selectedTime, setselectedTime] = useState();
  let token = localStorage.getItem("storeToken");
  let BusinessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let collectFormData = (e) => {
    setCollectedProducts({
      ...CollectedProducts,
      [e.target.name]: e.target.value,
      ProductsList,
      businessName,
      BusinessId,
    });
  };
  let getRegisteredProducts = async () => {
    let Response = await axios.post(serverAddress + "getRegisteredProducts/", {
      token,
      BusinessId,
      businessName,
    });
    console.log("@getRegisteredProducts Response.data.data");
    console.log(Response.data.data);
    setProductsList(Response.data.data);
  };
  let sendFormDataToServer = async (e, ProductId) => {
    e.preventDefault();
    setProcessing(true);
    console.log("ProductId", ProductId);
    let dates = CollectedProducts.dates;
    CollectedProducts.ProductId = ProductId;
    if (dates == undefined) {
      alert("Date is not selected");
      return;
    }
    let copy = [];
    CollectedProducts.ProductsList.map((items) => {
      if (ProductId == items.ProductId) copy.push(items);
    });

    let copyOfCollection = { ...CollectedProducts };
    copyOfCollection.ProductsList = copy;

    let salesTypeValues = copyOfCollection["salesTypeValues" + ProductId];
    // If Sales is on credit, salesQuantity must be 0 and creditSalesQty must take value of  salesQuantity it is done in the following code
    if (salesTypeValues == "On credit") {
      copyOfCollection["creditSalesQty" + ProductId] =
        copyOfCollection["salesQuantity" + ProductId];
      copyOfCollection["salesQuantity" + ProductId] = 0;
    }
    // registrationSource
    copyOfCollection["registrationSource" + ProductId] = "Total";
    console.log("copyOfCollection", copyOfCollection);
    // return;
    copyOfCollection.token = token;
    copyOfCollection.businessId = BusinessId;
    let response = await axios.post(
      serverAddress + "registerTransaction/",
      copyOfCollection
    );
    // setProcessing(false);
    setProcessing(false);
    // salesTypeValues;
    let datas = response.data.data;
    console.log(datas, "response is = ", response);
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered, because on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      if (response.data.previouslyRegisteredData.length > 0) {
        alert(
          "some of your data is not registered but some of your data are registered well. so if u want to change saved datas please  try to search and make update on those data which are not registered now. "
        );
        return;
      }
      alert("successfully registered. Thank you.");
      setOpen(false);
    } else if (datas == "allDataAreRegisteredBefore") {
      alert(
        "These data are not registered now. Because these are registered before. Thank you. "
      );
    }
  };
  useEffect(() => {
    setCollectedProducts({ ...CollectedProducts, dates: selectedTime });
  }, [selectedTime]);
  useEffect(() => {
    let CDATE = currentDates();
    console.log("CDATE", CDATE);
  }, [ProductsList]);

  useEffect(() => {
    let CDATE = currentDates();
    getRegisteredProducts();
    setCollectedProducts({
      ...CollectedProducts,
      dates: CDATE,
    });
  }, []);
  return (
    <div className={AddTotalSalesCss.addTotalSalesWrapper}>
      {console.log(CollectedProducts)}
      {console.log("ProductsList", ProductsList)}
      {ProductsList !== "Wait" ? (
        ProductsList?.length > 0 ? (
          <>
            <div className={AddTotalSalesCss.itemsTobesold}>
              {ProductsList?.map((item) => {
                return (
                  <div className={AddTotalSalesCss.eachItem}>
                    <p style={{ textAlign: "center" }}> {item.productName}</p>
                    <Button
                      onClick={() => {
                        setCollectedProducts({});
                        setRegistrableProducts([item]);
                        setOpen(true);
                      }}
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      Register
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <h5>
            No product list found{" "}
            <span
              className={AddTotalSalesCss.navigateToAddItems}
              onClick={(e) => {
                navigate("/OpenBusiness/additems");
              }}
            >
              click here to register
            </span>
          </h5>
        )
      ) : (
        "please wait while fetching datas"
      )}

      <Modal open={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon sx={{ color: "red", marginRight: "20px" }} />
          </IconButton>

          {RegistrableProducts.map((item) => {
            return (
              <form
                style={{
                  height: "90vh",
                  overflow: "auto",
                  overflowX: "hidden",
                }}
                fullWidth
                id={AddTotalSalesCss.formOnAddTransaction}
                action=""
                onSubmit={(e) => sendFormDataToServer(e, item.ProductId)}
              >
                <div style={{ marginTop: "100px" }}>
                  Registration Form Of Product.
                </div>
                <div key={"itemTransAction_" + item.ProductId}>
                  <div className={AddTotalSalesCss.productNameTransaction}>
                    <h4>{item.productName}</h4>
                    <br />
                  </div>
                  <label>Select date</label>
                  <TextField
                    onChange={(e) => {
                      collectFormData(e, item.ProductId);
                      setselectedTime(e.target.value);
                    }}
                    value={CollectedProducts.dates}
                    required
                    type="date"
                    name="dates"
                    id={AddTotalSalesCss.dateIdInTotalSales}
                  />
                  {console.log(
                    "CollectedProducts.dates",
                    CollectedProducts.dates
                  )}
                  <br />
                  <TextField
                    required
                    target={item.ProductId}
                    onChange={(e) => collectFormData(e, item.ProductId)}
                    className={AddTotalSalesCss.productInput}
                    type="number"
                    name={"purchaseQty" + item.ProductId}
                    label="Purchase quantity"
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectFormData}
                    className={AddTotalSalesCss.productInput}
                    type="number"
                    name={"salesQuantity" + item.ProductId}
                    label="Sales quantity"
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectFormData}
                    className={AddTotalSalesCss.productInput}
                    type="number"
                    name={"wrickageQty" + item.ProductId}
                    label="Broken quantity"
                  />
                  <br />

                  <label>Select sales type</label>
                  <Select
                    required
                    name={"salesTypeValues" + item.ProductId}
                    labelId="sales-type-label"
                    id="sales-type-select"
                    // value=""
                    onChange={collectFormData}
                  >
                    <MenuItem value="On cash">On cash</MenuItem>
                    <MenuItem value="By bank">By bank</MenuItem>
                    <MenuItem value="On credit">On credit</MenuItem>
                  </Select>
                  <br />

                  {CollectedProducts["salesTypeValues" + item.ProductId] ==
                    "On credit" && (
                    <>
                      <label>Payment date</label>
                      <TextField
                        onChange={collectFormData}
                        name={"creditDueDate" + item.ProductId}
                        required
                        type="date"
                      />
                    </>
                  )}
                  <br />
                  <TextareaAutosize
                    rowsMin={3} // Specify the minimum number of rows
                    placeholder="Enter Description Text Here" // Placeholder text
                    style={{ width: "95%", minHeight: "90px", padding: "5px" }} // Specify the width of the textarea
                    required
                    onChange={collectFormData}
                    className={AddTotalSalesCss.productInput}
                    type="text"
                    name={"Description" + item.ProductId}
                    label="Description"
                  />
                  <br />
                  {!Processing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={AddTotalSalesCss.RegisterSales}
                    >
                      Register
                    </Button>
                  ) : (
                    <ButtonProcessing />
                  )}
                  <br />
                  <br />
                </div>{" "}
              </form>
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}
export default AddTotalSales;
