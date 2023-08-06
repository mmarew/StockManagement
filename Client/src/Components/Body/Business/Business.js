import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import CreateBusiness from "./CreateBusiness";
import { useNavigate } from "react-router-dom";
import { Button, LinearProgress } from "@mui/material";
import Businessmodulecss from "./Business.module.css";
import { useContext } from "react";
import { InitialContext } from "../UserContext/UserContext";
import MUIConfirm from "../Others/MUIConfirm";
import SuccessOrError from "../Others/SuccessOrError";
import LeftSideBusiness from "./LeftSideBusiness";
let serverAddress = localStorage.getItem("targetUrl");
function Business() {
  const [BusinessLists, setBusinessLists] = useState(
    <h4>Looking for your business lists .... </h4>
  );
  const savedContext = useContext(InitialContext);
  const [ownersName, setownersName, ShowProgressBar, setShowProgressBar] =
    savedContext;
  const [ShowSuccessError, setSuccessError] = useState({});
  const [newBusiness, setnewBusiness] = useState();
  const [createdBusiness, setcreatedBusiness] = useState([]);
  const [employeerBusiness, setemployeerBusiness] = useState([]);
  let token = localStorage.getItem("storeToken");
  let Navigate = useNavigate();
  let openThisBusiness = (businessId, businessName) => {
    console.log(businessId);
    localStorage.setItem("businessId", businessId);
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("openedBusiness", "myBusiness");
    Navigate("/OpenBusiness");
  };
  const [ConfirmRequest, setConfirmRequest] = useState();
  const [open, setOpen] = useState({});

  let openEmployeerBusiness = (businessID, ownersId, businessName) => {
    console.log(businessID, ownersId);
    localStorage.setItem("businessId", businessID);
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("businessOwnreId", ownersId);
    localStorage.setItem("openedBusiness", "employersBusiness");
    Navigate("/OpenBusiness");
  };

  let editThisBusiness = (businessId, businessName) => {
    console.log(businessId);
    console.log("BusinessName", businessName);
    $("#businessWrapper_" + businessId).show();
    $("#openEditWrapper" + businessId).hide();
    $("#businessName_" + businessId).val(businessName);
  };
  console.log(token);
  let AddBusiness = () => {
    console.log("AddBusiness");
    setnewBusiness("allow");
  };
  let getBusiness = async () => {
    setShowProgressBar(true);
    setcreatedBusiness([]);
    setemployeerBusiness([]);
    let results = await axios.post(`${serverAddress}getBusiness/`, {
      token,
    });
    setShowProgressBar(false);
    console.log(results.data);
    if (results.data.data == "You haven't loged in before.") {
      Navigate("/login");
    }
    if (
      results.data.myBusiness?.length == 0 &&
      results.data.employeerBusiness?.length == 0
    ) {
      setBusinessLists(
        <h3 className={Businessmodulecss.noBusinessMessage}>
          You havn't created business or no business is allowed to be
          administered by you
        </h3>
      );
      return;
    }
    if (results.data.myBusiness == "") {
    } else {
      setBusinessLists("");
      setcreatedBusiness(results.data.myBusiness);
    }
    if (results.data.employeerBusiness == "") {
    } else {
      setBusinessLists("");
      setemployeerBusiness(results.data.employeerBusiness);
    }
    // setbusinessName()
  };
  let cancelBusinessUpdate = (businessId) => {
    $("#businessWrapper_" + businessId).hide();
    $("#openEditWrapper" + businessId).show();
  };
  useEffect(() => {
    createdBusiness?.map((items) => {
      console.log(items);
      $("#businessName_" + items.BusinessID).val(items.businessName);
    });
  }, [createdBusiness]);
  useEffect(() => {
    console.log(window.location.pathname);
    getBusiness();
    setownersName(localStorage.getItem("ownersName"));
  }, []);
  useEffect(() => {
    if (open.open) {
      console.log("open", open);
      const { businessId, businessName, getBusiness, setBusinessLists } =
        open.targetdBusiness;
      if (open.Action == "deleteBusiness") {
        setConfirmRequest(
          <MUIConfirm
            DialogMessage={" delete this business "}
            Action="deleteBusiness"
            ShowSuccessError={ShowSuccessError}
            setSuccessError={setSuccessError}
            open={open}
            setOpen={setOpen}
            targetdBusiness={{
              businessId,
              businessName,
              getBusiness,
              setBusinessLists,
            }}
          />
        );
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
      if (open.Action == "updateBusinesssName") {
        setConfirmRequest(
          <MUIConfirm
            DialogMessage={" update this business name "}
            Action="updateBusinesssName"
            ShowSuccessError={ShowSuccessError}
            setSuccessError={setSuccessError}
            open={open}
            setOpen={setOpen}
            targetdBusiness={{
              businessId,
              businessName,
              getBusiness,
              setBusinessLists,
              setShowProgressBar,
              setcreatedBusiness,
              createdBusiness,
            }}
          />
        );
      }
    }
  }, [open]);
  useEffect(() => {
    $(".LinearProgress").css("display", "block");
  }, [ShowProgressBar]);
  return (
    <>
      {ShowProgressBar && (
        <LinearProgress
          className={Businessmodulecss.LinearProgress}
          id={Businessmodulecss.LinearProgress}
        />
      )}

      <div className={Businessmodulecss.MainBusinessWrapper}>
        {console.log("screenSize " + window.innerWidth)}
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
              ""
            )}
            <Button
              variant="contained"
              onClick={AddBusiness}
              className={Businessmodulecss.createBusiness}
            >
              Add
            </Button>
            <br />
            {newBusiness == "allow" ? (
              <CreateBusiness
                ShowProgressBar={ShowProgressBar}
                setShowProgressBar={setShowProgressBar}
                getBusiness={getBusiness}
                setnewBusiness={setnewBusiness}
              />
            ) : (
              <div>
                {BusinessLists}
                <div className={Businessmodulecss.createdBusinessWrapper}>
                  {createdBusiness?.map((datas) => {
                    console.log(datas);
                    return (
                      <div
                        key={datas.BusinessID}
                        className={Businessmodulecss.createdBusiness}
                        id={"createdBusiness_" + datas.BusinessID}
                      >
                        <div
                          className={Businessmodulecss.Business}
                          id={"eachBusiness_" + datas.BusinessID}
                        >
                          <h2
                            id={"businessNameH2_" + datas.BusinessID}
                            className={Businessmodulecss.businessName}
                          >
                            {datas.BusinessName}
                          </h2>
                          <div
                            className={Businessmodulecss.businessButton}
                            id={"openEditWrapper" + datas.BusinessID}
                          >
                            <Button
                              variant="contained"
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
                                editThisBusiness(
                                  datas.BusinessID,
                                  datas.BusinessName
                                )
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
                                    setBusinessLists: setBusinessLists,
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
                                let id = "businessName_" + datas.BusinessID;
                                let EditedBusinessName = $("#" + id).val();
                                // alert(EditedBusinessName);
                                // return;
                                var pattern = /[^a-zA-Z0-9_]/;
                                if (pattern.test(EditedBusinessName)) {
                                  alert(
                                    "Business name should not contain special character or space ."
                                  );
                                  return;
                                } else if (
                                  EditedBusinessName == datas.BusinessName
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
                                    setBusinessLists: setBusinessLists,
                                  },
                                });
                              }}
                            >
                              <input
                                id={"businessName_" + datas.BusinessID}
                                placeholder="Business name"
                                type="text"
                              />
                              <div
                                className={
                                  Businessmodulecss.updateCancelWrapper
                                }
                                id={"updateCancelWrapper_" + datas.BusinessID}
                              >
                                <Button type="submit" variant="contained">
                                  Update
                                </Button>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() =>
                                    cancelBusinessUpdate(datas.BusinessID)
                                  }
                                >
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
                        console.log(items);
                        return (
                          <div
                            key={"EmployyersBusiness_" + items.employeeId}
                            className={Businessmodulecss.Business}
                          >
                            <h1>{items.BusinessName}</h1>
                            <div className={Businessmodulecss.businessButton}>
                              <Button
                                size="small"
                                variant="contained"
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
                                  // <MUIConfirm/
                                  setOpen({
                                    Action: "RemoveEmployerBusiness",
                                    open: true,
                                    targetdBusiness: {
                                      ownerId: items.ownerId,
                                      businessId: items.BusinessID,
                                      businessName: items.BusinessName,
                                      getBusiness: getBusiness,
                                      setBusinessLists: setBusinessLists,
                                    },
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
            )}
          </div>
        </div>
      </div>
      {console.log("open.open is ", open.open)}
      {open.open && ConfirmRequest}
      {console.log("ShowSuccessError == ", ShowSuccessError)}
      {ShowSuccessError?.show && (
        <SuccessOrError request={ShowSuccessError.message} />
      )}
    </>
  );
}
export default Business;
