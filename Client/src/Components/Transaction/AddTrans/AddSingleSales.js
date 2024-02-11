import axios from "axios";
import React, { useEffect, useState } from "react";
import singleSalesCss from "./AddSingleSales.module.css";

import {
  Button,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { ButtonProcessing } from "../../Utilities/Utility";
import AddSingleSales_GetItems from "./AddSingleSales_GetItems";
import GetEachTransaction from "../SearchTrans/GetEachTransaction";
import AddSingleSales_Register from "./AddSingleSales_Register";
import SuccessOrError from "../../Body/Others/SuccessOrError";

function AddSingleSales() {
  // setShowHiddenProducts;
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
    RandValue: Math.random(),
  });
  const [Errors, setErrors] = useState("");

  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: false,
  });
  const [tabValue, setTabValue] = useState(0);

  // const [showHiddenProducts, setShowHiddenProducts] = useState(false);
  // is used to store daily sales
  const [DailyTransaction, setDailyTransaction] = useState([]);
  let serverAddress = localStorage.getItem("targetUrl");
  const [productDetailes, setproductDetailes] = useState([]);
  const {
    singleSalesInputValues,
    setSinlgeSalesInputValues,
    Proccessing,
    setProccessing,
  } = ConsumeableContext();

  const [searchedProducts, setSearchedProducts] = useState([]);
  let handleSearchSubmit = async (e) => {
    try {
      e.preventDefault();
      setproductDetailes([]);
      setSearchedProducts([]);
      setDailyTransaction([]);
      setProccessing(true);
      let responce = await axios.post(
        serverAddress + "products/getSingleProducts/",
        {
          ...singleSalesInputValues,
          token,
          businessId,
          businessName,
        }
      );
      setProccessing(false);
      if (responce.data.data.length == 0) {
        setErrors("no product founds");
      } else setSearchedProducts(responce.data.data);
    } catch (error) {
      setProccessing(false);
      setErrors(error.message);
    }
  };
  // submit search ends here

  // collect input values of search form
  let handleSearchableProductInput = (event) => {
    console.log(event.target.value);
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [event.target.name]: event.target.value,
    });
  };
  //

  useEffect(() => {
    setGetAllDailyRegisters({
      Open: false,
      RandValue: Math.random(),
    });
  }, [singleSalesInputValues]);

  let handleTabChanges = (event, newTab) => {
    setGetAllDailyRegisters({ Open: false });
    setSearchedProducts([]);
    setDailyTransaction([]);
    setTabValue(newTab);
  };
  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      {Errors && <SuccessOrError request={Errors} setErrors={setErrors} />}
      <Tabs
        value={tabValue}
        onChange={(event, newTab) => {
          setSinlgeSalesInputValues({});
          handleTabChanges(event, newTab);
        }}
      >
        <Tab label="Products" value={0} />
        <Tab label="Search" value={1} />
        <Tab label="View daily" value={2} />
      </Tabs>
      {tabValue == 0 && <AddSingleSales_GetItems />}
      {tabValue == 1 && (
        <form
          className={singleSalesCss.formToSearchItems}
          onSubmit={(e) => {
            handleSearchSubmit(e);
          }}
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
            value={singleSalesInputValues.singleSalesDate}
            required
            fullWidth
            name="singleSalesDate"
            id="singleSalesDate"
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
          {!Proccessing ? (
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
      )}
      {tabValue == 2 && (
        <>
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
              // getTotalRegiters("getAllTransaction");
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
              value={singleSalesInputValues.singleSalesDate}
              required
              fullWidth
              name="singleSalesDate"
              id="singleSalesDate"
              type="date"
            />
            {!Proccessing ? (
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
        </>
      )}
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
      {RegisterableItems.Open && (
        <AddSingleSales_Register
          RegisterableItems={RegisterableItems}
          steRegisterableItems={steRegisterableItems}
        />
      )}
      {getAllDailyRegisters.Open && (
        <GetEachTransaction
          ErrorsProps={{ Errors, setErrors }}
          setGetAllDailyRegisters={setGetAllDailyRegisters}
          currentDay={singleSalesInputValues.singleSalesDate}
          ProductId={getAllDailyRegisters.ProductId}
          RandValue={getAllDailyRegisters.RandValue}
          searchInput={singleSalesInputValues.searchInput}
        />
      )}
    </div>
  );
}
export default AddSingleSales;
