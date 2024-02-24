import React, { useEffect, useState } from "react";
import CustomSnackbar from "./Notification";

function SuccessOrError({ request, setErrors }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleSuccess = (event) => {
    // event.preventDefault();
    setOpen(true);
    setMessage("Success!");
    setType("success");
  };

  const handleError = (event) => {
    // event.preventDefault();
    setOpen(true);
    setMessage(request);
    setType("error");
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (request == "SUCCESS") {
      handleSuccess();
      return;
    }
    handleError();
    if (typeof setErrors == "function" && setErrors != undefined)
      setTimeout(() => {
        setErrors(null);
      }, 3000);
  }, [, request, setErrors]);

  return (
    <div>
      {open && (
        <CustomSnackbar
          open={open}
          message={message}
          type={type}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default SuccessOrError;
