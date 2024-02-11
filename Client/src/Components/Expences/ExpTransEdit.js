import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Modal, Button } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
function ExpTransEdit({
  EditExpences,
  setEditExpences,
  getExpencesTransaction,
}) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  console.log("EditExpences", EditExpences);
  const [Processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    ...EditExpences.item,
    token,
    businessId,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...EditExpences.item,
      ...prev,
    }));
  }, [EditExpences]);

  let serverAddress = localStorage.getItem("targetUrl");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    let Res = await axios.post(
      serverAddress + "Expences/updateMyexpencesList",
      { ...formData }
    );
    setEditExpences({ Open: false });
    setProcessing(false);
    console.log("Res", Res.data.data);
    getExpencesTransaction();
    // Perform form submission or other logic here
    console.log("Form Data:", formData);
    if (Res.data.data == "updated") {
      alert("updated");
    } else {
      alert("error on update");
    }
  };

  return (
    <Modal open={EditExpences.Open}>
      <Box
        sx={{
          padding: "30px",
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        {" "}
        <h3>Edition Form To Expences</h3>
        <br />
        <form
          style={{ width: "300px", margin: "auto" }}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            type="number"
            label="Cost Amount"
            name="costAmount"
            value={formData.costAmount}
            onChange={handleChange}
          />
          <br />
          <br />
          <TextField
            fullWidth
            type="text"
            label="Cost Descriptions"
            name="costDescription"
            value={formData.costDescription}
            onChange={handleChange}
          />
          <br />
          <br />
          {!Processing ? (
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>{" "}
              <Button
                style={{ backgroundColor: "brown", color: "white" }}
                onClick={() => {
                  setEditExpences({ Open: false });
                }}
                variant="contained"
              >
                Close
              </Button>
            </Box>
          ) : (
            <ButtonProcessing />
          )}
        </form>
      </Box>
    </Modal>
  );
}
export default ExpTransEdit;
