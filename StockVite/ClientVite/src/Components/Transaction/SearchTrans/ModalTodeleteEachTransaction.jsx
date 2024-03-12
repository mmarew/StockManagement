import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import SuccessOrError from "../../Body/Others/SuccessOrError";
function ModalTodeleteEachTransaction({
  getDailyTransaction,
  ShowDeleteConfirmationModal,
  setShowDeleteConfirmationModal,
}) {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  const [Processing, setProcessing] = useState(false);
  const [userPassword, setUserPasswords] = useState(null);
  const [Errors, setErrors] = useState(null);
  const deleteDailyTransaction = async (items) => {
    try {
      items.token = token;
      setProcessing(true);
      const response = await axios.post(
        serverAddress + "Transaction/deleteDailyTransaction",
        { ...items, userPassword }
      );
      setProcessing(false);
      setShowDeleteConfirmationModal({
        open: false,
        Items: {},
      });
      const { data } = response.data;
      await getDailyTransaction(items.ProductId);
      if (data === "success") {
        setErrors("You have deleted data successfully");
      } else {
        setErrors("Unknown error");
      }
      setErrors(null);
    } catch (error) {
      setProcessing(false);
      setErrors(error.message);
    }
  };
  return (
    <Dialog
      open={ShowDeleteConfirmationModal.open}
      onClose={() => {
        setShowDeleteConfirmationModal({ open: false, Items: {} });
      }}
    >
      {Errors && <SuccessOrError setErrors={setErrors} request={Errors} />}
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this item?
          <form
            onSubmit={(e) => {
              e.preventDefault();

              deleteDailyTransaction(ShowDeleteConfirmationModal.Items);
            }}
          >
            <label>Please Enter password bellow</label>
            <TextField
              value={userPassword}
              name="userPassword"
              onChange={(e) => {
                setUserPasswords(e.target.value);
                setErrors(null);
              }}
              required
              fullWidth
              type="password"
            />
            <DialogActions>
              {Processing ? (
                <Button disabled>Processing</Button>
              ) : (
                <>
                  <Button type="submit" color="error">
                    Delete
                  </Button>{" "}
                  <Button
                    onClick={() =>
                      setShowDeleteConfirmationModal({
                        open: false,
                        Items: {},
                      })
                    }
                  >
                    Cancel
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default ModalTodeleteEachTransaction;
