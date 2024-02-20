import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ButtonProcessing } from "../../Utilities/Utility";
import currentDates from "../../Body/Date/currentDate";
import { Button } from "@mui/material";

function SearchTranactions({ data }) {
  let {
    setGetAllDailyRegisters,
    setSinlgeSalesInputValues,
    singleSalesInputValues,
  } = data;
  const [searchedProducts, setSearchedProducts] = useState([]);

  const [Processing, setProcessing] = useState(false);
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    setGetAllDailyRegisters({
      Open: false,
      RandValue: Math.random(),
    });
  }, [singleSalesInputValues]);
  return (
    <div>
      <form
        style={{
          maxWidth: "300px",
          padding: "  20px",
          backgroundColor: "white",
          marginTop: "10px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setGetAllDailyRegisters({
            Open: true,
            RandValue: Math.random(),
            ProductId: "getAllTransaction",
          });
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
          value={singleSalesInputValues.singleSalesDate || currentDates()}
          required
          fullWidth
          name="singleSalesDate"
          id="singleSalesDate"
          type="date"
        />
        {!Processing ? (
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
    </div>
  );
}

export default SearchTranactions;
