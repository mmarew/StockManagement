import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogActions } from "@mui/material";
function ConfirmDialog(props) {
  const [open, setOpen] = useState(props.open);
  const handleClose = () => {
    props.setShowConfirmDialog(false);
  };
  const handleConfirm = () => {
    props.setShowConfirmDialog(false);
    if (props.action == "deleteSalesPurchase") {
      props.onConfirm((prevState) => {
        return { ...prevState, Delete: true };
      });
    } else if (props.action == "updateSalesAndPurchaseData") {
      props.onConfirm((prevState) => {
        return { ...prevState, status: "Verified" };
      });
    } else if (props.action == "updateExpencesList") {
      props.onConfirm((prevState) => {
        return { ...prevState, updateStatus: "Confirmed" };
      });
    } else if (props.action == "deleteExpencesRecord") {
      //  deleteStatus: "notConfirmed",
      props.onConfirm((prevState) => {
        return { ...prevState, deleteStatus: "Confirmed" };
      });
    } else if (props.action == "addAsEmployee") {
      props.onConfirm((prevState) => {
        return { ...prevState, status: "Confirmed" };
      });
    } else if (props.action == "removeEmployee") {
      props.onConfirm((prevState) => {
        return { ...prevState, status: "Confirmed" };
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{props.message} </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;
