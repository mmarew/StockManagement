import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import $ from "jquery";
import DeleteBusiness from "../Business/DeleteBusiness";
import UpdateBusinesssName from "../Business/UpdateBusinesssName";
import { RemoveMyEmployeersBusiness } from "../Business/__Business";
function MUIConfirm({
  Action,
  open,
  setOpen,
  targetdBusiness,
  ShowSuccessError,
  setSuccessError,
  DialogMessage,
  setConfirmDelete,
  ConfirmDelete,
}) {
  // console.log(open, setOpen, targetdBusiness);
  // return;
  const handleClose = async (confirmed) => {
    setSuccessError({});
    let { businessId, businessName, getBusiness } = targetdBusiness;
    setOpen({ ...open, open: false });
    if (confirmed) {
      if (Action == "deleteProducts") {
        setConfirmDelete({ ...ConfirmDelete, Verify: true });
      } else if (Action == "deleteCosts") {
        setConfirmDelete({ ...ConfirmDelete, Verify: true });
      } else if (Action == "deleteBusiness") {
        // Handle confirmed action here
        let responce = await DeleteBusiness(
          businessId,
          businessName,
          getBusiness
        );
        console.log("responce = ", responce);
        if (responce == "deletedWell")
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: "SUCCESS",
          });
        else
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: "Fail",
          });
      } else if (Action == "updateBusinesssName") {
        const { setShowProgressBar, setcreatedBusiness, createdBusiness } =
          targetdBusiness;
        await UpdateBusinesssName(
          businessId,
          setShowProgressBar,
          setcreatedBusiness,
          createdBusiness
        );
      } else if (Action == "RemoveEmployerBusiness") {
        console.log("targetdBusiness", targetdBusiness);
        const { ownerId, getBusiness } = targetdBusiness;
        console.log(ownerId, "getBusiness=", getBusiness);
        // return;
        // BusinessID, ownerId, BusinessName, getBusiness;
        // return;
        let responce = await RemoveMyEmployeersBusiness(
          businessId,
          ownerId,
          businessName,
          getBusiness
        );
        console.log(
          "responce.data.data= ",
          responce,
          "getBusiness = ",
          getBusiness
        );
        // return;
        if (responce.data.data == "NoDataLikeThis") {
          console.log("nodata");
          getBusiness();
          return;
        }
        let affectedRows = responce.data.data.affectedRows;
        if (affectedRows > 0) {
          getBusiness();
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: "SUCCESS",
          });
        }
        console.log(responce);
      }
    }
    // setSuccessError({});
    // setOpen(false);
  };

  return (
    <div>
      <Dialog open={open?.open} onClose={() => handleClose(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {DialogMessage}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={() => handleClose(true)}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MUIConfirm;
