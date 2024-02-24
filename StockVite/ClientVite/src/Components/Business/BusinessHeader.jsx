import React from "react";
import { Link } from "react-router-dom";
import "./BusinessHeader.css";

function BusinessHeader() {
  return (
    <div>
      <div className="registerViewSearch">
        <Link
          // onClick={registerItems}
          className="openBusinessTab"
          name="addTransaction"
          to="addTransaction"
        >
          Add Transaction
        </Link>
        <Link
          // onClick={registerItems}
          className="openBusinessTab"
          name="addItem"
          to="additems"
        >
          Add Items
        </Link>
        <Link
          // onClick={registerItems}
          className="openBusinessTab"
          name="View"
          to="view"
        >
          View
        </Link>
        <Link
          // onClick={registerItems}
          className="openBusinessTab"
          name="Search"
          to="search"
        >
          Search
        </Link>
      </div>
    </div>
  );
}

export default BusinessHeader;
