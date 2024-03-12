import React, { useState } from "react";
import SearchExpenceTransaction from "../SearchTrans/SearchExpenceTransaction";
import GetCreditLists from "../../CreditMGMT/GetCreditLists";
import GetEachTransaction from "../SearchTrans/GetEachTransaction";

let SearchSales_Purchase = ({ InputValue, setSearchTypeValueError }) => {
  let { toDate, fromDate, selectedValue, productName } = InputValue;
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: "getAllTransaction",
  });
  const [showEachItems, setshowEachItems] = useState(false);
  return (
    <>
      <GetCreditLists
        randval={InputValue.randval}
        dateRange={{ fromDate: fromDate, toDate: toDate }}
      />

      <GetEachTransaction
        toDate={toDate}
        fromDate={fromDate}
        RandValue={InputValue.randval}
        setGetAllDailyRegisters={setGetAllDailyRegisters}
        productName={productName}
        ProductId={
          selectedValue == "SINGLETRANSACTION"
            ? "getSingleTransaction"
            : "getAllTransaction"
        }
      />
      <SearchExpenceTransaction
        InputValue={InputValue}
        toDate={toDate}
        fromDate={fromDate}
        setshowEachItems={setshowEachItems}
      />
    </>
  );
};
export default SearchSales_Purchase;
