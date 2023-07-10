import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
function ConfirmDialog(props) {
  const [open, setOpen] = useState(props.open);
  const handleClose = () => {
    props.setShowConfirmDialog(false);
  };
  const handleConfirm = () => {
    props.setShowConfirmDialog(false);
    props.setConfirmDeletePurchaseAndSales((prevState) => {
      return { ...prevState, Delete: true };
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
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
