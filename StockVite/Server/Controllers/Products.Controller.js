const {
  addProducts,
  getRegisteredProducts,
  getSingleProducts,
  updateProducts,
  deleteProducts,
  searchProducts,
} = require("../Services/Product.Service");

let addProductsController = async (req, res) => {
  let result = await addProducts(req.body);
  res.json(result);
};
const searchProductsController = async (req, res) => {
    let result = await searchProducts(req.body, req.query);
    res.json(result);
  },
  deleteProductsController = async (req, res) => {
    let result = await deleteProducts(req.body);
    res.json(result);
  },
  updateProductsController = async (req, res) => {
    let result = await updateProducts(req.body);
    res.json(result);
  },
  getSingleProductsController = async (req, res) => {
    let result = await getSingleProducts(req.body);
    res.json(result);
  },
  getRegisteredProductsController = async (req, res) => {
    let result = await getRegisteredProducts(req.body);
    res.json(result);
  };
// module.exports = {
//   addProduct,
//   searchProducts,
//   deleteProducts,
//   updateProducts,
//   getSingleProducts,
//   getRegisteredProducts,
// };
module.exports = {
  searchProductsController,
  deleteProductsController,
  updateProductsController,
  getSingleProductsController,
  getRegisteredProductsController,
  addProductsController,
};
