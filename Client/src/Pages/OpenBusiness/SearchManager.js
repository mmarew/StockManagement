import React, { useState } from "react";
import { Box, Button, Select, TextField, MenuItem } from "@mui/material";
import SearchedProducts from "../../Components/Products/SearchedProducts";
import SearchSales_Purchase from "../../Components/Transaction/SearchTrans/SearchSales_Purchase";
import SearchExpencesItem from "../../Components/Expences/SearchExpencesItem";
import currentDates from "../../Components/Body/Date/currentDate";
import { ButtonProcessing } from "../../Components/Utilities/Utility";
import { ConsumeableContext } from "../../Components/Body/UserContext/UserContext";

function SearchManager() {
  const [inputValue, setInputValue] = useState({
    selectedValue: "Default",
    fromDate: currentDates(),
    toDate: currentDates(),
    randval: Math.random(),
    businessName: localStorage.getItem("businessName"),
    formSubmit: false,
  });
  const { Processing, setProcessing } = ConsumeableContext();
  const [searchTypeValueError, setSearchTypeValueError] = useState("");
  const submitSearch = (e) => {
    // used to re render in click
    setProcessing(true);
    setInputValue({ ...inputValue, randval: Math.random(), formSubmit: true });

    e.preventDefault();
    if (inputValue.selectedValue === "Default") {
      setSearchTypeValueError("Please select a search type first.");
      return;
    }
    setSearchTypeValueError("");
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
      formSubmit: false,
    }));
  };

  return (
    <>
      <br />
      <h3 className="searchTitle">Search form for your business</h3>
      <form onSubmit={submitSearch} id="searchProduct">
        <Select
          value={inputValue.selectedValue}
          required
          label="Choose your search"
          onChange={handleInputChange}
          name="selectedValue"
          id="selectSearches"
        >
          <MenuItem value="Default">Choose your search</MenuItem>
          <MenuItem value="SINGLETRANSACTION">SINGLE TRANSACTION</MenuItem>
          <MenuItem value="ALLTRANSACTION">ALL TRANSACTION</MenuItem>
          <MenuItem value="PRODUCTS">PRODUCTS</MenuItem>
          <MenuItem value="COSTS">EXPENSES</MenuItem>
        </Select>
        <Box sx={{ color: "red" }}>{searchTypeValueError}</Box>
        <div>
          {
            <div>
              {inputValue.selectedValue === "SINGLETRANSACTION" && (
                <>
                  <br />
                  <TextField
                    fullWidth
                    required
                    value={inputValue.productName}
                    name="productName"
                    id="searchInputs"
                    onChange={handleInputChange}
                    label="Product Name"
                    type="text"
                  />
                  <br />
                </>
              )}
              <br />
              {(inputValue.selectedValue == "ALLTRANSACTION" ||
                inputValue.selectedValue == "SINGLETRANSACTION") && (
                <>
                  <label>From Date</label>
                  <TextField
                    fullWidth
                    value={inputValue.fromDate}
                    required
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    onChange={handleInputChange}
                  />
                  <br /> <br />
                  <label>To Date</label>
                  <TextField
                    value={inputValue.toDate}
                    fullWidth
                    required
                    id="toDate"
                    name="toDate"
                    type="date"
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>
          }
        </div>
        <br />
        {Processing ? (
          <ButtonProcessing />
        ) : (
          <Button variant="contained" type="submit">
            Search
          </Button>
        )}
      </form>
      {inputValue.formSubmit && (
        <React.Fragment>
          {inputValue.selectedValue === "SINGLETRANSACTION" ? (
            <SearchSales_Purchase
              Processing={{ Processing, setProcessing }}
              setSearchTypeValueError={setSearchTypeValueError}
              InputValue={inputValue}
            />
          ) : inputValue.selectedValue === "COSTS" ? (
            <SearchExpencesItem
              proccessData={{ Processing, setProcessing }}
              InputValue={inputValue}
              setSearchTypeValueError={setSearchTypeValueError}
            />
          ) : inputValue.selectedValue === "PRODUCTS" ? (
            <SearchedProducts
              InputValue={inputValue}
              setSearchTypeValueError={setSearchTypeValueError}
            />
          ) : inputValue.selectedValue === "ALLTRANSACTION" ? (
            <SearchSales_Purchase
              setSearchTypeValueError={setSearchTypeValueError}
              InputValue={inputValue}
            />
          ) : (
            ""
          )}
        </React.Fragment>
      )}
    </>
  );
}

export default SearchManager;
