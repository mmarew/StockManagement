import React, { useEffect, useState } from "react";
import { Box, Button, Select, TextField } from "@mui/material";
import { MenuItem } from "@material-ui/core";

import SearchProducts from "./SearchProducts";
import SearchSales_Purchase from "./SearchSales_Purchase";
import SearchExpencesItem from "./SearchExpencesItem";
import currentDates from "../Date/currentDate";
import { red } from "@mui/material/colors";
function SearchManager() {
  const [InputValue, setInputValue] = useState({
    selectedValue: "Default",
    fromDate: currentDates(),
    toDate: currentDates(),
    randval: Math.random(),
    businessName: localStorage.getItem("businessName"),
  });
  const [SearchTypeValueError, setSearchTypeValueError] = useState("");
  const [RequestedSearch, setRequestedSearch] = useState(null);
  const submitSearch = async (e) => {
    if (InputValue.selectedValue === "Default") {
      setSearchTypeValueError(` Please select a search type first. `);
      return;
    }

    setRequestedSearch(null);
    setRequestedSearch(
      <React.Fragment>
        {InputValue.selectedValue === "TRANSACTION" && (
          <SearchSales_Purchase
            setSearchTypeValueError={setSearchTypeValueError}
            InputValue={InputValue}
          />
        )}
        {InputValue.selectedValue === "COSTS" && (
          <SearchExpencesItem
            InputValue={InputValue}
            setSearchTypeValueError={setSearchTypeValueError}
          />
        )}
        {InputValue.selectedValue === "PRODUCTS" && (
          <SearchProducts
            InputValue={InputValue}
            setSearchTypeValueError={setSearchTypeValueError}
          />
        )}
        {InputValue.selectedValue === "ALLTRANSACTION" && (
          <SearchSales_Purchase
            setSearchTypeValueError={setSearchTypeValueError}
            InputValue={InputValue}
          />
        )}
      </React.Fragment>
    );
  };

  const getInputValues = (e) => {
    setRequestedSearch(null);
    const { value, name } = e.target;
    setInputValue((previousValues) => ({ ...previousValues, [name]: value }));
  };

  return (
    <>
      <br />
      <h3 className="searchTitle">Search form for your business</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInputValue((previousValues) => ({
            ...previousValues,
            randval: Math.random(),
          }));
          setTimeout(() => {
            submitSearch(e);
          }, 10);
        }}
        id="searchProduct"
      >
        <Select
          value={InputValue.selectedValue}
          required
          label="Choose your search"
          onChange={(e) => {
            setSearchTypeValueError("");
            getInputValues(e);
          }}
          name="selectedValue"
          id="selectSearches"
        >
          <MenuItem value="Default">Choose your search</MenuItem>
          <MenuItem value="TRANSACTION">SINGLE TRANSACTION</MenuItem>
          <MenuItem value="ALLTRANSACTION">ALL TRANSACTION</MenuItem>
          <MenuItem value="PRODUCTS">PRODUCTS</MenuItem>
          <MenuItem value="COSTS">EXPENSES</MenuItem>
        </Select>
        <Box sx={{ color: "red" }}>{SearchTypeValueError}</Box>
        <div>
          {InputValue.selectedValue === "ALLTRANSACTION" ||
          InputValue.selectedValue === "TRANSACTION" ? (
            <>
              {InputValue.selectedValue === "TRANSACTION" && (
                <>
                  <br />
                  <TextField
                    fullWidth
                    required
                    value={InputValue.productName}
                    name="productName"
                    id="searchInputs"
                    onChange={getInputValues}
                    label="Product Name"
                    type="text"
                  />
                  <br />
                </>
              )}
              <br />
              <label>From Date</label>
              <TextField
                fullWidth
                value={InputValue.fromDate}
                required
                id="fromDate"
                name="fromDate"
                type="date"
                onChange={getInputValues}
              />
              <br /> <br />
              <label>To Date</label>
              <TextField
                value={InputValue.toDate}
                fullWidth
                required
                id="toDate"
                name="toDate"
                type="date"
                onChange={getInputValues}
              />
            </>
          ) : null}
        </div>
        <br />
        <Button variant="contained" type="submit">
          Search
        </Button>
      </form>

      {RequestedSearch && RequestedSearch}
    </>
  );
}

export default SearchManager;
