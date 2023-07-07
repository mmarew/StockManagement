import React, { useEffect, useState } from "react";
import $, { each } from "jquery";
import axios from "axios";
import {
  Button,
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
      CostValue_ = $("#CostValue_" + id).val(),
      costsId = cost.costsId;

    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "/updateCostData/", {
      CostName_,
      CostValue_,
      costsId,
      Token,
      businessName,
    });

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
    $(".btnUpdateCost").hide();
    $("#CostUpdate_" + index).show();
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
          <TableContainer className="">
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
          </TableContainer>
          {open.open && ConfirmRequest}
        </div>
      )}
    </div>
  );
}

export default SearchCosts;
