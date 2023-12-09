import React, { useState } from "react";
import SearchExpenceTransaction from "./SearchExpenceTransaction";

import GetCreditLists from "./GetCreditLists";
import GetEachTransaction from "./GetEachTransaction";

let SearchSales_Purchase = ({ InputValue }) => {
  let { toDate, fromDate, productName, selectedValue } = InputValue;
  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: "getAllTransaction",
  });
  const [showEachItems, setshowEachItems] = useState(false);
  const [ShowExpences, setShowExpences] = useState();
  return (
    <>
      <GetCreditLists
        randval={InputValue.randval}
        // viewInTable={viewInTable}
        dateRange={{ fromDate: fromDate, toDate: toDate }}
      />
      <GetEachTransaction
        toDate={toDate}
        fromDate={fromDate}
        RandValue={InputValue.randval}
        setGetAllDailyRegisters={setGetAllDailyRegisters}
        ProductId="getAllTransaction"
      />
      <SearchExpenceTransaction
        toDate={toDate}
        fromDate={fromDate}
        // viewInTable={viewInTable}
        // setviewInTable={setviewInTable}
        // showEachItems={showEachItems}
        // expencesData={expencesData}
        // SearchedDatas={SearchedDatas}
        setshowEachItems={setshowEachItems}
      />
    </>
  );
};
export default SearchSales_Purchase;
