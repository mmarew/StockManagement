import React, { useEffect, useState } from "react";
import singleSalesCss from "../../CSS/AddSingleSales.module.css";
import {
  Button,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import currentDates from "../Body/Date/currentDate";
import { ButtonProcessing } from "../Utilities/Utility";
import fetchProducts from "./fetchProducts";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
function GetSingleProducts({ data }) {
  let {
    setGetAllDailyRegisters,
    steRegisterableItems,
    singleSalesInputValues,
    setSinlgeSalesInputValues,
  } = data;
  //   use states start here
  const { Processing, setProcessing } = ConsumeableContext();
  //   const [productDetailes, setproductDetailes] = useState([]);

  //   functions start here
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    console.log("singleSalesInputValues", singleSalesInputValues);
    // return;
    setGetAllDailyRegisters({
      ...singleSalesInputValues,
      // fromDate: singleSalesInputValues.singleSalesFromDate,
      // toDate: singleSalesInputValues.singleSalesToDate,
      Open: true,
      RandValue: Math.random(),
      ProductId: singleSalesInputValues.targetedProduct.ProductId,
    });
  };

  let handleSearchableProductInput = (event) => {
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [event.target.name]: event.target.value,
    });
  };
  const [ProductsList, setProductsList] = useState([]);
  useEffect(() => {
    setProcessing(true);
    fetchProducts()
      .then((data) => {
        setProcessing(false);
        setProductsList(data.data);
      })
      .catch((error) => {
        setProcessing(false);
        setErrors(error.message);
      });
  }, []);

  return (
    <div>
      {ProductsList.length > 0 ? (
        <form
          className={singleSalesCss.formToSearchItems}
          onSubmit={handleSearchSubmit}
        >
          <label
            style={{
              textAlign: "center",
              paddingLeft: "100px",
              width: "fit-content ",
            }}
          >
            From Date
          </label>
          <br />
          <TextField
            onChange={handleSearchableProductInput}
            value={singleSalesInputValues.singleSalesFromDate}
            required
            fullWidth
            name="singleSalesFromDate"
            type="date"
          />
          <br />
          <label
            style={{
              textAlign: "center",
              paddingLeft: "100px",
              width: "fit-content ",
            }}
          >
            TO Date
          </label>
          <TextField
            onChange={handleSearchableProductInput}
            value={singleSalesInputValues.singleSalesToDate}
            required
            fullWidth
            name="singleSalesToDate"
            type="date"
          />
          <br />
          <Select
            onChange={handleSearchableProductInput}
            value={singleSalesInputValues.targetedProduct}
            required
            name="targetedProduct"
          >
            {ProductsList?.map((product) => {
              return (
                <MenuItem key={product.ProductId} value={product}>
                  {product.productName}
                </MenuItem>
              );
            })}
          </Select>
          <br />
          {Processing ? (
            <ButtonProcessing />
          ) : (
            <Button
              id="btnsearchSingleProduct"
              fullWidth
              type="submit"
              variant="contained"
            >
              Search
            </Button>
          )}
          <br />
        </form>
      ) : (
        <>{Processing ? <LinearProgress /> : <p>No Products Found</p>}</>
      )}
    </div>
  );
}

export default GetSingleProducts;
