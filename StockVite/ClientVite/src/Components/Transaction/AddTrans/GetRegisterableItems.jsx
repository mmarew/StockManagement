import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";
import GetEachTransaction from "../SearchTrans/GetEachTransaction";
import CurrencyFormatter, { ButtonProcessing } from "../../Utilities/Utility";
import AddSingleSales_Register from "./RegisterPurchaseAndSales";
import SuccessOrError from "../../Body/Others/SuccessOrError";

function GetRegisterableItems({ randVal, setrandVal }) {
  const token = localStorage.getItem("storeToken");
  const businessId = localStorage.getItem("businessId");
  const businessName = localStorage.getItem("businessName");
  const serverAddress = localStorage.getItem("targetUrl");

  const [processing, setProcessing] = useState(false);
  const [formInputValues, setFormInputValues] = useState({
    salesType: "Default",
    selectedDate: null,
  });
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [errors, setErrors] = useState(null);
  const [proccess, setProccess] = useState(false);
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    open: false,
    ProductId: 0,
  });
  const [registerableItems, setRegisterableItems] = useState({
    items: {},
    Open: false,
  });

  const fetchSearchedProducts = async () => {
    setProccess(true);
    try {
      const response = await axios.post(
        `${serverAddress}products/getsingleProducts/`,
        {
          token,
          businessId,
          businessName,
          Target: "All Products",
          ...formInputValues,
        }
      );
      setProccess(false);
      const data = response.data.data;

      if (
        data === "you are not owner of this business" ||
        data === "Error in server 456"
      ) {
        setErrors(data);
        return;
      }

      if (data.length === 0) {
        setErrors("No products found here");
      } else if (Array.isArray(data)) {
        setSearchedProducts(data);
      } else {
        setErrors("wrong data type");
      }
    } catch (error) {
      setErrors(error.message);
      setProccess(false);
    }
  };

  useEffect(() => {
    fetchSearchedProducts();
  }, [randVal]);

  return (
    <>
      <div style={{ color: "red" }}> {errors}</div>
      <Box display="flex" flexWrap="wrap" marginTop="10px">
        {searchedProducts.map((items, index) => (
          <Box
            key={items.ProductId}
            sx={{
              transition: "transform ease-in-out 0.3s",
              margin: "10px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 10px 40px 0px rgba(46, 46, 46, 0.15)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              width: "200px",
              textAlign: "center",

              "&:hover": {
                transform: "scale(1.08)",
                borderBottom: "3px solid blue",
              },
            }}
          >
            <Box border="none" padding={0} textAlign="center">
              {items.productName}
            </Box>
            <Box textAlign="center">
              Unit Price : {CurrencyFormatter(items.productsUnitPrice)}
            </Box>
            <Box border="none" padding={0} textAlign="center">
              {!processing ? (
                <>
                  <Button
                    className={`class_${items.ProductId}`}
                    style={{ marginRight: "10px" }}
                    onClick={() => setRegisterableItems({ items, Open: true })}
                  >
                    Add
                  </Button>
                  <Button
                    color="success"
                    onClick={() =>
                      setGetAllDailyRegisters((prev) => ({
                        ...prev,
                        open: true,
                        ProductId: items.ProductId,
                        RandValue: Math.random(),
                      }))
                    }
                  >
                    View
                  </Button>
                </>
              ) : (
                <ButtonProcessing />
              )}
            </Box>
          </Box>
        ))}
      </Box>
      {errors && <SuccessOrError request={errors} />}
      {proccess && (
        <>
          <div style={{ padding: "10px" }}>Processing.........</div>
          <LinearProgress />
        </>
      )}
      {getAllDailyRegisters.open && (
        <GetEachTransaction
          ErrorsProps={{ errors, setErrors }}
          RandValue={getAllDailyRegisters.RandValue}
          setGetAllDailyRegisters={setGetAllDailyRegisters}
          ProductId={getAllDailyRegisters.ProductId}
        />
      )}
      {registerableItems.Open && (
        <AddSingleSales_Register
          RegisterableItems={registerableItems}
          steRegisterableItems={setRegisterableItems}
        />
      )}
    </>
  );
}

export default GetRegisterableItems;
