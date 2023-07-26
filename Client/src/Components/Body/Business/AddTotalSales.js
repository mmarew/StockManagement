import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import CloseIcon from "@mui/icons-material/Close";
import $ from "jquery";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import AddTotalSalesCss from "./AddTotalSales.module.css";
function AddTotalSales({ Time }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [RegistrationModal, setRegistrationModal] = useState();
  let serverAddress = localStorage.getItem("targetUrl");
  const [ProductsList, setProductsList] = useState("Wait");
  const [CollectedProducts, setCollectedProducts] = useState({});
  const [selectedTime, setselectedTime] = useState();
  let token = localStorage.getItem("storeToken");
  let BusinessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let collectFormData = (e) => {
    let dates = $("#dateId").val();
    console.log(dates);
    setCollectedProducts({
      ...CollectedProducts,
      [e.target.name]: e.target.value,
      ProductsList,
      businessName,
      BusinessId,
    });
  };
  let getRegisteredProducts = async () => {
    // $(".LinearProgress").show();
    $(".LinearProgress").css("display", "block");
    let Response = await axios.post(serverAddress + "getRegisteredProducts/", {
      token,
      BusinessId,
      businessName,
    });
    console.log("@getRegisteredProducts Response.data.data");
    console.log(Response.data.data);
    setProductsList(Response.data.data);

    $(".LinearProgress").hide();
  };
  let sendFormDataToServer = async (e, ProductId) => {
    e.preventDefault();
    let dates = CollectedProducts.dates;
    CollectedProducts.ProductId = ProductId;
    if (dates == undefined) {
      alert("Date is not selected");
      $("#dateId").css("backgroundColor", "red");
      return;
    }
    let copy = [];
    CollectedProducts.ProductsList.map((items) => {
      if (ProductId == items.ProductId) copy.push(items);
    });
    let copyOfCollection = { ...CollectedProducts };
    copyOfCollection.ProductsList = copy;
    $(".LinearProgress").show();
    let response = await axios.post(
      serverAddress + "registerTransaction/",
      copyOfCollection
    );
    $(".LinearProgress").hide();
    let datas = response.data.data;
    console.log(datas, "response is = ", response);
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
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
        "Tese data are not registered now. Because these are registered before. Thank you. "
      );
    }
  };
  useEffect(() => {
    setCollectedProducts({ ...CollectedProducts, dates: selectedTime });
  }, [selectedTime]);
  useEffect(() => {
    let CDATE = currentDates();
    console.log("CDATE", CDATE);
    $("#dateIdInTotalSales").val(CDATE);
  }, [ProductsList]);

  useEffect(() => {
    let CDATE = currentDates();
    console.log("CDATE", CDATE);
    $("#dateIdInTotalSales").val(CDATE);
    // setselectedTime(CDATE);
    getRegisteredProducts();
    setCollectedProducts({
      ...CollectedProducts,
      dates: CDATE,
    });
  }, []);
  const [RegistrableProducts, setRegistrableProducts] = useState([{}]);
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
                    <p> {item.productName}</p>
                    <Button
                      onClick={() => {
                        setRegistrableProducts([item]);
                        setOpen(true);
                        return "llllll";
                      }}
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      Add Transaction
                    </Button>
                  </div>
                );
                // return (
                //   <div key={item.ProductId}>
                //     <div className="productName-transaction">
                //       {" "}
                //       <h4>{item.productName}</h4>
                //       <br />
                //     </div>
                //     <TextField
                //       required
                //       target={item.ProductId}
                //       onChange={collectFormData}
                //       className={"productInput"}
                //       type="number"
                //       name={"purchaseQty" + item.ProductId}
                //       label="Purchase quantity"
                //     />
                //     <br />
                //     <TextField
                //       required
                //       onChange={collectFormData}
                //       className={"productInput"}
                //       type="number"
                //       name={"salesQuantity" + item.ProductId}
                //       label="Sales quantity"
                //     />
                //     <br />
                //     <TextField
                //       required
                //       onChange={collectFormData}
                //       className={"productInput"}
                //       type="number"
                //       name={"wrickageQty" + item.ProductId}
                //       label="Broken quantity"
                //     />
                //     <br />
                //     <TextField
                //       required
                //       onChange={collectFormData}
                //       className={"productInput"}
                //       type="text"
                //       name={"Description" + item.ProductId}
                //       label="Description"
                //     />
                //   </div>
                // );
              })}
            </div>
          </>
        ) : (
          "No product list found"
        )
      ) : (
        "please wait while fetching datas"
      )}

      <Modal open={open} onClose={handleClose}>
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
            <CloseIcon />
          </IconButton>

          {RegistrableProducts.map((item) => {
            return (
              <form
                id={AddTotalSalesCss.formOnAddTransaction}
                action=""
                onSubmit={(e) => sendFormDataToServer(e, item.ProductId)}
              >
                <div>Registration of product.</div>
                <div key={"itemTransAction_" + item.ProductId}>
                  <div className={AddTotalSalesCss.productNameTransaction}>
                    <h4>{item.productName}</h4>
                    <br />
                  </div>
                  <TextField
                    onChange={(e) => {
                      setselectedTime(e.target.value);
                    }}
                    required
                    type="date"
                    name="dateInTotalSales"
                    id={AddTotalSalesCss.dateIdInTotalSales}
                  />
                  <br />
                  <TextField
                    required
                    target={item.ProductId}
                    onChange={collectFormData}
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
                  <TextField
                    required
                    onChange={collectFormData}
                    className={AddTotalSalesCss.productInput}
                    type="text"
                    name={"Description" + item.ProductId}
                    label="Description"
                  />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={AddTotalSalesCss.RegisterSales}
                  >
                    Register
                  </Button>
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
