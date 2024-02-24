import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../CSS/OpenBusiness.module.css";
function OpenEmployeersBusiness() {
  return (
    <div>
      <div className="navOFEmployerBusiness">
        <Link to={"/"}>
          <button> Home </button>
        </Link>
        <Link to={"Register"}>
          <button> Register </button>
        </Link>
        <Link to={"view"}>
          <button> View</button>
        </Link>
        <Link to={"Search"}>
          <button>Search</button>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}

export default OpenEmployeersBusiness;
