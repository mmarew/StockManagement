import React, { useState } from "react";
import singleSalesCss from "../../CSS/AddSingleSales.module.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import axios from "axios";
import currentDates from "../Body/Date/currentDate";
import { ButtonProcessing } from "../Utilities/Utility";
function GetSingleProducts({ data }) {
  let { setGetAllDailyRegisters, steRegisterableItems } = data;
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  //   use states start here
  const [searchedProducts, setsearchedProducts] = useState([]);
  const [Errors, setErrors] = useState(false);
  const [Processing, setProcessing] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  //   const [productDetailes, setproductDetailes] = useState([]);
  const [singleSalesInputValues, setSinlgeSalesInputValues] = useState({
    singleSalesDate: currentDates(),
  });
  //   functions start here
  let handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      setProcessing(true);
      let responce = await axios.post(
        serverAddress + "products/getSingleProducts/",
        {
          ...singleSalesInputValues,
          token,
          businessId,
          businessName,
        }
      );
      console.log("responce", responce);
      setProcessing(false);
      let { data } = responce.data;
      if (data.length == 0) {
        setErrors("no product founds");
      } else setsearchedProducts(data);
    } catch (error) {
      console.log("error", error);
      setProcessing(false);
      setErrors(error.message);
    }
  };

  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <div>
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
          Select Date
        </label>
        <br />
        <TextField
          onChange={handleSearchableProductInput}
          value={singleSalesInputValues.singleSalesDate || currentDates()}
          required
          fullWidth
          name="singleSalesDate"
          type="date"
        />
        <br />

        <TextField
          required
          name="searchInput"
          value={singleSalesInputValues.searchInput}
          onChange={handleSearchableProductInput}
          label="Type Product Name"
          className=""
          type={"search"}
          id="searchInputToSingleProducts"
        />
        <br />
        {!Processing ? (
          <Button
            id="btnsearchSingleProduct"
            fullWidth
            type="submit"
            variant="contained"
          >
            Search
          </Button>
        ) : (
          <ButtonProcessing />
        )}
        <br />
      </form>
      {searchedProducts.length > 0 && (
        <TableContainer className={singleSalesCss.TableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Register</TableCell>
                <TableCell>Get</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedProducts?.map((items) => {
                return (
                  <TableRow key={items.ProductId}>
                    <TableCell>{items.productName}</TableCell>
                    <TableCell>
                      <Button
                        className={
                          "class_" +
                          items.ProductId +
                          " " +
                          singleSalesCss.getProducts
                        }
                        onClick={() => {
                          steRegisterableItems({ items: items, Open: true });
                        }}
                      >
                        Register
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setGetAllDailyRegisters({
                            Open: true,
                            RandValue: Math.random(),
                            ProductId: items.ProductId,
                          });
                        }}
                        className={singleSalesCss.getProducts}
                      >
                        view
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default GetSingleProducts;
