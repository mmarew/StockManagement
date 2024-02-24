import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Users from "../Components/Admin/Users";
import Businesses from "../Components/Admin/Businesses";

function Admin() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Business" />
      </Tabs>

      {selectedTab === 0 && (
        <div>
          <Users />
        </div>
      )}

      {selectedTab === 1 && (
        <div>
          <Businesses />
        </div>
      )}
    </div>
  );
}
export default Admin;
