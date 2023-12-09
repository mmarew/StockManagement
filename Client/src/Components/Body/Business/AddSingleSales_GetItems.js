import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import currentDates from "../Date/currentDate";
import GetEachTransaction from "./GetEachTransaction";
import CurrencyFormatter, { ButtonProcessing } from "../../utility/Utility";
import AddSingleSales_Register from "./AddSingleSales_Register";
import { ConsumeableContext } from "../UserContext/UserContext";

function AddSingleSales_GetItems({ randVal, setrandVal }) {
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
  });
  let { setShowProgressBar, Proccessing } = ConsumeableContext();

  useEffect(() => {
    console.log("getAllDailyRegisters", getAllDailyRegisters);
  }, [getAllDailyRegisters]);

  let Today = currentDates();

  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
    selectedDate: null,
  });

  const [RegisterableItems, setRegisterableItems] = useState({
    items: {},
    Open: false,
  });

  let serverAddress = localStorage.getItem("targetUrl");
  const [Proccess, setProccess] = useState(false);
  let token = localStorage.getItem("storeToken");
  const [searchedProducts, setSearchedProducts] = useState([]);
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");

  const fetchSearchedProducts = async () => {
    setShowProgressBar(true);
    try {
      const response = await axios.post(serverAddress + "getsingleProducts/", {
        token,
        businessId,
        businessName,
        Target: "All Products",
        ...formInputValues,
      });
      setShowProgressBar(false);
      // console.log("getsingleProducts", response.data.data);
      // return;
      const data = response.data.data;
      if (
        data === "you are not owner of this business" ||
        data === "Error in server 456"
      ) {
        alert(data);
        return;
      }
      if (data.length === 0) {
        alert("No products found here");
      } else if (Array.isArray(data)) {
        setSearchedProducts(data);
      }
    } catch (error) {
      setShowProgressBar(false);
      console.log("Error fetching searched products:", error);
    }
  };

  useEffect(() => {
    fetchSearchedProducts();
  }, [randVal]);

  // const [singleSalesError, setsingleSalesError] = useState({});

  return (
    <>
      <TableContainer>
        <Table>
          {console.log("searchedProducts", searchedProducts)}
          <TableBody
            sx={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
          >
            {searchedProducts?.map((items, index) => {
              return (
                <TableRow
                  key={items.ProductId}
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                    textAlign: "center",
                    margin: "5px",
                    backgroundColor: "white",
                  }}
                >
                  <TableCell
                    sx={{ border: "none", padding: 0, textAlign: "center" }}
                  >
                    {items.productName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Unit Price : {CurrencyFormatter(items.productsUnitPrice)}
                  </TableCell>
                  <TableCell
                    sx={{ border: "none", padding: 0, textAlign: "center" }}
                  >
                    {!Proccessing ? (
                      <>
                        <Button
                          className={"class_" + items.ProductId + " "}
                          style={{
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            setRegisterableItems({ items: items, Open: true });
                          }}
                        >
                          Add Sales
                        </Button>
                        <Button
                          color="success"
                          onClick={() => {
                            setGetAllDailyRegisters((prev) => {
                              return {
                                ...prev,
                                Open: true,
                                ProductId: items.ProductId,
                                RandValue: Math.random(),
                              };
                            });
                          }}
                        >
                          View
                        </Button>
                      </>
                    ) : (
                      <ButtonProcessing />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {getAllDailyRegisters.Open && (
        <GetEachTransaction
          RandValue={getAllDailyRegisters.RandValue}
          setGetAllDailyRegisters={setGetAllDailyRegisters}
          ProductId={getAllDailyRegisters.ProductId}
        />
      )}
      {RegisterableItems.Open ? (
        <AddSingleSales_Register
          RegisterableItems={RegisterableItems}
          steRegisterableItems={setRegisterableItems}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default AddSingleSales_GetItems;
