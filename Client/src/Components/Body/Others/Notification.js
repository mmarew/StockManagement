import React from "react";
import { Snackbar, SnackbarContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

function CustomSnackbar(props) {
  const classes = useStyles();

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
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent
        className={classes[variant]}
        message={
          <span className={classes.message}>
            <Icon className={classes.icon} />
            {message}
          </span>
        }
      />
    </Snackbar>
  );
}

export default CustomSnackbar;
