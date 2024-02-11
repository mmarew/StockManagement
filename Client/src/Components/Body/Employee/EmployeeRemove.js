import React, { useState } from "react";
import { Button, Modal, Backdrop, Fade } from "@mui/material";
import { TextField } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import SuccessOrError from "../Others/SuccessOrError";

// Define custom styles for the modal

const MyModal = ({ removeModal, employeeId, getBusinessEmployee }) => {
  const [open, setOpen] = useState(false);
  const [Errors, setErrors] = useState();
  // Function to handle opening the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setOpen(false);
    removeModal({ open: false });
  };
  let serverAddress = localStorage.getItem("targetUrl");
  useEffect(() => {
    handleOpen();
  }, []);
  const [Processing, setProcessing] = useState(false);
  const [userPassword, setPasswords] = useState("");
  const [ShowSuccess, setShowSuccess] = useState(false);
  let RemoveThisEmployee = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      let response = await axios.post(serverAddress + "removeEmployees/", {
        employeeId,
        token: localStorage.getItem("storeToken"),
        userPassword,
      });

      getBusinessEmployee();
      // to wait toast messages
      setTimeout(() => {
        handleClose();
      }, 2000);

      // console.log("items is ");
      // console.log(response.data);
      if (response.data.Status == "deleted") {
        setShowSuccess(true);
        setErrors("");
      } else {
        setErrors(response.data.data);
      }
    } catch (error) {
      // handleClose();
      setProcessing(false);
      setShowSuccess(false);
      setErrors(error.message);
      console.log("error", error);
    }
  };
  return (
    <div>
      {Errors && <SuccessOrError setErrors={setErrors} request={Errors} />}
      {ShowSuccess && (
        <SuccessOrError
          request="Employee Removed Successfully"
          setErrors={setShowSuccess}
        />
      )}
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {/* Content of the modal */}
        <Fade in={open}>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <h2 style={{ color: "red" }}>Caution</h2>
            <p>Please enter password to remove employee.</p>
            <br />
            <form onSubmit={RemoveThisEmployee}>
              <TextField
                required
                fullWidth
                onChange={(e) => setPasswords(e.target.value)}
                type="password"
              />
              <br />
              <br />
              {Processing ? (
                <Button disabled>Processing</Button>
              ) : (
                <>
                  <Button
                    style={{ marginRight: "10px" }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </>
              )}
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default MyModal;
