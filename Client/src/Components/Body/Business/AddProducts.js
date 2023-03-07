import axios from "axios";
import "./AddProducts.css";
import React, { useState } from "react";
const AddProducts = () => {
  let token = localStorage.getItem("storeToken");
  let businessId = localStorage.getItem("businessId");
  const [FormData, setFormData] = useState({});
  let CollectData = (e) => {
    console.log(e.target.name);
    setFormData({
      ...FormData,
      [e.target.name]: e.target.value,
      token,
      businessId,
    });
  };
  let registerProducts = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:2020/addProducts",
      FormData
    );
    let data = response.data.data;
    let registerProducts = document.getElementsByClassName("registerProducts");
    for (let i = 0; i < registerProducts.length; i++) {
      registerProducts[i].value = "";
    }
    if (data == "productIsAlreadyAddedBefore") {
      alert("Already registered");
    } else if (data == "productIsAdded") {
      alert("you have added products successfully");
    }
  };
  return (
    <div>
      <h1 className="registrationFormToproducts">Forms To Register Products</h1>

      <form id="registerProductsForm" onSubmit={registerProducts} method="post">
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productName"
          type="text"
          placeholder="Product name"
        />
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productUnitCost"
          type="text"
          placeholder="Purchasing unit cost"
        />
        <input
          className="registerProducts"
          onChange={CollectData}
          name="productUnitPrice"
          type="text"
          placeholder="Salling unit price"
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default AddProducts;
