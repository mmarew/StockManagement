import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ButtonProcessing } from "../Utilities/Utility";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { Select, MenuItem } from "@mui/material";
import AddExpencesTransaction from "../Transaction/AddTrans/AddExpTransaction";
import SearchExpenceTransaction from "../Transaction/SearchTrans/SearchExpenceTransaction";
import { fetchExpencesItemsFromServer } from "./GetExpencesLists";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
function App() {
  const [InputValue, setInputValue] = useState({});
  const [showEachItems, setshowEachItems] = useState();

  const [expencesList, setExpencesList] = useState([{}]);
  const [open, setopen] = useState();
  let { Processing } = ConsumeableContext();
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  const ReloadData = {
    Reload: false,
    Open: false,
    Rand: Math.random(),
  };
  const [GetSingleExpTransaction, setGetSingleExpTransaction] =
    useState(ReloadData);

  let handleSearch = () => {
    setGetSingleExpTransaction((prev) => ({
      ...prev,
      Reload: !prev.Reload,
      Open: !prev.Open,
    }));
  };
  useEffect(() => {
    fetchExpencesItemsFromServer().then((res) =>
      setExpencesList(res.data.data)
    );
  }, []);

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
          value={InputValue.transactionDate}
          onChange={(e) => {
            setGetSingleExpTransaction(ReloadData);
            setInputValue({ ...InputValue, [e.target.name]: e.target.value });
          }}
        />
        <Select
          required
          name="expenceItem"
          onChange={(e) => {
            setGetSingleExpTransaction(ReloadData);
            setInputValue({ ...InputValue, ...e.target.value });
          }}
        >
          {expencesList?.map((item, index) => (
            <MenuItem key={"index_" + index} value={item}>
              {item.costName}
            </MenuItem>
          ))}
        </Select>

        {Processing ? (
          <ButtonProcessing />
        ) : (
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        )}
      </form>

      {open && (
        <AddExpencesTransaction
          data={{
            RegisterableCots: expencesList,
            setopen,
            setErrorsOrSuccess,
            open,
          }}
        />
      )}
      {GetSingleExpTransaction.Open && GetSingleExpTransaction.Rand && (
        <>
          <SearchExpenceTransaction
            searchTarget="singleTransaction"
            InputValue={InputValue}
            toDate={InputValue.transactionDate}
            fromDate={InputValue.transactionDate}
            setshowEachItems={setshowEachItems}
          />
        </>
      )}
    </div>
  );
}

export default App;
