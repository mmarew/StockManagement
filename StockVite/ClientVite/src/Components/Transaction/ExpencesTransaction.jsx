import React, { useState } from "react";
import { LinearProgress, Tab, Tabs } from "@mui/material";
import SearchExpByName from "../Expences/SearchExpByName";
import GetExpencesLists from "../Expences/GetExpencesLists";
import FormTogetExpTransaction from "./SearchTrans/FormTogetExpTransaction";
function ExpencesTransaction() {
  const [ShowProgressBar] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Expences Item" />
          <Tab label="Search" />
          <Tab label="View All" />
        </Tabs>

        {selectedTab === 0 && <GetExpencesLists />}
        {selectedTab === 1 && <SearchExpByName />}
        {selectedTab === 2 && <FormTogetExpTransaction />}
      </div>

      {ShowProgressBar ? <LinearProgress /> : ""}
    </div>
  );
}
export default ExpencesTransaction;
