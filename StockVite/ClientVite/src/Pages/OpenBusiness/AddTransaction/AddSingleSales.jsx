import React, { useState } from "react";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";

import { Tab, Tabs } from "@mui/material";

import GetRegisterableItems from "../../../Components/Transaction/AddTrans/GetRegisterableItems";
import GetEachTransaction from "../../../Components/Transaction/SearchTrans/GetEachTransaction";
import AddSingleSales_Register from "../../../Components/Transaction/AddTrans/RegisterPurchaseAndSales";
import SuccessOrError from "../../../Components/Body/Others/SuccessOrError";
import GetSingleProducts from "../../../Components/Products/GetSingleProducts";
import SearchTranactions from "../../../Components/Transaction/SearchTrans/SearchTranactions";
import currentDates from "../../../Components/Body/Date/currentDate";

function AddSingleSales() {
  const [singleSalesInputValues, setSinlgeSalesInputValues] = useState({
    singleSalesToDate: currentDates(),
    singleSalesFromDate: currentDates(),
  });

  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
    RandValue: Math.random(),
  });
  const [Errors, setErrors] = useState("");

  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: false,
  });
  const [tabValue, setTabValue] = useState(0);

  let handleTabChanges = (event, newTab) => {
    setGetAllDailyRegisters({ Open: false });

    setTabValue(newTab);
  };
  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      {Errors && <SuccessOrError request={Errors} setErrors={setErrors} />}
      <Tabs
        value={tabValue}
        onChange={(event, newTab) => {
          handleTabChanges(event, newTab);
        }}
      >
        <Tab label="Products" value={0} />
        <Tab label="Search" value={1} />
        <Tab label="View daily" value={2} />
      </Tabs>
      {tabValue == 0 && <GetRegisterableItems />}
      {tabValue == 1 && (
        <GetSingleProducts
          data={{
            singleSalesInputValues,
            setSinlgeSalesInputValues,
            setGetAllDailyRegisters,
            steRegisterableItems,
          }}
        />
      )}
      {tabValue == 2 && (
        <>
          <SearchTranactions
            data={{
              setGetAllDailyRegisters,
              setSinlgeSalesInputValues,
              singleSalesInputValues,
            }}
          />
        </>
      )}
      {RegisterableItems.Open && (
        <AddSingleSales_Register
          RegisterableItems={RegisterableItems}
          steRegisterableItems={steRegisterableItems}
        />
      )}
      {getAllDailyRegisters.Open && (
        <GetEachTransaction
          fromDate={singleSalesInputValues.singleSalesFromDate}
          toDate={singleSalesInputValues.singleSalesToDate}
          ErrorsProps={{ Errors, setErrors }}
          setGetAllDailyRegisters={setGetAllDailyRegisters}
          currentDay={singleSalesInputValues.singleSalesToDate}
          ProductId={getAllDailyRegisters.ProductId}
          RandValue={getAllDailyRegisters.RandValue}
          searchInput={singleSalesInputValues.searchInput}
        />
      )}
    </div>
  );
}
export default AddSingleSales;
