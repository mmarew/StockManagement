import { Badge, Box, Checkbox, Select, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import GetCreditLists from "../CreditMGMT/GetCreditLists";
import GetMinimumQty from "../MinimumQTY/GetMinimumQty";
import GetMaximumSales from "../MaximumQTY/GetMaximumSales";
import CheckIfUnreportedData from "../Body/CheckIfUnreportedData";

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
  const [FetchedDataLength, setFetchedDataLength] = useState(0);
  return (
    <div>
      {/*used to show notifications amount only */}
      <div style={{ display: "none" }}>
        <GetCreditLists
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          dateRange={{
            fromDate: "notInDateRange",
            toDate: "notInDateRange",
          }}
        />
      </div>
      <>
        <Tabs
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
        </Tabs>
        <Box
          onClick={() => {
            setviewInTable(!viewInTable);
          }}
        >
          {FetchedDataLength > 0 && (
            <Checkbox label={"View In Table?"} checked={viewInTable} />
          )}
        </Box>
        {selectedTab == 0 ? (
          <GetCreditLists
            setFetchedDataLength={setFetchedDataLength}
            viewInTable={viewInTable}
            Notifications={{ numberOfNotifications, setNumberOfNotifications }}
            dateRange={{
              fromDate: "notInDateRange",
              toDate: "notInDateRange",
            }}
          />
        ) : selectedTab == 1 ? (
          <GetMinimumQty
            setFetchedDataLength={setFetchedDataLength}
            viewInTable={viewInTable}
          />
        ) : selectedTab == 2 ? (
          <GetMaximumSales
            setFetchedDataLength={setFetchedDataLength}
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
