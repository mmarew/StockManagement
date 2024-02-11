import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchProducts.css";
import { Button } from "@mui/material";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";
import EditProducts from "./EditProducts";
import DetailedProducts from "./DetailedProducts";
import DeleteProducts from "./DeleteProducts";
function SearchProducts({ InputValue, setSearchTypeValueError }) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");

  console.log("setSearchTypeValueError");
  const [ConfirmDelete, setConfirmDelete] = useState({ Verify: false });
  let openedBusiness = localStorage.getItem("openedBusiness");
  const [ViewPdoductInfo, setViewPdoductInfo] = useState({
    Open: false,
    Product: {
      productName: "",
      productsUnitPrice: "",
      productsUnitCost: "",
      minimumQty: "",
    },
  });
  const [openEditerModal, setOpenEditerModal] = useState({ open: false });
  let serverAddress = localStorage.getItem("targetUrl");
  const [searchedProducts, setSearchedProducts] = useState([]);

  let fetchProducts = async () => {
    console.log("ooooooooooooo");
    try {
      let response = await axios.get(
        serverAddress + "products/searchProducts",
        {
          params: { token, businessId },
        }
      );
      let copy = [];
      let products = response.data.products;
      console.log("response in products", products);
      if (products.length == 0) {
        setSearchTypeValueError("you haven't registered products.");
      }
      products?.map((each) => {
        each.updateMode = false;
        copy.push(each);
      });
      console.log("copy is ", copy);
      setSearchedProducts(copy);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [, InputValue]);

  //////////////////////////////////////////////
  return (
    <>
      <ExportToExcel data={searchedProducts} target={"searchedProducts"} />
      <div className={"productListWrapper"}>
        {searchedProducts?.length > 0 &&
          searchedProducts.map((product, index) => {
            return (
              <div key={"searchedProducts_" + index} className={"productList"}>
                <div>{product.productName}</div>
                <br />
                {openedBusiness == "myBusiness" && (
                  <>
                    <Button
                      onClick={(e) => {
                        setOpenEditerModal({ open: true, item: product });
                      }}
                      variant="outlined"
                      color="primary"
                    >
                      Edit
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      onClick={(e) =>
                        setConfirmDelete(() => ({
                          Verify: true,
                          item: product,
                        }))
                      }
                      variant="outlined"
                      color="error"
                    >
                      Delete
                    </Button>
                  </>
                )}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <Button
                  onClick={() => {
                    setViewPdoductInfo((prev) => {
                      return { ...prev, Open: true, Product: product };
                    });
                  }}
                  variant="outlined"
                >
                  View
                </Button>
              </div>
            );
          })}
        {ViewPdoductInfo.Open && (
          <DetailedProducts
            data={{ ViewPdoductInfo, setViewPdoductInfo, fetchProducts }}
          />
        )}

        {openEditerModal.open && (
          <EditProducts
            data={{ openEditerModal, setOpenEditerModal, fetchProducts }}
          />
        )}
        {ConfirmDelete.Verify && (
          <DeleteProducts
            data={{ ConfirmDelete, setConfirmDelete, fetchProducts }}
          />
        )}
      </div>
    </>
  );
}
export default SearchProducts;
