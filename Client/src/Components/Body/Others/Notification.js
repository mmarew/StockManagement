import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

function CustomSnackbar(props) {
  const { open, message, type, onClose } = props;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  const variant = type === "success" ? "success" : "error";
  const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent
        message={
          <span>
            <Icon />
            {message}
          </span>
        }
      />
    </Snackbar>
  );
}

export default CustomSnackbar;
