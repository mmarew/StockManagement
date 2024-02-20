import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchCostsCss from "../Costs/SearchCosts.module.css";
import { Button, LinearProgress } from "@mui/material";
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
        return setSearchTypeValueError(data);
      }
      if (data.length == 0) {
        setSearchTypeValueError("Expence items are not found");
      }
      setMyCostData(data);
    } catch (error) {
      console.log("error", error);
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
      {ShowSuccessError.Message && (
        <SuccessOrError
          request={ShowSuccessError.Detail}
          setErrors={setSuccessError}
        />
      )}
      {Processing && <LinearProgress />}
      {MyCostData?.length > 0 && (
        <>
          <ExportToExcel data={MyCostData} target={"searchedExpences"} />
          <div className={SearchCostsCss.costWrapperDiv}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cost Name</TableCell>
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
                      {!Processing ? (
                        <div className={SearchCostsCss.editAndDelete}>
                          <Button
                            onClick={() => {
                              setopenEditingModal({ open: true, cost, index });
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
                      ) : (
                        <ButtonProcessing />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
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
