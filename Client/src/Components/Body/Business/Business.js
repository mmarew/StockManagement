import React, { useEffect, useState } from "react";
import "./Business.css";
import axios from "axios";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import CreateBusiness from "./CreateBusiness";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import DeleteBusiness from "./DeleteBusiness";
let serverAddress = localStorage.getItem("targetUrl");
function Business() {
  const [BusinessLists, setBusinessLists] = useState(
    <h4>Your business lists</h4>
  );
  const [newBusiness, setnewBusiness] = useState();
  const [createdBusiness, setcreatedBusiness] = useState([]);
  const [employeerBusiness, setemployeerBusiness] = useState([]);
  let token = localStorage.getItem("storeToken");
  let Navigate = useNavigate();
  let openThisBusiness = (businessId, businessName) => {
    console.log(businessId);
    localStorage.setItem("businessId", businessId);
    localStorage.setItem("businessName", businessName);
    Navigate("/OpenBusiness");
  };
  let updateBusinesssName = async (targetBusinessId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to update this Business name?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            let businessId = "businessName_" + targetBusinessId,
              businessname = $("#" + businessId).val();
            console.log(businessname, targetBusinessId);
            $("#LinearProgress").show();
            let updateRes = await axios.post(
              `${serverAddress}updateBusinessName/`,
              {
                businessname,
                targetBusinessId,
              }
            );
            $("#LinearProgress1").hide();
            console.log(updateRes.data);
            let data = updateRes.data.data;
            if (data == "reservedByOtherBusiness") {
              alert(
                "This name is reserved by another company. So please try to use another name to remove naming conflicts. Thankyou"
              );
            } else if (data == "update is successfull") {
              alert(data);
              $("#businessWrapper_" + targetBusinessId).hide();
              $("#openEditWrapper" + targetBusinessId).show();
              $("#businessNameH2_" + targetBusinessId).text(businessname);

              localStorage.setItem("businessname", businessname);
              createdBusiness?.map((items) => {
                console.log(items);
                if (targetBusinessId == items.businessId) {
                  console.log("items.businessId " + items.businessId);
                  $("#createdBusiness_" + targetBusinessId).remove();
                  setcreatedBusiness([
                    ...createdBusiness,
                    { ...items, businessName: businessname },
                  ]);
                }
              });
            }
          },
        },
        {
          label: "No",
          onClick: () => console.log("Click No"),
        },
      ],
    });
  };
  let openEmployeerBusiness = (businessID, ownersId, businessName) => {
    console.log(businessID, ownersId);
    localStorage.setItem("businessId", businessID);
    localStorage.setItem("businessName", businessName);
    localStorage.setItem("businessOwnreId", ownersId);
    Navigate("/OpenEmployeersBusiness");
  };

  let editThisBusiness = (businessId, businessName) => {
    console.log(businessId);
    console.log("BusinessName", businessName);
    // $(".businessButton").show();
    // $(".update-wrapper").hide();
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
    $("#LinearProgress").show();
    let results = await axios.post(`${serverAddress}getBusiness/`, {
      token,
    });
    $("#LinearProgress1").hide();
    console.log(results.data);
    if (
      results.data.myBusiness?.length == 0 &&
      results.data.employeerBusiness?.length == 0
    ) {
      setBusinessLists(
        <h3>
          You havn't created business or no business is allowed to administered
          by you
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
    getBusiness();
  }, []);

  return (
    <>
      {console.log("employeerBusiness is = " + employeerBusiness)}

      <div className="BusinessWrapper">
        <LinearProgress id="LinearProgress1" />
        <button onClick={AddBusiness} className="createBusiness">
          Create Business
        </button>
        <br />
        {newBusiness == "allow" ? (
          <CreateBusiness
            getBusiness={getBusiness}
            setnewBusiness={setnewBusiness}
          />
        ) : (
          <div>
            {BusinessLists}
            <div className="createdBusinessWrapper">
              {createdBusiness?.map((datas) => {
                console.log(datas);
                return (
                  <div
                    key={datas.BusinessID}
                    className="createdBusiness"
                    id={"createdBusiness_" + datas.BusinessID}
                  >
                    <div
                      className="Business"
                      id={"eachBusiness_" + datas.BusinessID}
                    >
                      <h2
                        id={"businessNameH2_" + datas.BusinessID}
                        className="businessName"
                      >
                        {datas.BusinessName}
                      </h2>
                      <div
                        className="businessButton"
                        id={"openEditWrapper" + datas.BusinessID}
                      >
                        <button
                          onClick={() =>
                            openThisBusiness(
                              datas.BusinessID,
                              datas.BusinessName
                            )
                          }
                        >
                          open
                        </button>
                        <button
                          onClick={() =>
                            editThisBusiness(
                              datas.BusinessID,
                              datas.BusinessName
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          id=""
                          onClick={() =>
                            DeleteBusiness(
                              datas.BusinessID,
                              datas.BusinessName,
                              getBusiness,
                              setBusinessLists
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                      <div
                        id={"businessWrapper_" + datas.BusinessID}
                        className="update-wrapper"
                      >
                        <input
                          id={"businessName_" + datas.BusinessID}
                          placeholder="Business name"
                          type="text"
                        />
                        <div
                          className="updateCancelWrapper"
                          id={"updateCancelWrapper_" + datas.BusinessID}
                        >
                          <button
                            onClick={() =>
                              updateBusinesssName(datas.BusinessID)
                            }
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              cancelBusinessUpdate(datas.BusinessID)
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {
                <>
                  {console.log("employeerBusiness")}
                  {console.log(employeerBusiness)}
                  {employeerBusiness?.map((items) => {
                    console.log(items);
                    return (
                      <div key={items.employeeId} className="Business">
                        <h1>{items.BusinessName}</h1>
                        <div className="businessButton">
                          <button
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
                          </button>
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
    </>
  );
}
export default Business;
