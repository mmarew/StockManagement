import { Box, Button, Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";

function ExptransDelete({
  DeleteConfirmation,
  setDeleteConfirmation,
  getExpencesTransaction,
}) {
  const [Processing, setProcessing] = useState(false);
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  const [ConfirmDelete, setConfirmDelete] = useState(false);

  let deleteExpencesItem = async (items) => {
    setProcessing(true);
    let responses = await axios.post(
      serverAddress + "Expences/deleteExpencesItem",
      {
        ...items,
        businessId,
        token,
      }
    );
    setDeleteConfirmation({ Open: false });
    setProcessing(false);
    getExpencesTransaction();
  };

  useEffect(() => {
    if (ConfirmDelete) {
      deleteExpencesItem(DeleteConfirmation.item);
    }
  }, [ConfirmDelete]);

  return (
    <div>
      <Modal open={DeleteConfirmation.Open}>
        <Box
          sx={{
            padding: "30px",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography>Are you sure you want to delete this file?</Typography>

          {!Processing ? (
            <>
              <Button
                onClick={() => {
                  setConfirmDelete(true);
                }}
                variant="contained"
              >
                Confirm
              </Button>
              <Button
                onClick={() => {
                  setDeleteConfirmation(false);
                }}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
            </>
          ) : (
            <ButtonProcessing />
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ExptransDelete;
