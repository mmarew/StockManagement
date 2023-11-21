import { Badge, Box, Checkbox, Select, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import GetCreditLists from "./GetCreditLists";
import GetMinimumQty from "./GetMinimumQty";
import GetMaximumSales from "./GetMaximumSales";
import CheckIfUnreportedData from "./CheckIfUnreportedData";

function OpenBusinessHome() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [numberOfNotifications, setNumberOfNotifications] = useState({
    Inventory: 0,
    Credits: 0,
    Top: 0,
    Reports: 0,
  });
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    if (window.innerWidth > 768) {
      setviewInTable(true);
    } else setviewInTable(false);
  }, []);
  const [viewInTable, setviewInTable] = useState(false);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setviewInTable(true);
    } else setviewInTable(false);
  });
  return (
    <div>
      {/*used to show notifications amount only */}
      <div style={{ display: "none" }}>
        <CheckIfUnreportedData
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
        />{" "}
        <GetCreditLists
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          dateRange={{
            fromDate: "notInDateRange",
            toDate: "notInDateRange",
          }}
        />
        <CheckIfUnreportedData
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
        />
      </div>
      <>
        <Tabs
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            position: "relative",
            "& .MuiTab-root": {
              minWidth: 0,
              padding: "10px",
            },
          }}
          value={selectedTab}
          onChange={handleTabChange}
        >
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Credits}
                  color="error"
                />
                <span>Credit</span>
              </>
            }
            value={0}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Inventory}
                  color="error"
                />
                <span>Inventory</span>
              </>
            }
            value={1}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Top}
                  color="error"
                />
                <span>Top</span>
              </>
            }
            value={2}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Reports}
                  color="error"
                />
                <span>Reports</span>
              </>
            }
            value={3}
          />
        </Tabs>
        <Box
          onClick={() => {
            setviewInTable(!viewInTable);
          }}
        >
          <Checkbox checked={viewInTable} /> View In Table?
        </Box>
        {selectedTab == 0 ? (
          <GetCreditLists
            viewInTable={viewInTable}
            Notifications={{ numberOfNotifications, setNumberOfNotifications }}
            dateRange={{
              fromDate: "notInDateRange",
              toDate: "notInDateRange",
            }}
          />
        ) : selectedTab == 1 ? (
          <GetMinimumQty viewInTable={viewInTable} />
        ) : selectedTab == 2 ? (
          <GetMaximumSales
            viewInTable={viewInTable}
            Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          />
        ) : selectedTab == 3 ? (
          <CheckIfUnreportedData
            Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          />
        ) : (
          ""
        )}
      </>
    </div>
  );
}

export default OpenBusinessHome;
