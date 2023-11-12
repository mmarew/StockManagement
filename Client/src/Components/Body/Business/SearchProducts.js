import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";
import "./SearchProducts.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Box, TextField, Modal } from "@mui/material";
import MUIConfirm from "../Others/MUIConfirm";
import { ButtonProcessing } from "../../utility/Utility";
function SearchProducts({ response, submitSearch }) {
  const [Processing, setProcessing] = useState(false);
  const [openEditerModal, setOpenEditerModal] = useState({ open: false });
  const [showEditingModalDialog, setshowEditingModalDialog] = useState();
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
  let handleClose = () => {
    setshowEditingModalDialog("");
    setOpenEditerModal({ open: false });
  };
  const [productName, setProductName] = useState(
    openEditerModal?.item?.productName
  );
  const [productUnitPrice, setProductUnitPrice] = useState(
    openEditerModal?.item?.productsUnitPrice
  );

  const [productUnitCost, setProductUnitCost] = useState(
    openEditerModal?.item?.productsUnitCost
  );
  const [minimumQty, setMinimumQty] = useState(
    openEditerModal?.item?.minimumQty
  );

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductUnitPriceChange = (e) => {
    setProductUnitPrice(e.target.value);
  };

  const handleProductUnitCostChange = (e) => {
    console.log("handleProductUnitCostChange", e.target.value);
    setProductUnitCost(e.target.value);
  };

  const handleMinimumQtyChange = (e) => {
    setMinimumQty(e.target.value);
  };
  useEffect(() => {
    console.log("openEditerModal", openEditerModal.item);
    if (openEditerModal.open) setshowEditingModalDialog();
  }, [openEditerModal]);

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
  //////////////////////////////////////////////
  let updateProductsData = async (productID) => {
    businessName = localStorage.getItem("businessName");
    let ob = {};
    console.log("openEditerModal===", openEditerModal.item);

    let previousData = openEditerModal.item;
    let prevPrice = previousData.productsUnitPrice,
      prevCost = previousData.productsUnitCost,
      prevName = previousData.productName,
      prevMinimumQty = previousData.minimumQty;
    setProcessing(true);
    if (
      minimumQty == prevMinimumQty &&
      productUnitPrice == prevPrice &&
      productName == prevName &&
      productUnitCost == prevCost
    ) {
      setProcessing(false);
      return alert("you can't make update bacause no change in your data");
    }
    ob.minimumQty = minimumQty;
    ob.productPrice = productUnitPrice;
    ob.productName = productName;
    ob.productCost = productUnitCost;
    ob.id = productID;
    ob.businessName = businessName;
    $(".LinearProgress").css("display", "block");

    await axios.post(serverAddress + "updateProducts/", ob).then((datas) => {
      if ((datas.data.data = "updated well")) {
        alert("updated well");
      }
    });
    setProcessing(false);
    submitSearch();
    handleClose();
    $(".LinearProgress").css("display", "none");
    let Copy = [];
    searchedProducts.map((each) => {
      each.updateMode = false;
      Copy.push(each);
    });
    setSearchedProducts(Copy);
  };
  ////////////////////////////////////////////
  const [confirmRequest, setconfirmRequest] = useState();
  const [ConfirmDelete, setConfirmDelete] = useState({ Verify: false });
  const [ShowSuccessError, setSuccessError] = useState({});
  let [open, setOpen] = useState({ open: false });
  useEffect(() => {
    if (ConfirmDelete.Verify) {
      setconfirmRequest();
      console.log("ConfirmDelete", ConfirmDelete);
      let item = ConfirmDelete.item;
      item.businessName = businessName;
      let deleteMyProducts = async () => {
        console.log("item", item);
        // return;
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
    <div className={"productListWrapper"}>
      {searchedProducts?.length > 0 &&
        searchedProducts.map((product) => {
          return (
            <div className={"productList"}>
              <div>{product.productName}</div>
              <br />
              <Button
                onClick={(e) => {
                  setProductName(product.productName);
                  setProductUnitPrice(product.productsUnitPrice);
                  setProductUnitCost(product.productsUnitCost);
                  setMinimumQty(product.minimumQty);
                  setOpenEditerModal({ open: true, item: product });
                }}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                onClick={(e) => deleteProducts(e, product)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              ></Button>
            </div>
          );
        })}
      {open.open && confirmRequest}
      <Modal open={openEditerModal.open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 400,
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
          <br />
          <br />
          <h3>Edition form to products</h3>
          <br />
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              margin: "auto",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              label="Product Name"
              value={productName}
              onChange={handleProductNameChange}
              type="text"
            />
            <br />
            <br />
            <TextField
              value={productUnitPrice}
              label="Product Unit Price"
              onChange={handleProductUnitPriceChange}
              type="number"
            />
            <br />
            <br />
            <TextField
              value={productUnitCost}
              label="Product Unit Cost"
              onChange={handleProductUnitCostChange}
              type="number"
            />
            <br />
            <br />
            <TextField
              value={minimumQty}
              label="Product Minimum Quantity"
              onChange={handleMinimumQtyChange}
              type="number"
            />
            <br />
            <br />
            {!Processing ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() =>
                  updateProductsData(openEditerModal?.item?.ProductId)
                }
                className={`updateProducts updateProducts_${openEditerModal?.item?.ProductId}`}
              >
                UPDATE
              </Button>
            ) : (
              <ButtonProcessing />
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}
export default SearchProducts;
