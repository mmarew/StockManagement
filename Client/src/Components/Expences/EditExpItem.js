import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ButtonProcessing } from "../Utilities/Utility";

function EditExpItem({ data }) {
  let {
    openEditingModal,
    setopenEditingModal,
    getExpencesLists,
    setSuccessError,
  } = data;
  //   console.log("openEditingModal", openEditingModal);

  const token = localStorage.getItem("storeToken");
  const businessId = localStorage.getItem("businessId");
  const businessName = localStorage.getItem("businessName");
  const serverAddress = localStorage.getItem("targetUrl");

  const [costName, setCostName] = useState(openEditingModal.cost.costName);
  const [Processing, setProcessing] = useState(false);

  const updateMycostData = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      const response = await axios.post(`${serverAddress}/updateCostData/`, {
        costName,
        businessId,
        businessName,
        token,
        costsId: openEditingModal.cost.costsId,
      });
      setProcessing(false);
      handleClose();
      getExpencesLists();
      console.log("response", response.data);
      if (response.data.data === "updated successfully") {
        alert(`Your data is updated. Thank you.`);
      }
    } catch (error) {
      console.error("Error updating cost data:", error);
      alert(
        "An error occurred while updating cost data. Please try again later."
      );
    }
  };

  const handleClose = () => {
    setopenEditingModal({ open: false });
  };

  return (
    <div>
      <Modal open={openEditingModal.open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            bgcolor: "background.paper",
            p: 2,
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
          <br />
          <br />
          <h3>Edition form to expenses</h3>
          <br />
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              margin: "auto",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              value={costName}
              onChange={(e) => setCostName(e.target.value)}
              type="text"
            />
            <br />
            {Processing ? (
              <ButtonProcessing />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={updateMycostData}
              >
                Update
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default EditExpItem;
