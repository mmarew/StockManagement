import { Box, Modal, TextField, Button } from "@mui/material";
import React from "react";
import DeleteBusiness from "./DeleteBusiness";
import { useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
function ModalToDeleteBusiness({ Data }) {
  let { openBusinessDeletingModal, setopenBusinessDeletingModal } = Data;
  let { datas, Open } = openBusinessDeletingModal;
  let { businessId, businessName, getBusiness, setBusinessLists } = datas;
  const [Proccessing, setProccessing] = useState(false);
  //   let { setOpen, setProccessing } = openBusinessDeletingModal;
  const [userPassword, setuserPassword] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  // Handle confirmed action here
  let callDeleteFnction = async (e) => {
    e.preventDefault();
    let responce = await DeleteBusiness({
      businessId,
      businessName,
      getBusiness,
      setProccessing,
      userPassword,
      setDeleteError,
      setopenBusinessDeletingModal,
    });
    if (responce == "") {
    }
  };

  return (
    <Modal open={Open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <form
          style={{ width: "300px", padding: "30px", backgroundColor: "white" }}
          onSubmit={callDeleteFnction}
        >
          <h4>Do you want to delete this Business?</h4>
          <div>Enter password here to confirm</div>
          <br />
          <TextField
            type="password"
            fullWidth
            required
            onChange={(e) => setuserPassword(e.target.value)}
          />
          {Proccessing ? (
            <ButtonProcessing />
          ) : (
            <div style={{ padding: "10px", textAlign: "center" }}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Button
                onClick={() =>
                  setopenBusinessDeletingModal({
                    ...openBusinessDeletingModal,
                    Open: false,
                  })
                }
                sx={{ marginLeft: "10px" }}
                variant="contained"
                color="warning"
                type="submit"
              >
                Cancel
              </Button>
            </div>
          )}

          {deleteError && <div style={{ color: "red" }}>{deleteError}</div>}
        </form>
      </Box>
    </Modal>
  );
}

export default ModalToDeleteBusiness;
