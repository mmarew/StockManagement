import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TextField,
} from "@mui/material";

import axios from "axios";
import { DateFormatter } from "../Body/Date/currentDate";
import CurrencyFormatter from "../Utilities/Utility";

const GetCreditListEdit = ({
  showCreditListDetails,
  setshowCreditListDetails,
  getUsersCreditList,
}) => {
  let openedBusiness = localStorage.getItem("openedBusiness");
  let { salesWay } = showCreditListDetails;
  // return;
  let targetedTransactionId = showCreditListDetails.transactionId;
  let { dailySalesId, transactionId } = showCreditListDetails.data;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [partiallyPaidInfo, setpartiallyPaiedInfo] = useState([]);
  const [rermoveByindex, setRermoveByindex] = useState([]);
  useEffect(() => {
    // targetedTransactionI;
    let { data } = showCreditListDetails;
    data.map((d) => {
      if (targetedTransactionId == d.transactionId) {
        setpartiallyPaiedInfo((Prev) => {
          return [...Prev, d];
        });
      }
    });
  }, []);
  const [DeletableInfo, setDeletableInfo] = useState([]);
  let deleteCreditPaymentInfo = (info, index) => {
    setDeletableInfo((prev) => {
      return [...prev, info];
    });
    partiallyPaidInfo.splice(index, 1);
    setpartiallyPaiedInfo(partiallyPaidInfo);

    setConfirmDeletion({ open: true, data: rermoveByindex });
  };
  const [ConfirmDeletion, setConfirmDeletion] = useState({
    open: false,
    data: {},
  });
  const [userPassword, setuserPassword] = useState("");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let confirmDeletionofPartiallyPaiedInfo = async (e) => {
    e.preventDefault();
    setProcessing(true);
    let Result = await axios.post(serverAddress + "updatePartiallyPaidInfo", {
      data: partiallyPaidInfo,
      businessName,
      token,
      DeletableInfo,
      dailySalesId,
      transactionId,
      salesWay,
      userPassword,
    });
    setProcessing(false);
    setshowCreditListDetails((prev) => {
      return { ...prev, open: false };
    });
    getUsersCreditList();
  };
  const [Processing, setProcessing] = useState(false);
  return (
    <div>
      <Modal open={showCreditListDetails.open} onClose={handleClose}>
        <Paper
          sx={{
            padding: "20px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          {partiallyPaidInfo?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Collected Amount</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {partiallyPaidInfo?.map((info, id) => (
                    <TableRow key={"partiallyPaidInfo" + id}>
                      <TableCell>
                        {CurrencyFormatter(info.collectionAmount)}
                      </TableCell>
                      <TableCell>
                        {DateFormatter(info.collectionDate)}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={
                            openedBusiness == "employersBusiness" ? true : false
                          }
                          onClick={() => deleteCreditPaymentInfo(info, id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>
              {!ConfirmDeletion.open && (
                <>
                  <center>No credit payment data found</center>
                  <br />
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      setshowCreditListDetails((prev) => {
                        return { ...prev, open: false };
                      });
                    }}
                  >
                    Close
                  </Button>
                </>
              )}
            </>
          )}
          {ConfirmDeletion.open && (
            <Box
              sx={{
                margin: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <>
                <form onSubmit={confirmDeletionofPartiallyPaiedInfo}>
                  <h4 style={{ color: "red", marginBottom: "10px" }}>
                    Are you sure you want to delete this payment? If so please
                    type your password to confirm.{" "}
                  </h4>
                  <TextField
                    onChange={(e) => setuserPassword(e.target.value)}
                    name="userPassword"
                    label="Password"
                    type="password"
                    required
                    fullWidth
                  />
                  <br /> <br />
                  {!Processing ? (
                    <>
                      <Button
                        type="submit"
                        sx={{ marginRight: "10px" }}
                        variant="contained"
                        color="error"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          setshowCreditListDetails((prev) => {
                            return { ...prev, open: false };
                          });
                        }}
                      >
                        Close
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button>Processing</Button>
                    </>
                  )}
                </form>
              </>
            </Box>
          )}
        </Paper>
      </Modal>
    </div>
  );
};

export default GetCreditListEdit;
