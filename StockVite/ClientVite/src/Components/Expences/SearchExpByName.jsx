import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { ButtonProcessing } from "../Utilities/Utility";
import SuccessOrError from "../Body/Others/SuccessOrError";
import ErrorHandler from "../Utilities/ErrorHandler";
import currentDates from "../Body/Date/currentDate";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import AddExpencesTransaction from "../Transaction/AddTrans/AddExpTransaction";
import SearchExpenceTransaction from "../Transaction/SearchTrans/SearchExpenceTransaction";
function App() {
  const [InputValue, setInputValue] = useState("");
  const [showEachItems, setshowEachItems] = useState();

  const [RegisterableCots, setRegisterableCots] = useState([{}]);
  let serverAddress = localStorage.getItem("targetUrl");
  const businessId = localStorage.getItem("businessId");
  const token = localStorage.getItem("storeToken");
  const [open, setopen] = useState();
  const [searchData, setSearchData] = useState({
    expName: "",
    token,
    businessId,
    transactionDate: currentDates(),
  });
  const [searchResult, setSearchResult] = useState([]);
  const [Processing, setProcessing] = useState(false);
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  const [GetSingleExpTransaction, setGetSingleExpTransaction] = useState({
    Reload: false,
    Open: false,
    Rand: Math.random(),
  });
  const handleSearch = () => {
    // Send a request to the server using Axios
    setProcessing(true);
    axios
      .post(serverAddress + "searchExpByName", { ...searchData })
      .then((response) => {
        setSearchResult(response.data.data);
        setProcessing(false);
      })
      .catch((error) => {
        ErrorHandler(error, setErrorsOrSuccess);
        setProcessing(false);
      });
  };
  let handleInputChannges = (e) => {
    setSearchResult([]);
    setGetSingleExpTransaction((prev) => ({
      ...prev,
      Open: false,
    }));
    setSearchData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  let handleAddTransaction = (item) => {
    setopen(true);
    setRegisterableCots([item]);
  };

  let handleView = (input) => {
    setInputValue(input);

    setGetSingleExpTransaction((prev) => ({
      ...prev,
      Reload: !prev.Reload,
      Open: !prev.Open,
    }));
  };

  return (
    <div>
      {ErrorsOrSuccess.Message && (
        <SuccessOrError
          request={
            ErrorsOrSuccess.Message == "SUCCESS"
              ? "SUCCESS"
              : ErrorsOrSuccess.Detail
          }
          setErrors={setErrorsOrSuccess}
        />
      )}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "20px",
          margin: "10px",
          maxWidth: "300px",
          gap: "10px",
        }}
      >
        <h4>Search Expences</h4>

        <TextField
          required
          type="date"
          name="transactionDate"
          value={searchData.transactionDate}
          onChange={handleInputChannges}
        />
        <TextField
          required
          label="Expenses Name"
          variant="outlined"
          name="expName"
          value={searchData.expName}
          onChange={handleInputChannges}
        />
        {Processing ? (
          <ButtonProcessing />
        ) : (
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        )}
      </form>
      {searchResult?.length > 0 && (
        <div>
          <h2>Search Result:</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cost Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResult.map((item) => (
                <TableRow key={item.costsId}>
                  <TableCell>{item.costName}</TableCell>
                  <TableCell>
                    <Button
                      sx={{ mr: 1 }}
                      variant="contained"
                      onClick={() => handleAddTransaction(item)}
                    >
                      Add Transaction
                    </Button>
                    {!GetSingleExpTransaction.Open ? (
                      <Button
                        variant="contained"
                        onClick={() => handleView(item)}
                      >
                        View
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          setGetSingleExpTransaction({
                            ...GetSingleExpTransaction,
                            Open: false,
                          });
                        }}
                      >
                        Close
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
        </div>
      )}
      {open && (
        <AddExpencesTransaction
          data={{ RegisterableCots, setopen, setErrorsOrSuccess, open }}
        />
      )}
      {GetSingleExpTransaction.Open && GetSingleExpTransaction.Rand && (
        <>
          <SearchExpenceTransaction
            searchTarget="singleTransaction"
            InputValue={InputValue}
            toDate={searchData.transactionDate}
            fromDate={searchData.transactionDate}
            setshowEachItems={setshowEachItems}
          />
        </>
      )}
    </div>
  );
}

export default App;
