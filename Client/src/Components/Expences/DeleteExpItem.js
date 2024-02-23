import React, { useState } from "react";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ButtonProcessing } from "../Utilities/Utility";

function DeleteExpItem({ data }) {
  const token = localStorage.getItem("storeToken");
  const businessId = localStorage.getItem("businessId");
  const businessName = localStorage.getItem("businessName");
  const serverAddress = localStorage.getItem("targetUrl");
  const {
    openDeletingModal,
    setopenDeletingModal,
    getExpencesLists,
    setSuccessError,
  } = data;
  const [userPassword, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // Submit password to server
      const response = await axios.post(serverAddress + "deleteExpenceItem", {
        userPassword,

        businessId,
        businessName,
        token,
        costsId: openDeletingModal.item.costsId,
      });
      // Check response from server
      if (response.data.data == "deleted") {
        // Password verification successful
        // Close the modal
        setSuccessError({ Message: "SUCCESS", Detail: response.data.data });
        setopenDeletingModal({ open: false });

        // Refresh expenses list
        getExpencesLists();
      } else {
        // Password verification failed
        setSuccessError({
          Message: "FAIL",
          Detail: "Incorrect password. Please try again.",
        });
      }
    } catch (error) {
      setProcessing(true);
      setSuccessError({
        Message: "FAIL",
        Detail: "Errors in deleting expenses. Please try again.",
      });
    }
  };

  const handleClose = () => {
    setopenDeletingModal({ open: false });
  };
  const [Processing, setProcessing] = useState(false);
  return (
    <div>
      <Modal open={openDeletingModal.open}>
        <Box
          sx={{
            maxWidth: 300,
            width: "80%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2>Confirm Deletion</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Password"
              type="password"
              value={userPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />

            {Processing ? (
              <ButtonProcessing />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Confirm Delete
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteExpItem;
