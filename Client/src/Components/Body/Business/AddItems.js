import React, { useState } from "react";
import AddCostItems from "./AddExpencesItems";
import "./AddItems.css";
import AddProducts from "./AddProducts";
function AddItems() {
  const [randVal, setrandVal] = useState(Math.random());
  const [activeComponent, setActiveComponent] = useState();
  let selectTarget = (e, target) => {
    console.log(e.target.className);
    let element = document.getElementsByClassName("salesAndCostItems");
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove("activeClass");
    }

    e.target.classList.add("activeClass");
    if (target == "SALES")
      return setActiveComponent(
        <AddProducts setrandVal={setrandVal} randVal={randVal} />
      );
    {
      setActiveComponent(<AddCostItems />);
    }
  };
  return (
    <div>
      <div className="salesAndCostItemsWrapper">
        <div
          className="salesButton salesAndCostItems"
          onClick={(e) => {
            setrandVal(Math.random());
            setTimeout(() => {
              selectTarget(e, "SALES");
            }, 10);
          }}
        >
          Add Product Items
        </div>
        <div
          className="costButton salesAndCostItems"
          onClick={(e) => {
            selectTarget(e, "COST");
          }}
        >
          Add Expences
        </div>
      </div>
      {activeComponent}
    </div>
  );
}

export default AddItems;
