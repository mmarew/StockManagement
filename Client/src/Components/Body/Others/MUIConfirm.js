import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import DeleteBusiness from "../Business/DeleteBusiness";
import UpdateBusinesssName from "../Business/UpdateBusinesssName";
import { RemoveMyEmployeersBusiness } from "../Business/__Business";
function MUIConfirm({
  Action,
  open,
  setOpen,
  targetdBusiness,
  ShowSuccessError,
  setSuccessError,
  DialogMessage,
  setConfirmDelete,
  ConfirmDelete,
}) {
  let [userPassword, setUserPassword] = useState();
  const handleClose = async (confirmed) => {
    setSuccessError({});
    let { businessId, businessName, getBusiness } = targetdBusiness;
    setOpen({ ...open, open: false });

    if (confirmed) {
      if (Action == "deleteProducts") {
        setConfirmDelete({ ...ConfirmDelete, Verify: true });
      } else if (Action == "deleteCosts") {
        setConfirmDelete({ ...ConfirmDelete, Verify: true });
      } else if (Action == "deleteBusiness") {
        // Handle confirmed action here
        let responce = await DeleteBusiness(
          businessId,
          businessName,
          getBusiness,
          userPassword
        );
        if (responce == "deletedWell")
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: "SUCCESS",
          });
        else
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: responce,
          });
      } else if (Action == "updateBusinesssName") {
        const { setShowProgressBar, setcreatedBusiness, createdBusiness } =
          targetdBusiness;
        let x = await UpdateBusinesssName(
          businessId,
          setShowProgressBar,
          setcreatedBusiness,
          createdBusiness
        );
        let { getBusiness } = targetdBusiness;
        getBusiness();
      } else if (Action == "RemoveEmployerBusiness") {
        console.log("targetdBusiness", targetdBusiness);
        const { ownerId, getBusiness } = targetdBusiness;
        let responce = await RemoveMyEmployeersBusiness(
          businessId,
          ownerId,
          businessName,
          getBusiness
        );
        if (responce.data.data == "NoDataLikeThis") {
          console.log("nodata");
          getBusiness();
          return;
        }
        let affectedRows = responce.data.data[0].affectedRows;
        console.log("affectedRows ==", affectedRows);
        if (affectedRows > 0) {
          getBusiness();
          setSuccessError({
            ...ShowSuccessError,
            show: true,
            message: "SUCCESS",
          });
        }
        console.log(responce);
      }
    }
    // setSuccessError({});
    // setOpen(false);
  };

  return (
    <div>
      <Dialog open={open?.open}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {DialogMessage}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <form
            style={{
              width: "80%",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleClose(true);
            }}
          >
            <TextField
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              fullWidth
              required
              label={"Enter Password to verify"}
            />
            <br />
            <div>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>
              &nbsp; &nbsp; &nbsp;
              <Button variant="contained" type="submit">
                Confirm
              </Button>
            </div>
            <br />
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MUIConfirm;
