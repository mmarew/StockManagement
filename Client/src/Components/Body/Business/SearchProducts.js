import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import "./SearchProducts.css";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import MUIConfirm from "../Others/MUIConfirm";
function SearchProducts({ response }) {
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [searchedProducts, setSearchedProducts] = useState([]);
  $("#savedProduct").show();
  let fetchProducts = async () => {
    let copy = [];
    let products = response.data.products;
    console.log("response is ", response);
    products?.map((each) => {
      each.updateMode = false;
      copy.push(each);
    });
    console.log("copy is ", copy);
    setSearchedProducts(copy);
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
  let handleProductsInput = (e, items) => {
    let copy = [];
    console.log("items", items);
    // return;
    let changedValue = e.target.value,
      targetId = e.target.id;
    console.log(changedValue, e.target);

    searchedProducts.map((product) => {
      console.log(product);
      if (product.ProductId == items.ProductId) {
        items.updateMode = true;
        if (targetId.includes("minimumQty_")) {
          items.minimumQty = changedValue;
        }
        if (targetId.includes("productCost_")) {
          items.productsUnitCost = changedValue;
        }
        // ProductId: 11;
        // minimumQty: 11;
        // productName: "mirinda2";
        // productsUnitCost: 200;
        // productsUnitPrice: 231;
        if (targetId.includes("productPrice_")) {
          items.productsUnitPrice = changedValue;
        }
        if (targetId.includes("productName_")) {
          items.productName = changedValue;
        }
      }
      copy.push(product);
    });
    copy.push();
    setSearchedProducts(copy);
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
    let Copy = [];
    searchedProducts.map((each) => {
      each.updateMode = false;
      Copy.push(each);
    });
    setSearchedProducts(Copy);
  };
  const [confirmRequest, setconfirmRequest] = useState();
  const [ConfirmDelete, setConfirmDelete] = useState({ Verify: false });
  const [ShowSuccessError, setSuccessError] = useState({});
  let [open, setOpen] = useState({ open: false });
  useEffect(() => {
    if (ConfirmDelete.Verify) {
      //  0911522499
      setconfirmRequest();
      console.log("ConfirmDelete", ConfirmDelete);
      let item = ConfirmDelete.item;
      item.businessName = businessName;
      let deleteMyProducts = async () => {
        let deletResponce = await axios.post(
          serverAddress + "deleteProducts/",
          item
        );
        console.log("deletResponce", deletResponce);
        let affectedRows = deletResponce.data.data.affectedRows;
        let copyOfProducts = [];
        if (affectedRows >= 0) {
          searchedProducts?.map((product) => {
            console.log("searchedProducts", product);
            if (product.ProductId !== item.ProductId) {
              copyOfProducts.push(product);
            }
          });
        }
        setSearchedProducts(copyOfProducts);
      };
      deleteMyProducts();
    }
  }, [ConfirmDelete]);
  useEffect(() => {
    if (open.open) {
      setTimeout(() => {
        setconfirmRequest(
          <MUIConfirm
            ShowSuccessError={ShowSuccessError}
            setSuccessError={setSuccessError}
            ConfirmDelete={ConfirmDelete}
            setConfirmDelete={setConfirmDelete}
            DialogMessage={" delete this Product "}
            Action="deleteProducts"
            open={open}
            setOpen={setOpen}
            targetdBusiness={{ businessId: "tobe" }}
          />
        );
      }, 0);
    }
  }, [open]);

  let deleteProducts = async (e, item) => {
    setConfirmDelete({ ...ConfirmDelete, item, Verify: false });
    setOpen({ open: true });
  };
  return (
    <div>
      {console.log(
        "searchedProducts",
        searchedProducts.length,
        " searchedProducts",
        searchedProducts
      )}
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
                <TableCell className="tableHeadTitle">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedProducts?.map((items, index) => {
                console.log(items);
                return (
                  <TableRow
                    className="trProductName"
                    key={"trProductName" + index}
                  >
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={(e) => handleProductsInput(e, items)}
                        id={"productName_" + items.ProductId}
                        type="text"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={(e) => handleProductsInput(e, items)}
                        id={"productPrice_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={(e) => handleProductsInput(e, items)}
                        id={"productCost_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={items.ProductId}
                        onChange={(e) => handleProductsInput(e, items)}
                        id={"minimumQty_" + items.ProductId}
                        type="number"
                      />
                    </TableCell>
                    {items.updateMode && (
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
                    )}
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => deleteProducts(e, items)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {open.open && confirmRequest}
    </div>
  );
}
export default SearchProducts;
