import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddTotalSales.css";
import $ from "jquery";
import { Button, TextField } from "@mui/material";
function AddTotalSales({ Time }) {
  let ProductId = [];
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
  let sendFormDataToServer = async (e) => {
    e.preventDefault();
    console.log(CollectedProducts);
    let dates = CollectedProducts.dates;
    if (dates == undefined) {
      alert("Date is not selected");
      $("#dateId").css("backgroundColor", "red");
      return;
    }
    $(".LinearProgress").show();
    let response = await axios.post(
      serverAddress + "registerTransaction/",
      CollectedProducts
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
      $(".productInput div input").val("");
    } else if (datas == "allDataAreRegisteredBefore") {
      alert(
        "Your data are not registered now.Because all of your data are registered before. Thank you"
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
  return (
    <div className="addTotalSalesWrapper">
      {console.log(CollectedProducts)}
      {console.log("ProductsList", ProductsList)}
      {ProductsList !== "Wait" ? (
        ProductsList?.length > 0 ? (
          <form
            id="formOnAddTransaction"
            action=""
            onSubmit={sendFormDataToServer}
          >
            <TextField
              onChange={(e) => {
                setselectedTime(e.target.value);
              }}
              required
              type="date"
              name="dateInTotalSales"
              id="dateIdInTotalSales"
            />{" "}
            <br />
            {ProductsList?.map((item) => {
              return (
                <div key={item.ProductId}>
                  <div className="productName-transaction">
                    {" "}
                    <h4>{item.productName}</h4>
                    <br />
                  </div>
                  <TextField
                    required
                    target={item.ProductId}
                    onChange={collectFormData}
                    className={"productInput"}
                    type="number"
                    name={"purchaseQty" + item.ProductId}
                    label="Purchase quantity"
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectFormData}
                    className={"productInput"}
                    type="number"
                    name={"salesQuantity" + item.ProductId}
                    label="Sales quantity"
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectFormData}
                    className={"productInput"}
                    type="number"
                    name={"wrickageQty" + item.ProductId}
                    label="Broken quantity"
                  />
                  <br />
                  <TextField
                    required
                    onChange={collectFormData}
                    className={"productInput"}
                    type="text"
                    name={"Description" + item.ProductId}
                    label="Description"
                  />
                </div>
              );
            })}
            <br />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="RegisterSales"
            >
              Register
            </Button>
          </form>
        ) : (
          "No product list found"
        )
      ) : (
        "please wait while fetching datas"
      )}
    </div>
  );
}
export default AddTotalSales;
