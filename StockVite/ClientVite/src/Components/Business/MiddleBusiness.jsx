import React, { useEffect, useState } from "react";
import Businessmodulecss from "../../CSS/Business.module.css";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import ModalToEditBusinessName from "../Business/ModalToEditBusinessName";

import ModalToDeleteBusiness from "../Business/ModalToDeleteBusiness";
import { Button, Grid, LinearProgress, Paper, TextField } from "@mui/material";
import CreateBusiness from "./CreateBusiness";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import css
import { DateFormatter } from "../Body/Date/currentDate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModalToRemoveEmployerBusiness from "./ModalToRemoveEmployerBusiness";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SuccessOrError from "../Body/Others/SuccessOrError";
function MiddleBusiness({}) {
  let ModalData = {
    Open: false,
    datas: {},
  };
  const [openBusinessEditingModal, setopenBusinessEditingModal] =
    useState(ModalData);
  const [openBusinessDeletingModal, setopenBusinessDeletingModal] =
    useState(ModalData);
  const [RemoveEmployerBusiness, setRemoveEmployerBusiness] =
    useState(ModalData);

  let serverAddress = localStorage.getItem("targetUrl");

  let token = localStorage.getItem("storeToken");

  const [employeerBusiness, setemployeerBusiness] = useState([]);

  const [EditedBusinessName, setEditedBusinessName] = useState(null);
  let Navigate = useNavigate();
  let getBusiness = async () => {
    try {
      setShowProgressBar(true);
      setcreatedBusiness([]);
      setemployeerBusiness([]);
      if (!token || token == "undefined") {
        return Navigate("/login");
      }
      let results = await axios.post(`${serverAddress}business/getBusiness`, {
        token,
      });

      setShowProgressBar(false);

      if (results.data.data == "You haven't loged in before.") {
        Navigate("/login");
      }
      if (
        results.data.myBusiness?.length == 0 &&
        results.data.employeerBusiness?.length == 0
      ) {
        setBusinessListsInfo(
          <h3 className={Businessmodulecss.noBusinessMessage}>
            You havn't created business or no business is allowed to be
            administered by you
          </h3>
        );
        return;
      }
      if (results.data.myBusiness == "") {
      } else {
        setBusinessListsInfo("");
        setcreatedBusiness(results.data.myBusiness);
      }
      if (results.data.employeerBusiness == "") {
      } else {
        setBusinessListsInfo("");
        setemployeerBusiness(results.data.employeerBusiness);
      }
      setgetBusinessErrors("");
    } catch (error) {
      setRequestFailOrSuccess(() => ({
        ...requestFailOrSuccess,
        Responce: "FAIL",
        Message: error.message,
      }));
      setgetBusinessErrors(error.message);
      setShowProgressBar(false);
      setBusinessListsInfo("");
    }
  };
  let openEmployeerBusiness = (businessID, ownersId, businessName) => {
    localStorage.setItem("businessId", businessID);
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("businessOwnreId", ownersId);
    localStorage.setItem("openedBusiness", "employersBusiness");
    Navigate("/OpenBusiness");
  };
  let openThisBusiness = (businessId, businessName) => {
    try {
      localStorage.setItem("businessId", businessId);
      localStorage.setItem("businessName", businessName);
      localStorage.setItem("openedBusiness", "myBusiness");
      Navigate("/OpenBusiness");
    } catch (error) {
      alert("unable to open business");
    }
  };
  const [businessListsInfo, setBusinessListsInfo] = useState(
    <h4>Looking for your business lists .... </h4>
  );
  const [getBusinessErrors, setgetBusinessErrors] = useState(null);
  let [createdBusiness, setcreatedBusiness] = useState([]);
  const [requestFailOrSuccess, setRequestFailOrSuccess] = useState({
    Responce: "",
    Message: "",
  });
  const [newBusiness, setnewBusiness] = useState({ Open: false });
  const { ownersName, ShowProgressBar, setShowProgressBar } =
    ConsumeableContext();
  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <div>
      {requestFailOrSuccess?.Responce && (
        <SuccessOrError
          request={
            requestFailOrSuccess.Responce === "SUCCESS"
              ? "SUCCESS"
              : requestFailOrSuccess.Message
          }
          setErrors={setRequestFailOrSuccess}
        />
      )}
      <div className={Businessmodulecss.MiddelSideBusinessWrapper}>
        <div className={Businessmodulecss.BusinessWrapper}>
          {ownersName != "" ? (
            <>
              <br />
              <h4 className={Businessmodulecss.welcomeMessage}>
                Hello {ownersName} , welcome to Smart Stock management system
              </h4>
            </>
          ) : (
            <h4 className={Businessmodulecss.welcomeMessage}>
              Hello User , welcome to Smart Stock management system
            </h4>
          )}
          <div>
            <p className={Businessmodulecss.welcomeMessage}>
              Today is {new Date().toDateString()}
            </p>
            <br />
          </div>
          <Button
            variant="contained"
            onClick={() => {
              setnewBusiness({ Open: true });
            }}
            className={Businessmodulecss.createBusiness}
          >
            Add
          </Button>
          <br />
          {ShowProgressBar && <LinearProgress />}
          {newBusiness.Open && (
            <CreateBusiness
              setRequestFailOrSuccess={setRequestFailOrSuccess}
              getBusiness={getBusiness}
              setnewBusiness={setnewBusiness}
              newBusiness={newBusiness}
            />
          )}
          {getBusinessErrors && (
            <div style={{ color: "red", padding: "10px" }}>
              {getBusinessErrors}
            </div>
          )}
          <div>
            {businessListsInfo}
            <Grid spacing={1} container>
              {createdBusiness?.map((datas) => {
                return (
                  <Grid sx={{ maxWidth: "350px" }} item key={datas.BusinessID}>
                    <Paper sx={{ p: 2 }}>
                      <h4>{datas.BusinessName}</h4>
                      <div
                        style={{
                          fontSize: "12px",
                          padding: "10px 0",
                        }}
                      >
                        Created on {DateFormatter(datas.createdDate)}
                      </div>

                      <div className={Businessmodulecss.businessButton}>
                        <Button
                          onClick={() =>
                            openThisBusiness(
                              datas.BusinessID,
                              datas.BusinessName
                            )
                          }
                          variant="outlined"
                          size="small"
                          startIcon={<OpenInNewIcon />}
                        >
                          OPEN
                        </Button>
                        <Button
                          size="small"
                          sx={{
                            margin: "0 5px",
                          }}
                          onClick={() =>
                            setopenBusinessEditingModal({
                              Open: true,
                              datas,
                            })
                          }
                          variant="outlined"
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          color="error"
                          size="small"
                          id=""
                          onClick={(event) => {
                            event.preventDefault();

                            setopenBusinessDeletingModal(() => {
                              return {
                                ...openBusinessDeletingModal,
                                Open: true,
                                datas: {
                                  businessId: datas.BusinessID,
                                  businessName: datas.BusinessName,
                                  getBusiness,
                                  setBusinessListsInfo,
                                },
                              };
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                      <div
                        id={"businessWrapper_" + datas.BusinessID}
                        className={Businessmodulecss.updateWrapper}
                      >
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (
                              EditedBusinessName == datas.BusinessName ||
                              !EditedBusinessName
                            ) {
                              alert("No Change On Business Name ");
                              return;
                            }
                          }}
                        >
                          <TextField
                            onChange={(e) => {
                              let pattern = /[^a-zA-Z0-9_]/;
                              if (pattern.test(e.target.value)) {
                                return;
                              } else {
                                setEditedBusinessName(e.target.value);
                              }
                            }}
                            id={"businessName_" + datas.BusinessID}
                            placeholder="Business name"
                            type="text"
                          />
                          <div
                            className={Businessmodulecss.updateCancelWrapper}
                            id={"updateCancelWrapper_" + datas.BusinessID}
                          >
                            <Button
                              size="small"
                              type="submit"
                              variant="contained"
                            >
                              Update
                            </Button>
                            <Button variant="contained" color="warning">
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    </Paper>
                  </Grid>
                );
              })}
              {
                <>
                  {employeerBusiness?.map((items) => {
                    return (
                      <div
                        key={"EmployyersBusiness_" + items.employeeId}
                        className={Businessmodulecss.Business}
                      >
                        <h4 style={{ textAlign: "center" }}>
                          {items.BusinessName}
                        </h4>
                        <div
                          style={{
                            fontSize: "12px",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          Created on {DateFormatter(items.createdDate)}
                        </div>
                        <div className={Businessmodulecss.businessButton}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              openEmployeerBusiness(
                                items.BusinessID,
                                items.ownerId,
                                items.BusinessName
                              );
                            }}
                            className=""
                          >
                            OPEN
                          </Button>
                          <Button
                            disabled
                            sx={{}}
                            variant="outlined"
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setRemoveEmployerBusiness({
                                Open: true,
                                getBusiness,
                                items,
                              });
                            }}
                            // open.targetdBusiness.getBusiness
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              }
            </Grid>
          </div>
        </div>
      </div>
      {openBusinessDeletingModal.Open && (
        <ModalToDeleteBusiness
          Data={{
            setRequestFailOrSuccess,
            getBusiness,
            openBusinessDeletingModal,
            setopenBusinessDeletingModal,
          }}
        />
      )}
      {openBusinessEditingModal.Open && (
        <ModalToEditBusinessName
          getBusiness={getBusiness}
          setopenBusinessEditingModal={setopenBusinessEditingModal}
          openBusinessEditingModal={openBusinessEditingModal}
        />
      )}
      {RemoveEmployerBusiness?.Open && (
        <ModalToRemoveEmployerBusiness
          data={{
            RemoveEmployerBusiness,
            setRemoveEmployerBusiness,
          }}
        />
      )}
    </div>
  );
}

export default MiddleBusiness;
