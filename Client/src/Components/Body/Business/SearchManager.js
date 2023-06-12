import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SearchProducts.css";
import $ from "jquery";
import SearchProducts from "./SearchProducts";
import SearchCosts from "./SearchCosts";
import SearchAllTransactions from "./SearchAllTransactions";
import SearchSingleTransActions from "./SearchSingleTransActions";
function SearchManager() {
  const [showEachItems, setshowEachItems] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  const [InputValue, setInputValue] = useState({});
  const [searchTarget, setsearchTarget] = useState();
  let businessName = localStorage.getItem("businessName");
  // when we type products name
  const [RequestedSearch, setRequestedSearch] = useState();
  let submitSearch = async (e) => {
    e.preventDefault();
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

    let response = await axios.post(serverAddress + "searchProducts/", {
      InputValue,
    });
    $(".LinearProgress").css("display", "none");
    if (searchTarget == "PRODUCTS") {
      setRequestedSearch(<SearchProducts response={response} />);
      return;
    } else if (searchTarget == "COSTS") {
      setRequestedSearch(<SearchCosts response={response} />);
      return;
    } else if (searchTarget == "ALLTRANSACTION") {
      setRequestedSearch(<SearchAllTransactions response={response} />);
      return;
    } else if (searchTarget == "TRANSACTION") {
      console.log(searchTarget);
      $("#productTransaction").css("display", "block");
      setRequestedSearch(
        <SearchSingleTransActions
          showEachItems={showEachItems}
          setshowEachItems={setshowEachItems}
          response={response}
          requestFrom="SearchManagerOnlySalesAndPurchase"
        />
      );
      return;
    } else {
      alert("wrong selection");
    }
  };
  ////////////////

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
    if (e != undefined) {
      let selectSearches = $("#selectSearches").val();
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
    setsearchTarget(value);
    $(".searchInputs").css("display", "flex");
  };
  useEffect(() => {
    setRequestedSearch();
  }, [searchTarget]);

  return (
    <>
      <form onSubmit={submitSearch} id="searchProduct">
        <select onChange={handleChangeInSelect} name="" id="selectSearches">
          <option value="TRANSACTION">SINGLE TRANSACTION</option>
          <option value="ALLTRANSACTION">ALL TRANSACTION</option>
          <option value="PRODUCTS">PRODUCTS</option>
          <option value="COSTS">COSTS</option>
        </select>
        <div className="searchInputs">
          {console.log("searchTarget", searchTarget)}
          {searchTarget == "ALLTRANSACTION" ? (
            <>
              From Date
              <input
                required
                id="fromDate"
                name="fromDate"
                type="date"
                onChange={getInputValues}
              />
              To Date{" "}
              <input
                required
                id="toDate"
                name="toDate"
                type="date"
                onChange={getInputValues}
              />
            </>
          ) : searchTarget == "TRANSACTION" ? (
            <>
              <input
                required
                name="productName"
                id="searchInputs"
                onChange={getInputValues}
                placeholder="product Name"
                type="text"
              />
              From Date
              <input
                required
                id="fromDate"
                name="fromDate"
                type="date"
                onChange={getInputValues}
              />
              To Date{" "}
              <input
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
        <input className="searchBtn" type="submit" value={"Search"} />
      </form>

      {RequestedSearch}
    </>
  );
}

export default SearchManager;
