import React, { useEffect, useState } from "react";
import $, { each } from "jquery";
import axios from "axios";
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
function SearchCosts({ response }) {
  const [ConfirmRequest, setConfirmRequest] = useState({});
  const [ConfirmDelete, setConfirmDelete] = useState({});
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
    if (ConfirmDelete.Verify) {
      let deleteMyCost = async () => {
        let { item } = ConfirmDelete;
        console.log("response = ", response.data.data);
        // return;
        let data = MyCostData.map((d) => d);
        let index = data.indexOf(item);
        console.log("index" + index, "item = ", item);
        console.log("before splices data = ", data);
        if (index >= 0) data.splice(index, 1);
        console.log("after splices data= ", data);
        $(".LinearProgress").css("display", "block");
        let responce = await axios.post(
          serverAddress + "deleteCostData/",
          item
        );
        $(".LinearProgress").css("display", "none");

        if (responce.data.data == "deleted") {
          setMyCostData(data);
          setOpen({ ...open, open: false });
          // setConfirmRequest({});
          alert("your data is deleted");
          console.log(data);
        }
      };
      deleteMyCost();
    }
  }, [ConfirmDelete]);

  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [MyCostData, setMyCostData] = useState([]);
  let getCostLists = async () => {
    setMyCostData(response.data.data);
  };
  let Token = localStorage.getItem("storeToken");
  let updateMycostData = async (e, id, cost) => {
    let CostName_ = $("#CostName_" + id).val(),
      costsId = cost.costsId;
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "/updateCostData/", {
      CostName_,
      costsId,
      Token,
      businessName,
    });
    console.log("responce", responce);
    let costData = MyCostData.map((cost1, i) => {
      if (i == id) {
        cost1.updateStatus = false;
      }
      return cost1;
    });
    setMyCostData(costData);
    $(".LinearProgress").css("display", "none");
    if (responce.data.data == "updated successfully") {
      alert(`your data is updated. Thank you.`);
    }
    $(".btnUpdateCost").hide();
  };
  ////////////////
  useEffect(() => {
    getCostLists();
  }, []);
  useEffect(() => {
    // update costs
    MyCostData.map((cost) => {
      console.log(cost);
      let CostName_ = `CostName_${MyCostData.indexOf(cost)}`,
        CostValue_ = `CostValue_${MyCostData.indexOf(cost)}`;
      $("#" + CostValue_).val(cost.unitCost);
      $("#" + CostName_).val(cost.costName);
    });
    $(".btnUpdateCost").hide();
  }, [MyCostData]);

  let costInputEdits = (e, index, id) => {
    // $(".btnUpdateCost").hide();
    // $("#CostUpdate_" + index).show();
    let costData = MyCostData.map((cost, i) => {
      if (i == index) {
        cost.updateStatus = true;
        cost.costName = e.target.value;
      }
      return cost;
    });
    setMyCostData(costData);
  };

  const [ShowSuccessError, setSuccessError] = useState({});
  const [open, setOpen] = useState({});
  useEffect(() => {
    console.log("open is = ", open);
    console.log("ConfirmDelete", ConfirmDelete);
    // return;
    setConfirmRequest(
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
    );
  }, [open]);

  let deleteCostItem = async (e, item) => {
    if (item) item.businessName = businessName;
    item.Token = Token;
    setConfirmDelete({ ...ConfirmDelete, item, Verify: false });
    setTimeout(() => {
      setOpen({ open: true });
    }, 0);
    return;
  };
  return (
    <div>
      {console.log("MyCostData is ==", MyCostData)}
      {MyCostData?.length > 0 && (
        <div className="costWrapperDiv">
          {MyCostData?.map((cost, index) => {
            return (
              <div key={"costItem_" + index} className="eachCostItem">
                <div>{cost.costName}</div>
                <Button
                  onClick={() => openCostEditerModal(cost, index)}
                  variant="contained"
                >
                  Edit
                </Button>
                <Button color="error" variant="contained">
                  Delete
                </Button>
              </div>
            );
          })}
          {/* <TableContainer className="">
            <Table id="costTable">
              <TableHead>
                <TableRow>
                  <TableCell>Cost Name</TableCell>
                  <TableCell>Update / Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MyCostData?.map((cost, index) => {
                  return (
                    <TableRow key={"cost_" + index}>
                      <TableCell>
                        <TextField
                          onInput={(e) =>
                            costInputEdits(e, index, `CostName_${index}`)
                          }
                          type="text"
                          id={`CostName_${index}`}
                        />
                      </TableCell>
                      {cost.updateStatus && (
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => updateMycostData(e, index, cost)}
                            // className="btnUpdateCost CostUpdate_"
                            // id={`CostUpdate_${index}`}
                          >
                            Update
                          </Button>
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => deleteCostItem(e, cost)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer> */}
          {open.open && ConfirmRequest}
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
              <h3>Edition form to Costs</h3>
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
      )}
    </div>
  );
}

export default SearchCosts;
