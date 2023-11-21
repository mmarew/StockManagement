import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SearchProducts.css";
import $ from "jquery";
import SearchProducts from "./SearchProducts";
import SearchCosts from "./SearchCosts";
import SearchSales_Purchase from "./SearchSales_Purchase";
import { Box, Button, Select, TextField } from "@mui/material";
import { MenuItem } from "@material-ui/core";
import { ConsumeableContext } from "../UserContext/UserContext";

function SearchManager() {
  let { setAccountRecivableAmt, setCollectedMoney } = ConsumeableContext();
  const [selectedValue, setSelectedValue] = useState("Default");
  let serverAddress = localStorage.getItem("targetUrl");
  const [InputValue, setInputValue] = useState({});
  useEffect(() => {
    setSearchTypeValueError("");
  }, [InputValue.selectSearches]);
  const [searchTarget, setsearchTarget] = useState();
  let businessName = localStorage.getItem("businessName");
  // when we type products name
  const [RequestedSearch, setRequestedSearch] = useState();
  let submitSearch = async (e) => {
    if (e) e.preventDefault();
    if (selectedValue == "Default") {
      setSearchTypeValueError(
        <Box sx={{ color: "red" }}>select values first</Box>
      );
      return;
    }
    $(".LinearProgress").css("display", "block");
    if (InputValue.selectSearches == "TRANSACTION") {
      if (InputValue.productName == "" || InputValue.productName == undefined) {
        alert("please type product name first");
        $("#searchInputs").css({ backgroundColor: "red" });
        return;
      }
      if (InputValue.toDate == "" || InputValue.fromDate == "") {
        alert("date is mandatory");
        $("#fromDate").css({ backgroundColor: "red" });
        $("#toDate").css({ backgroundColor: "red" });
        return;
      }
    }
    if (InputValue.selectSearches == "") {
      if (InputValue.toDate == "" || InputValue.fromDate == "") {
        alert("date is mandatory");
        $("#fromDate").css({ backgroundColor: "red" });
        $("#toDate").css({ backgroundColor: "red" });
        return;
      }
    }
    if (searchTarget == "ALLTRANSACTION") {
      if (InputValue.toDate == "" || InputValue.fromDate == "") {
        alert("date is mandatory");
        $("#fromDate").css({ backgroundColor: "red" });
        $("#toDate").css({ backgroundColor: "red" });
        return;
      }
    }

    $(".LinearProgress").css("display", "block");
    console.log("InputValue", InputValue.fromDate, InputValue.toDate);
    // return;
    let businessId = localStorage.getItem("businessId");
    let token = localStorage.getItem("storeToken");
    InputValue.token = token;
    InputValue.businessId = businessId;
    setRequestedSearch("waitting ....");
    setAccountRecivableAmt(0);
    setCollectedMoney(0);
    let response = await axios.post(serverAddress + "searchProducts/", {
      InputValue,
    });
    console.log("response", response);
    // return;
    if (searchTarget == "TRANSACTION") {
    } else if (searchTarget == "COSTS") {
      if (response.data.data.length == 0) {
        alert("You haven't registered Cost data.");
      }
    } else if (searchTarget == "PRODUCTS") {
      if (response.data.products.length == 0) {
        alert("You haven't registered Product data");
      }
    } else if (searchTarget == "ALLTRANSACTION") {
      if (
        response?.data?.expenceTransaction?.length == 0 &&
        response?.data?.data?.length == 0
      ) {
        // alert("No data on this date");
      }
    }
    $(".LinearProgress").css("display", "none");
    if (searchTarget == "PRODUCTS") {
      setRequestedSearch(
        <SearchProducts response={response} submitSearch={submitSearch} />
      );
      return;
    } else if (searchTarget == "COSTS") {
      setRequestedSearch(<SearchCosts response={response} />);
      return;
    } else if (searchTarget == "ALLTRANSACTION") {
      setRequestedSearch(
        <SearchSales_Purchase
          // InputValue.fromDate, InputValue.toDate
          toDate={InputValue.toDate}
          fromDate={InputValue.fromDate}
          response={response}
          requestFrom="showExpencesList"
          searchTarget={searchTarget}
        />
      );
      return;
    } else if (searchTarget == "TRANSACTION") {
      setRequestedSearch(
        <SearchSales_Purchase
          searchTarget={searchTarget}
          response={response}
          toDate={InputValue.toDate}
          fromDate={InputValue.fromDate}
          requestFrom="SearchManagerOnlySalesAndPurchase"
        />
      );
      return;
    } else {
      alert("wrong selection");
    }
  };
  let getInputValues = (e) => {
    let value = e.target.value,
      name = e.target.name;
    console.log(e.target.id);
    $("#" + e.target.id).css({ backgroundColor: "" });
    businessName = localStorage.getItem("businessName");
    setInputValue({ ...InputValue, [name]: value, businessName });
  };

  useEffect(() => {
    businessName = localStorage.getItem("businessName");
    let fromDate = $("#fromDate").val(),
      toDate = $("#toDate").val(),
      selectSearches = $("#selectSearches").val();
    setInputValue({
      ...InputValue,
      businessName,
      toDate,
      fromDate,
      selectSearches,
    });
    handleChangeInSelect();
  }, []);

  /////////////////////////////

  let handleChangeInSelect = (e) => {
    console.log(e);
    if (e != undefined) {
      const selectSearches = e.target.value;
      setSelectedValue(e.target.value);
      console.log("selectSearches", selectSearches);
      setInputValue({
        ...InputValue,
        selectSearches,
      });
    }
    let value = "";
    if (e == undefined) {
      value = "TRANSACTION";
    } else {
      value = e.target.value;
    }
    console.log("value is ", value);
    setsearchTarget(value);
    $(".searchInputs").css("display", "flex");
  };
  useEffect(() => {
    setRequestedSearch();
  }, [searchTarget]);
  const [SearchTypeValueError, setSearchTypeValueError] = useState("");
  return (
    <>
      <br />
      <h3 className="searchTitle">Search form to your business</h3>
      <form onSubmit={submitSearch} id="searchProduct">
        <Select
          value={selectedValue}
          required
          label="choose your "
          onChange={handleChangeInSelect}
          name=""
          id="selectSearches"
        >
          <MenuItem value="Default">Choose your search</MenuItem>
          <MenuItem value="TRANSACTION">SINGLE TRANSACTION</MenuItem>
          <MenuItem value="ALLTRANSACTION">ALL TRANSACTION</MenuItem>
          <MenuItem value="PRODUCTS">PRODUCTS</MenuItem>
          <MenuItem value="COSTS">EXPENCES</MenuItem>
        </Select>
        {SearchTypeValueError}
        <div className="searchInputs">
          {console.log("searchTarget", searchTarget)}
          {searchTarget == "ALLTRANSACTION" ? (
            <>
              <label>From Date</label>
              <TextField
                className="searchField"
                label=""
                required
                id="fromDate"
                name="fromDate"
                type="date"
                onChange={getInputValues}
              />
              <br />
              <label>To Date</label>
              <TextField
                className="searchField"
                required
                id="toDate"
                name="toDate"
                type="date"
                onChange={getInputValues}
              />
            </>
          ) : searchTarget == "TRANSACTION" ? (
            <>
              <TextField
                className="searchField"
                required
                name="productName"
                id="searchInputs"
                onChange={getInputValues}
                label="product Name"
                type="text"
              />
              <br />
              <label>From Date</label>
              <TextField
                className="searchField"
                // label="From Date "
                required
                id="fromDate"
                name="fromDate"
                type="date"
                onChange={getInputValues}
              />
              <br />
              <label>To Date </label>
              <TextField
                className="searchField"
                required
                id="toDate"
                name="toDate"
                type="date"
                onChange={getInputValues}
              />
            </>
          ) : searchTarget == "PRODUCTS" || searchTarget == "COSTS" ? (
            ""
          ) : (
            ""
          )}
        </div>
        <br />
        <Button variant="contained" className="searchBtn" type="submit">
          Search
        </Button>
      </form>

      {RequestedSearch}
    </>
  );
}

export default SearchManager;
