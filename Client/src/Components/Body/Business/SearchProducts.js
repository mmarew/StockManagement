import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import "./SearchProducts.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Button } from "@material-ui/core";
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
      $("#minimumQty_" + items.ProductId).val(items.minimumQty);
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
      productName_ = "productName_" + id,
      btnId = "updateProducts_" + id,
      minimumQty = "minimumQty_" + id;
    ob.minimumQty = $("#" + minimumQty).val();
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
        <TableContainer className="productContainer">
          <Table id="savedProduct">
            <TableHead>
              <TableRow>
                <TableCell className="tableHeadTitle">product Name</TableCell>
                <TableCell className="tableHeadTitle">product Price</TableCell>
                <TableCell className="tableHeadTitle">
                  product Cost
                </TableCell>{" "}
                <TableCell className="tableHeadTitle">Minimum Qty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedProducts?.map((items) => {
                console.log(items);
                return (
                  <TableRow
                    className="trProductName"
                    key={searchedProducts.indexOf(items)}
                  >
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={handleProductsInput}
                        id={"productName_" + items.ProductId}
                        type="text"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={handleProductsInput}
                        id={"productPrice_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={handleProductsInput}
                        id={"productCost_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={handleProductsInput}
                        id={"minimumQty_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={updateProductsData}
                        id={items.ProductId}
                        className={
                          "updateProducts updateProducts_" + items.ProductId
                        }
                      >
                        UPDATE
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
export default SearchProducts;
