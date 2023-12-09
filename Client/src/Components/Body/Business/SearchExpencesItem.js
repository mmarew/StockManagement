import React, { useEffect, useState } from "react";
import $, { each } from "jquery";
import axios from "axios";
import SearchCostsCss from "./SearchCosts.module.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import MUIConfirm from "../Others/MUIConfirm";
import { ConsumeableContext } from "../UserContext/UserContext";
import { ButtonProcessing } from "../../utility/Utility";
import ExportToExcel from "../../../PDF_EXCEL/PDF_EXCEL";
function SearchExpencesItem({ setSearchTypeValueError, InputValue }) {
  const { Proccessing, setProccessing } = ConsumeableContext();
  let Token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");

  const [ConfirmRequest, setConfirmRequest] = useState({});
  const [ConfirmDelete, setConfirmDelete] = useState({});
  const [costName, setcostName] = useState("");
  const [openEditingModal, setopenEditingModal] = useState({ open: false });
  let openCostEditerModal = (cost, index) => {
    console.log("cost");
    setopenEditingModal({ open: true, cost, index });
  };
  let handleClose = () => {
    console.log("close");
    setopenEditingModal({ open: false });
  };
  useEffect(() => {
    console.log("ConfirmDelete == ", ConfirmDelete);

    let deleteMyExpItems = async () => {
      let { item } = ConfirmDelete;
      item.businessId = businessId;
      item.token = Token;
      let data = MyCostData.map((d) => d);
      let index = data.indexOf(item);
      if (index >= 0) data.splice(index, 1);
      item.userPassword = ConfirmDelete.userPassword;
      setProccessing(true);
      let responce = await axios.post(
        serverAddress + "deleteExpenceItem/",
        item
      );
      setProccessing(false);
      setOpen({ ...open, open: false });
      if (
        responce.data.data == "Please make logout and login again." ||
        responce.data.data == "Wrong Password"
      ) {
        return alert(responce.data.data);
      } else if (responce.data.data == "deleted") {
        setMyCostData(data);
        setOpen({ ...open, open: false });
        alert("your data is deleted");
      } else {
        alert("Error on deleting exp items");
      }
    };
    if (ConfirmDelete.Verify) {
      deleteMyExpItems();
    }
  }, [ConfirmDelete]);

  const [MyCostData, setMyCostData] = useState([]);

  let getExpencesLists = async () => {
    // setMyCostData(response.data.data);
    const responce = await axios.get(serverAddress + "getexpencesLists", {
      params: {
        token: Token,
        businessId: businessId,
      },
    });
    let { data } = responce.data;

    if (data == `you are not owner of this business`) {
      // alert(data);
      return setSearchTypeValueError(data);
    }
    if (data.length == 0) {
      return setSearchTypeValueError("Expence items are not found");
    }
    console.log("@getexpencesLists", data);
    setMyCostData(data);
  };

  let updateMycostData = async (e, id, cost) => {
    let CostName_ = $("#CostName_" + id).val(),
      costsId = cost.costsId;
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "/updateCostData/", {
      CostName_,
      costsId,
      token: Token,
      businessName,
      businessId,
    });
    let costData = MyCostData.map((cost1, i) => {
      if (i == id) {
        cost1.updateStatus = false;
        cost.costName = costName;
      }
      return cost1;
    });
    setopenEditingModal({ open: false });
    setMyCostData(costData);
    $(".LinearProgress").css("display", "none");
    if (responce.data.data == "updated successfully") {
      alert(`your data is updated. Thank you.`);
    }
    $(".btnUpdateCost").hide();
  };
  useEffect(() => {
    getExpencesLists();
  }, [, InputValue]);
  useEffect(() => {
    MyCostData.map((cost) => {
      console.log(cost);
      let CostName_ = `CostName_${MyCostData.indexOf(cost)}`;
      $("#" + CostName_).val(cost.costName);
    });
    $(".btnUpdateCost").hide();
  }, [MyCostData]);

  let costInputEdits = (e, index, id) => {
    setcostName(e.target.value);
  };

  const [ShowSuccessError, setSuccessError] = useState({});
  const [open, setOpen] = useState({});
  useEffect(() => {
    setConfirmRequest();
  }, [open]);

  let deleteExptems = async (e, item) => {
    if (item) item.businessName = businessName;
    item.token = Token;
    setConfirmDelete({ ...ConfirmDelete, item, Verify: false });
    setTimeout(() => {
      setOpen({ open: true });
    }, 0);
  };
  return (
    <div>
      {MyCostData?.length > 0 && (
        <>
          <ExportToExcel data={MyCostData} target={"searchedExpences"} />
          <div className={SearchCostsCss.costWrapperDiv}>
            {MyCostData?.map((cost, index) => {
              return (
                <div
                  key={"costItem_" + index}
                  className={SearchCostsCss.eachCostItem}
                >
                  <div>{cost.costName}</div>
                  {!Proccessing ? (
                    <div className={SearchCostsCss.editAndDelete}>
                      <Button
                        onClick={() => {
                          setcostName(cost.costName);
                          openCostEditerModal(cost, index);
                        }}
                        variant="outlined"
                      >
                        Edit
                      </Button>
                      &nbsp; &nbsp; &nbsp;
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={(e) => deleteExptems(e, cost)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <ButtonProcessing />
                  )}
                </div>
              );
            })}

            {open.open && (
              <MUIConfirm
                ConfirmDelete={ConfirmDelete}
                setConfirmDelete={setConfirmDelete}
                DialogMessage={" delete this cost "}
                Action="deleteCosts"
                ShowSuccessError={ShowSuccessError}
                setSuccessError={setSuccessError}
                open={open}
                setOpen={setOpen}
                targetdBusiness={{
                  businessId,
                  businessName,
                }}
              />
            )}
            <Modal open={openEditingModal.open}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  maxWidth: 400,
                  bgcolor: "background.paper",
                  p: 2,
                }}
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <br />
                <br />
                <h3>Edition form to expences</h3>
                <br />
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "90%",
                    margin: "auto",
                  }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <TextField
                    value={costName}
                    onInput={(e) =>
                      costInputEdits(
                        e,
                        openEditingModal.index,
                        `CostName_${openEditingModal.index}`
                      )
                    }
                    type="text"
                    id={`CostName_${openEditingModal.index}`}
                  />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) =>
                      updateMycostData(
                        e,
                        openEditingModal.index,
                        openEditingModal.cost
                      )
                    }
                    className=""
                    id={`CostUpdate_${openEditingModal.index}`}
                  >
                    Update
                  </Button>
                </form>
              </Box>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}
export default SearchExpencesItem;
