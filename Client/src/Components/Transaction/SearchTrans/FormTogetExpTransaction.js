import React, { useState } from "react";
import currentDates from "../../Body/Date/currentDate";
import SearchExpenceTransaction from "./SearchExpenceTransaction";
import { Button, TextField } from "@mui/material";

function FormTogetExpTransaction() {
  const [InputValue, setInputValue] = useState("");
  // {(InputValue, toDate,fromDate,setshowEachItems),}
  const [showEachItems, setshowEachItems] = useState();
  const [Date, setDate] = useState({
    toDate: currentDates(),
    fromDate: currentDates(),
  });
  //    showTransaction: false,
  const [showTransaction, setShowTransaction] = useState(false);
  return (
    <div>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "white",
          width: "300px",
          padding: "30px 10px",
          margin: "20px 0",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setShowTransaction(true);
        }}
      >
        <h5>Form to search expences transaction by date</h5>
        <TextField
          type="date"
          label="from date"
          onChange={(e) => setDate({ ...Date, fromDate: e.target.value })}
          required
          fullWidth
          name="fromDate"
          value={Date.fromDate}
        />{" "}
        <TextField
          type="date"
          label="to date"
          onChange={(e) => setDate({ ...Date, toDate: e.target.value })}
          required
          fullWidth
          name="toDate"
          value={Date.toDate}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      {showTransaction && (
        <SearchExpenceTransaction
          InputValue={InputValue}
          toDate={Date.toDate}
          fromDate={Date.fromDate}
          setshowEachItems={setshowEachItems}
        />
      )}
    </div>
  );
}

export default FormTogetExpTransaction;
