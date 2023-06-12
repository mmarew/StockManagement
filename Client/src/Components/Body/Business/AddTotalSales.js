import axios from "axios";
import React, { useEffect, useState } from "react";
import currentDates from "../Date/currentDate";
import "./AddTotalSales.css";
import $ from "jquery";
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

    let datas = response.data.data;
    console.log(datas);
    if (datas == "This is already registered") {
      alert(
        "Your data is not registered because, on this date data is already registered"
      );
    } else if (datas == "data is registered successfully") {
      alert("successfully registered. Thank you.");
      let byClass = document.getElementsByClassName("productInput");
      for (let i = 0; i < byClass.length; i++) {
        byClass[i].value = "";
      }
    }
    $(".LinearProgress").hide();
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
            <input
              onChange={(e) => {
                console.log(e.target.value);
                setselectedTime(e.target.value);
              }}
              required
              type="date"
              name="dateInTotalSales"
              id="dateIdInTotalSales"
            />
            {ProductsList?.map((item) => {
              return (
                <div key={item.ProductId}>
                  <br />
                  <div className="productName-transaction">
                    {" "}
                    <h4>{item.productName}</h4>
                  </div>
                  <input
                    required
                    target={item.ProductId}
                    onChange={collectFormData}
                    className={"productInput"}
                    type="text"
                    name={"purchaseQty" + item.ProductId}
                    placeholder="Purchase quantity"
                  />

                  <input
                    required
                    onChange={collectFormData}
                    className={"productInput"}
                    type="text"
                    name={"salesQuantity" + item.ProductId}
                    placeholder="Sales quantity"
                  />
                  <input
                    required
                    onChange={collectFormData}
                    className={"productInput"}
                    type="text"
                    name={"wrickageQty" + item.ProductId}
                    placeholder="Broken quantity"
                  />
                </div>
              );
            })}
            <button type="submit" className="RegisterSales">
              Register
            </button>
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
