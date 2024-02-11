const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.json({ Message: "Nice and nice" });
});
let path = "/";
const { authMiddleware, authMiddleware2 } = require("../middleware/Auth.js");
const {
  deleteProductsController,
  searchProductsController,
  addProductsController,
  updateProductsController,
  getSingleProductsController,
  getRegisteredProductsController,
} = require("../Controllers/Products.Controller.js");

router.post("/products/addProducts", authMiddleware, addProductsController);
router.post(
  "/products/deleteProducts/",
  authMiddleware,
  authMiddleware2,
  deleteProductsController
);
router.get(
  "/products/searchProducts/",
  authMiddleware,
  searchProductsController
);
router.post(
  "/products/updateProducts",
  authMiddleware,

  updateProductsController
);
router.post(
  "/products/getSingleProducts",
  authMiddleware,
  getSingleProductsController
);
router.post(
  "/products/getRegisteredProducts/",
  authMiddleware,
  getRegisteredProductsController
);
router.post(
  path + "registerEmployeersProducts/",
  authMiddleware,
  (req, res) => {
    let TranactionProducts = req.body.tranactionProducts,
      EmployeersProduct = req.body.EmployeersProduct;
    // //console.log("TranactionProducts = ", TranactionProducts,    "EmployeersProduct = ",  EmployeersProduct );
    let ProductId = EmployeersProduct[0].ProductId;
    //  { purchase_1: '456', sales_1: '400', Wrickage_1: '6' }
    let purchase_ = "purchase_" + ProductId,
      sales_ = "sales_" + ProductId,
      Wrickage_ = "Wrickage_" + ProductId;
    // //console.log("EmployeersProduct[0]", EmployeersProduct[0]);
    // //console.log();
    let purchaseQty = TranactionProducts[purchase_],
      salesQty = TranactionProducts[sales_],
      wrickageQty = TranactionProducts[Wrickage_];
    // //console.log(purchaseQty, salesQty, wrickageQty);
    res.json({ data: req.body });
  }
);
module.exports = router;
