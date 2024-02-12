import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import css
import CreateBusiness from "../Components/Business/CreateBusiness";
import { useNavigate } from "react-router-dom";
import { Button, LinearProgress, TextField } from "@mui/material";
import Businessmodulecss from "./Business.module.css";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
import MUIConfirm from "../Components/Body/Others/MUIConfirm";
import SuccessOrError from "../Components/Body/Others/SuccessOrError";
import LeftSideBusiness from "../Components/LeftSide/LeftSideBusiness";
import ModalToEditBusinessName from "../Components/Business/ModalToEditBusinessName";
import { DateFormatter } from "../Components/Body/Date/currentDate";
import ModalToDeleteBusiness from "../Components/Business/ModalToDeleteBusiness";
import ModalToRemoveEmployerBusiness from "../Components/Business/ModalToRemoveEmployerBusiness";
let serverAddress = localStorage.getItem("targetUrl");
function Business() {
  // usestate data
  const [requestFailOrSuccess, setRequestFailOrSuccess] = useState({
    Responce: "",
    Message: "",
  });
  let ModalData = {
    Open: false,
    datas: {},
  };
  const [getBusinessErrors, setgetBusinessErrors] = useState(null);
  const [businessListsInfo, setBusinessListsInfo] = useState(
    <h4>Looking for your business lists .... </h4>
  );
  const [EditedBusinessName, setEditedBusinessName] = useState(null);
  const [ShowSuccessError, setSuccessError] = useState({});
  const [newBusiness, setnewBusiness] = useState({ Open: false });
  const [createdBusiness, setcreatedBusiness] = useState([]);
  const [employeerBusiness, setemployeerBusiness] = useState([]);
  const [ConfirmRequest, setConfirmRequest] = useState();
  const [open, setOpen] = useState({});

  const [openBusinessEditingModal, setopenBusinessEditingModal] =
    useState(ModalData);
  const [openBusinessDeletingModal, setopenBusinessDeletingModal] =
    useState(ModalData);
  const [RemoveEmployerBusiness, setRemoveEmployerBusiness] =
    useState(ModalData);
  /* Use states endes here*/
  const { ownersName, setownersName, ShowProgressBar, setShowProgressBar } =
    ConsumeableContext();
  let Navigate = useNavigate();
  let token = localStorage.getItem("storeToken");
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

  let openEmployeerBusiness = (businessID, ownersId, businessName) => {
    localStorage.setItem("businessId", businessID);
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("businessOwnreId", ownersId);
    localStorage.setItem("openedBusiness", "employersBusiness");
    Navigate("/OpenBusiness");
  };

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

  useEffect(() => {
    if (token.length < 5) {
      return Navigate("/login");
    }
  }, [Navigate]);

  useEffect(() => {
    getBusiness();
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  useEffect(() => {
    if (open.open) {
      const { businessId, businessName, getBusiness, setBusinessLists } =
        open.targetdBusiness;
      if (open.Action == "deleteBusiness") {
        setopenBusinessDeletingModal(() => {
          return {
            ...openBusinessDeletingModal,
            Open: true,
            datas: {
              businessId,
              businessName,
              getBusiness,
              setBusinessListsInfo,
            },
          };
        });
      }

      if (open.Action == "RemoveEmployerBusiness") {
        let { getBusiness } = open.targetdBusiness;
        setConfirmRequest(
          <MUIConfirm
            DialogMessage={" remove this business "}
            Action="RemoveEmployerBusiness"
            ShowSuccessError={ShowSuccessError}
            setSuccessError={setSuccessError}
            open={open}
            setOpen={setOpen}
            targetdBusiness={{
              ownerId: open.targetdBusiness.ownerId,
              businessId,
              businessName,
              getBusiness,
            }}
          />
        );
      }
    }
  }, [open]);

  return (
    <>
      {requestFailOrSuccess.Responce && (
        <SuccessOrError
          request={
            requestFailOrSuccess.Responce == "SUCCESS"
              ? "SUCCESS"
              : requestFailOrSuccess.Message
          }
          setErrors={setRequestFailOrSuccess}
        />
      )}
      {ShowProgressBar && <LinearProgress />}

      <div className={Businessmodulecss.MainBusinessWrapper}>
        {window.innerWidth > 768 && (
          <div className={Businessmodulecss.LeftSideBusinessWrapper}>
            <LeftSideBusiness />
          </div>
        )}
        <div className={Businessmodulecss.MiddelSideBusinessWrapper}>
          <div className={Businessmodulecss.BusinessWrapper}>
            {ownersName != "" ? (
              <>
                <br />
                <h4 className={Businessmodulecss.welcomeMessage}>
                  Hello {ownersName} , welcome to Smart Stock management system
                </h4>
                <br />
              </>
            ) : (
              <h4 className={Businessmodulecss.welcomeMessage}>
                Hello User , welcome to Smart Stock management system
              </h4>
            )}

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
            {newBusiness.Open && (
              <CreateBusiness
                setRequestFailOrSuccess={setRequestFailOrSuccess}
                ShowProgressBar={ShowProgressBar}
                setShowProgressBar={setShowProgressBar}
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
              <div className={Businessmodulecss.createdBusinessWrapper}>
                {createdBusiness?.map((datas) => {
                  return (
                    <div
                      key={datas.BusinessID}
                      className={Businessmodulecss.createdBusiness}
                    >
                      <div className={Businessmodulecss.Business}>
                        <h4 style={{ textAlign: "center" }}>
                          {datas.BusinessName}
                        </h4>
                        <div
                          style={{
                            fontSize: "12px",
                            padding: "10px",
                            textAlign: "center",
                          }}
                        >
                          Created on {DateFormatter(datas.createdDate)}
                        </div>

                        <div
                          className={Businessmodulecss.businessButton}
                          id={"openEditWrapper" + datas.BusinessID}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              openThisBusiness(
                                datas.BusinessID,
                                datas.BusinessName
                              )
                            }
                          >
                            open
                          </Button>
                          <Button
                            size="small"
                            sx={{
                              "&:hover": {
                                borderColor: "rgb(25, 118, 210)", // set your desired border color here
                                borderWidth: 2,
                                borderStyle: "solid",
                              },
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
                              setOpen({
                                Action: "deleteBusiness",
                                open: true,
                                targetdBusiness: {
                                  businessId: datas.BusinessID,
                                  businessName: datas.BusinessName,
                                  getBusiness: getBusiness,
                                  setBusinessLists: setBusinessListsInfo,
                                },
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

                              setOpen({
                                Action: "updateBusinesssName",
                                open: true,
                                targetdBusiness: {
                                  getBusiness,
                                  createdBusiness,
                                  setcreatedBusiness,
                                  setShowProgressBar,
                                  businessId: datas.BusinessID,
                                  businessName: datas.BusinessName,
                                  getBusiness: getBusiness,
                                  setBusinessLists: setBusinessListsInfo,
                                },
                              });
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
                      </div>
                    </div>
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
                              sx={{
                                "&:hover": {
                                  borderColor: "rgb(25, 118, 210)", // set your desired border color here
                                  borderWidth: 2,
                                  borderStyle: "solid",
                                },
                              }}
                              variant="outlined"
                              startIcon={<EditIcon />}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setRemoveEmployerBusiness({
                                  open: true,
                                  getBusiness: getBusiness,
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {open.open && ConfirmRequest}
      {ShowSuccessError?.show && (
        <SuccessOrError request={ShowSuccessError.message} />
      )}
      {openBusinessDeletingModal.Open && (
        <ModalToDeleteBusiness
          Data={{
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
      {RemoveEmployerBusiness?.open && (
        <ModalToRemoveEmployerBusiness
          data={{
            RemoveEmployerBusiness,
            setRemoveEmployerBusiness,
            getBusiness,
          }}
        />
      )}
    </>
  );
}
export default Business;
