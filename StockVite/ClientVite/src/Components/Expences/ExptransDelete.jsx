import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";

function ExptransDelete({
  DeleteConfirmation,
  setDeleteConfirmation,
  getExpencesTransaction,
  setErrorVsSuccess,
}) {
  const [Processing, setProcessing] = useState(false);
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  const [userPassword, setUserPassword] = useState(null);

  let deleteExpencesItem = async (e) => {
    e.preventDefault();
    try {
      let { item } = DeleteConfirmation;
      setProcessing(true);
      let responses = await axios.post(
        serverAddress + "Expences/deleteExpenceTransaction/",
        {
          ...item,
          businessId,
          token,
          userPassword,
        }
      );
      setProcessing(false);
      let { data } = responses.data;
      getExpencesTransaction();
      if (data == "Successfully deleted") {
        setDeleteConfirmation({ Open: false });
        setErrorVsSuccess("SUCCESS");
      }
      setErrorVsSuccess(data);
    } catch (error) {
      setProcessing(false);
      setErrorVsSuccess("Error on deleting");

    }
  };

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
          <Typography>
            Are you sure you want to delete this expence transaction?
          </Typography>
          <form
            onSubmit={deleteExpencesItem}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <TextField
              type="password"
              label="Password"
              onChange={(e) => setUserPassword(e.target.value)}
              name="userPassword"
              value={userPassword}
              required
            />
            {!Processing ? (
              <div style={{ textAlign: "center" }}>
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  type="submit"
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
              </div>
            ) : (
              <ButtonProcessing />
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ExptransDelete;
