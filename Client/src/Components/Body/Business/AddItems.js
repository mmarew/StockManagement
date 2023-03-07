import React, { useState } from "react";
import AddCost from "./AddCostTransaction";
import AddCostItems from "./AddCostItems";
import "./AddItems.css";
import AddProducts from "./AddProducts";
function AddItems() {
  const [activeComponent, setActiveComponent] = useState();
  let selectTarget = (e) => {
    console.log(e.target.className);
    if (e.target.className == "salesButton salesAndCostItems")
      setActiveComponent(<AddProducts />);
    else if (e.target.className) {
      setActiveComponent(<AddCostItems />);
    }
  };
  return (
    <>
      <div className="salesAndCostItemsWrapper">
        <button
          className="salesButton salesAndCostItems"
          onClick={selectTarget}
        >
          Sales
        </button>
        <button className="costButton salesAndCostItems" onClick={selectTarget}>
          Cost
        </button>
      </div>
      {activeComponent}
    </>
  );
}

export default AddItems;
