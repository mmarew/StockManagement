import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
function SearchCosts({ response }) {
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [MyCostData, setMyCostData] = useState([]);
  let getCostLists = async () => {
    setMyCostData(response.data.data);
  };
  let updateMycostData = async (e, id, cost) => {
    let CostName_ = $("#CostName_" + id).val(),
      CostValue_ = $("#CostValue_" + id).val(),
      costsId = cost.costsId,
      Token = localStorage.getItem("storeToken");
    $(".LinearProgress").css("display", "block");
    let responce = await axios.post(serverAddress + "/updateCostData/", {
      CostName_,
      CostValue_,
      costsId,
      Token,
      businessName,
    });
    $(".LinearProgress").css("display", "none");
    if (responce.data.data == "updated successfully") {
      alert(`your data is updated. Thank you.`);
    }
    $(".btnUpdateCost").hide();
  };
  useEffect(() => {
    getCostLists();
  }, []);
  useEffect(() => {
    // update costs
    MyCostData.map((cost) => {
      console.log(cost);
      let CostName_ = `CostName_${MyCostData.indexOf(cost)}`,
        CostValue_ = `CostValue_${MyCostData.indexOf(cost)}`;
      $("#" + CostValue_).val(cost.unitCost);
      $("#" + CostName_).val(cost.costName);
    });
  }, [MyCostData]);

  let costInputEdits = (e, index) => {
    $(".btnUpdateCost").hide();
    $("#CostUpdate_" + index).show();
  };
  return (
    <div>
      {MyCostData?.length > 0 && (
        <table id="costTable">
          <tr>
            <th>Cost Name</th>
            <th>Unit Cost</th>
          </tr>
          {MyCostData?.map((cost) => {
            // costsId: 1, costName: 'lunch', unitCost: 200
            console.log(cost);
            return (
              <tr key={MyCostData.indexOf(cost)}>
                <td>
                  <input
                    onInput={(e) => costInputEdits(e, MyCostData.indexOf(cost))}
                    type="text"
                    id={`CostName_${MyCostData.indexOf(cost)}`}
                  />
                </td>
                <td>
                  <input
                    onInput={(e) => costInputEdits(e, MyCostData.indexOf(cost))}
                    type="number"
                    id={`CostValue_${MyCostData.indexOf(cost)}`}
                  />
                </td>
                <td>
                  <input
                    onClick={(e) =>
                      updateMycostData(e, MyCostData.indexOf(cost), cost)
                    }
                    className="btnUpdateCost"
                    value={"Update"}
                    type="button"
                    id={`CostUpdate_${MyCostData.indexOf(cost)}`}
                  />
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </div>
  );
}

export default SearchCosts;
