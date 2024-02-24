import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

function CustomSnackbar({ open, message, type, onClose }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  const variant = type === "success" ? "success" : "error";
  const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <SnackbarContent
        sx={{
          backgroundColor: variant === "success" ? "green" : "red",
        }}
        message={
          <span style={{ display: "flex", alignItems: "center" }}>
            <Icon style={{ marginRight: "8px" }} />
            <span> {message}</span>
          </span>
        }
      />
    </Snackbar>
  );
}

export default CustomSnackbar;
