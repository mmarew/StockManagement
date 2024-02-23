import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchCostsCss from "../Costs/SearchCosts.module.css";
import { Button, LinearProgress, TableContainer } from "@mui/material";
import { ButtonProcessing } from "../Utilities/Utility";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";
import EditExpItem from "./EditExpItem";
import DeleteExpItem from "./DeleteExpItem";
import SuccessOrError from "../Body/Others/SuccessOrError";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { DateFormatter } from "../Body/Date/currentDate";
function SearchExpencesItem({
  setSearchTypeValueError,
  InputValue,
  proccessData,
}) {
  let { Processing, setProcessing } = proccessData;
  let Token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  let serverAddress = localStorage.getItem("targetUrl");

  const [openEditingModal, setopenEditingModal] = useState({ open: false });
  const [openDeletingModal, setopenDeletingModal] = useState({
    open: false,
    item: {},
  });

  const [MyCostData, setMyCostData] = useState([]);

  let getExpencesLists = async () => {
    try {
      setProcessing(true);
      const responce = await axios.get(serverAddress + "getexpencesLists", {
        params: {
          token: Token,
          businessId: businessId,
        },
      });
      setProcessing(false);
      let { data } = responce.data;

      if (data == `you are not owner of this business`) {
        setSuccessError({
          Message: `FAIL`,
          Detail: `you are not owner of this business`,
        });
        return setSearchTypeValueError(data);
      }
      if (data.length == 0) {
        setSearchTypeValueError("Expence items are not found");
        setSuccessError({
          Message: `FAIL`,
          Detail: `You haven't registered Expences`,
        });
      }
      setMyCostData(data);
    } catch (error) {
      setSuccessError({
        Message: `FAIL`,
        Detail: error.Message,
      });
    }
  };

  useEffect(() => {
    getExpencesLists();
  }, [, InputValue]);

  const [ShowSuccessError, setSuccessError] = useState({
    Message: "",
    Detail: "",
  });

  return (
    <div>
      {ShowSuccessError?.Message && (
        <SuccessOrError
          request={ShowSuccessError?.Detail}
          setErrors={setSuccessError}
        />
      )}
      {Processing && <LinearProgress />}
      {MyCostData?.length > 0 ? (
        <>
          <ExportToExcel data={MyCostData} target={"searchedExpences"} />
          <div className={SearchCostsCss?.costWrapperDiv}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cost Name</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MyCostData?.map((cost, index) => (
                    <TableRow
                      key={"costItem_" + index}
                      className={SearchCostsCss.eachCostItem}
                    >
                      <TableCell>{cost.costName}</TableCell>
                      <TableCell>
                        {DateFormatter(cost.expItemRegistrationDate)}
                      </TableCell>
                      <TableCell>
                        {!Processing ? (
                          localStorage.getItem("openedBusiness") ==
                            "myBusiness" && (
                            <div className={SearchCostsCss.editAndDelete}>
                              <Button
                                onClick={() => {
                                  setopenEditingModal({
                                    open: true,
                                    cost,
                                    index,
                                  });
                                }}
                                variant="outlined"
                              >
                                Edit
                              </Button>
                              &nbsp; &nbsp; &nbsp;
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() =>
                                  setopenDeletingModal({
                                    open: true,
                                    item: cost,
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          )
                        ) : (
                          <ButtonProcessing />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      ) : (
        !Processing && (
          <div style={{ color: "red", padding: "20px 0" }}>
            No Expences data found
          </div>
        )
      )}
      {openDeletingModal.open && (
        <DeleteExpItem
          data={{
            setSuccessError,
            openDeletingModal,
            setopenDeletingModal,
            getExpencesLists,
          }}
        />
      )}
      {openEditingModal.open && (
        <EditExpItem
          data={{
            openEditingModal,
            setopenEditingModal,
            getExpencesLists,
            setSuccessError,
          }}
        />
      )}
    </div>
  );
}
export default SearchExpencesItem;
