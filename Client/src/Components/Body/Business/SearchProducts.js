import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";

function SearchProducts({ response }) {
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [searchedProducts, setSearchedProducts] = useState([]);
  $("#savedProduct").show();
  let fetchProducts = async () => {
    setSearchedProducts(response.data.products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    searchedProducts?.map((items) => {
      $("#productName_" + items.ProductId).val(items.productName);
      $("#productPrice_" + items.ProductId).val(items.productsUnitPrice);
      $("#productCost_" + items.ProductId).val(items.productsUnitCost);
    });
  }, [searchedProducts]);
  let handleProductsInput = (e) => {
    let id = e.target.name;
    console.log(id);
    let btnId = "updateProducts_" + id;
    console.log(btnId);
    $("." + btnId).show();
  };
  let updateProductsData = async (e) => {
    console.log(e.target);
    businessName = localStorage.getItem("businessName");
    let id = e.target.id,
      ob = {},
      productCost_ = "productCost_" + id,
      productPrice_ = "productPrice_" + id,
      productName_ = "productName_" + id;
    let btnId = "updateProducts_" + id;
    ob.productPrice = $("#" + productPrice_).val();
    ob.productName = $("#" + productName_).val();
    ob.productCost = $("#" + productCost_).val();
    ob.id = id;
    ob.businessName = businessName;
    $(".LinearProgress").css("display", "block");
    let response = await axios
      .post(serverAddress + "updateProducts/", ob)
      .then((datas) => {
        $("." + btnId).hide();
        if ((datas.data.data = "updated well")) {
          alert("updated well");
        }
      });
    $(".LinearProgress").css("display", "none");
  };
  return (
    <div>
      {searchedProducts?.length > 0 && (
        <table id="savedProduct">
          <tr>
            <th>product Name</th>
            <th>product Price</th>
            <th>product Cost</th>
          </tr>
          {searchedProducts?.map((items) => {
            console.log(items);
            return (
              <tr
                className="trProductName"
                key={searchedProducts.indexOf(items)}
              >
                <td>
                  <input
                    name={items.ProductId}
                    onChange={handleProductsInput}
                    id={"productName_" + items.ProductId}
                    type="text"
                  />
                </td>
                <td>
                  <input
                    name={items.ProductId}
                    onChange={handleProductsInput}
                    id={"productPrice_" + items.ProductId}
                    type="text"
                  />
                </td>

                <td>
                  <input
                    name={items.ProductId}
                    onChange={handleProductsInput}
                    id={"productCost_" + items.ProductId}
                    type="text"
                  />
                </td>
                <td>
                  <div
                    onClick={updateProductsData}
                    id={items.ProductId}
                    className={
                      "updateProducts updateProducts_" + items.ProductId
                    }
                  >
                    UPDATE
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </div>
  );
}

export default SearchProducts;
