import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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
        let x = await UpdateBusinesssName(
          businessId,
          setShowProgressBar,
          setcreatedBusiness,
          createdBusiness
        );
        let { getBusiness } = targetdBusiness;
        getBusiness();
      } else if (Action == "RemoveEmployerBusiness") {
        console.log("targetdBusiness", targetdBusiness);
        const { ownerId, getBusiness } = targetdBusiness;
        let responce = await RemoveMyEmployeersBusiness(
          businessId,
          ownerId,
          businessName,
          getBusiness
        );
        if (responce.data.data == "NoDataLikeThis") {
          console.log("nodata");
          getBusiness();
          return;
        }
        let affectedRows = responce.data.data[0].affectedRows;
        console.log("affectedRows ==", affectedRows);
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
