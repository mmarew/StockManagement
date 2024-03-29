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
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { Box } from "@material-ui/core";
import axios from "axios";
import { DateFormatter } from "../Date/currentDate";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  modalContent: {
    padding: "16px",
    outline: "none",
    // backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[5],
    width: "400px",
    maxWidth: "90%",
    maxHeight: "90%",
    overflowY: "auto",
  },
  modalCloseButton: {
    marginTop: "16px",
  },
}));

const GetCreditListEdit = ({
  showCreditListDetails,
  setshowCreditListDetails,
  getUsersCreditList,
}) => {
  let openedBusiness = localStorage.getItem("openedBusiness");
  let { salesWay } = showCreditListDetails;
  console.log("salesWay", salesWay);
  console.log("showCreditListDetails.data", showCreditListDetails.data);
  // return;
  let targetedTransactionId = showCreditListDetails.transactionId;
  let { dailySalesId, transactionId } = showCreditListDetails.data;
  const classes = useStyles();
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
        console.log("d====", d.transactionId);
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
    // console.log("partiallyPaidInfo", partiallyPaidInfo);
    // let rermoveByindex = [...partiallyPaidInfo];
    partiallyPaidInfo.splice(index, 1);
    setpartiallyPaiedInfo(partiallyPaidInfo);

    setConfirmDeletion({ open: true, data: rermoveByindex });
  };
  const [ConfirmDeletion, setConfirmDeletion] = useState({
    open: false,
    data: {},
  });

  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let confirmDeletionofPartiallyPaiedInfo = async () => {
    console.log("ConfirmDeletion", ConfirmDeletion.data);
    // return;
    setProcessing(true);
    let Result = await axios.post(serverAddress + "updatePartiallyPaidInfo", {
      data: partiallyPaidInfo,
      businessName,
      token,
      DeletableInfo,
      dailySalesId,
      transactionId,
      salesWay,
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
      <Modal
        open={showCreditListDetails.open}
        onClose={handleClose}
        className={classes.modalContainer}
      >
        <Paper className={classes.modalContent}>
          {console.log("partiallyPaidInfo111111", partiallyPaidInfo)}
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
                      {console.log("info", info)}
                      <TableCell>{info.collectionAmount}</TableCell>
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
            <center>No credit payment data found</center>
          )}
          <Box
            sx={{
              margin: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {ConfirmDeletion.open && (
              <>
                {!Processing ? (
                  <Button
                    onClick={() => confirmDeletionofPartiallyPaiedInfo()}
                    sx={{ marginRight: "20px" }}
                    variant="contained"
                    color="error"
                  >
                    confirm delete Process
                  </Button>
                ) : (
                  <Button>Processing</Button>
                )}
              </>
            )}
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
          </Box>
        </Paper>
      </Modal>
    </div>
  );
};

export default GetCreditListEdit;
