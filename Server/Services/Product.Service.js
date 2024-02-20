const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");
const { CurrentYMD } = require("../DateFormatter.js");
let addProducts = async (body) => {
  try {
    const rowData = body;
    console.log("rowData", rowData);

    const {
      businessId,
      userID,
      minimumQty,
      productUnitPrice,
      productUnitCost,
      productName,
      productRegistrationDate,
    } = rowData;

    const selectBusiness = `SELECT * FROM Business WHERE businessId = ?`;
    const [businessRows] = await pool.query(selectBusiness, [businessId]);

    if (businessRows.length === 0) {
      return { data: "businessNotFound", businessId };
    }

    const business = businessRows[0];

    if (business.ownerId !== userID) {
      return { data: "notAllowedFroYou" };
    }

    const businessName = business.uniqueBusinessName;
    const selectProduct = `SELECT productName FROM ?? WHERE productName = ? and Status = 'active'`;
    const [productRows] = await pool.query(selectProduct, [
      `${businessName}_products`,
      productName,
    ]);

    if (productRows.length === 0) {
      const insertProduct = `INSERT INTO ?? (registeredBy, productRegistrationDate, productsUnitCost, productsUnitPrice, productName, minimumQty, Status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await pool.query(insertProduct, [
        `${businessName}_products`,
        userID,
        productRegistrationDate,
        productUnitCost,
        productUnitPrice,
        productName,
        minimumQty,
        "active",
      ]);

      return { data: "productIsAdded" };
    } else {
      return { data: "productIsAlreadyAddedBefore" };
    }
  } catch (error) {
    console.error(error);

    return (500).json({ error: "Internal Server Error" });
  }
};
const searchProducts = async (body, query) => {
    try {
      let businessName = "";
      let { toDate, fromDate, selectSearches, productName, businessId } = query;
      let { userID } = body;
      businessName = await getUniqueBusinessName(businessId, userID);
      if (businessName === `you are not owner of this business_products`) {
        return { data: "Error", Error: businessName };
      }
      let selectProducts = `select * from ?? where Status='active' || Status IS NULL`;
      let tableName = `${businessName}_products`;
      const [rows] = await pool.query(selectProducts, [tableName]);
      console.log("Selected PRODUCTS=", rows);
      return { products: rows };
    } catch (error) {
      console.log("Error", error);
      return { Error: error.message };
    }
  },
  deleteProducts = async (body) => {
    try {
      let { ProductId, mainProductId, businessId, userID, userPassword } = body;
      console.log("body", body);
      // return;

      let businessName = await getUniqueBusinessName(businessId, userID);
      console.log(" businessName == == ", businessName);

      let select = `select * from usersTable where userId='${userID}'`;
      let [rows] = await pool.query(select);

      console.log("rows", rows, " select", select);
      // return;
      if (rows.length == 0) {
        return {
          data: "Error",
          Messages: "Your are not allowed to do this action",
        };
      }

      let deleteData = `DELETE FROM ?? WHERE ProductId = ? or mainProductId=?`;
      if (mainProductId == null) mainProductId = ProductId;

      let [results] = await pool.query(deleteData, [
        `${businessName}_products`,
        ProductId,
        mainProductId,
      ]);
      console.log("delete results", results);
      return { data: results };
    } catch (error) {
      console.log("error", error);
    }
  },
  updateProducts = async (body) => {
    try {
      let {
        businessId,
        userID,
        id,
        productName,
        productPrice,
        productCost,
        minimumQty,
      } = body;
      let businessName = await getUniqueBusinessName(businessId, userID);

      // Retrieve current product details
      const [currentProductResult] = await pool.query(
        `SELECT * FROM ${businessName}_products WHERE ProductId = ?`,
        [id]
      );
      const currentProduct = currentProductResult[0];

      // Insert updated product as a new entry with historical data
      const insertQuery = `
            INSERT INTO ${businessName}_products 
                (productRegistrationDate, productsUnitCost, productsUnitPrice, productName, minimumQty, mainProductId, prevUnitCost, prevUnitPrice, prevProductName, prevMinimumQty, Status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const insertValues = [
        CurrentYMD,
        productCost,
        productPrice,
        productName,
        minimumQty,
        currentProduct.mainProductId || currentProduct.ProductId,
        currentProduct.productsUnitCost,
        currentProduct.productsUnitPrice,
        currentProduct.productName,
        currentProduct.minimumQty,
        "active",
      ];
      await pool.query(insertQuery, insertValues);

      // Mark the current product as changed
      await pool.query(
        `UPDATE ${businessName}_products SET status = 'changed' WHERE ProductId = ?`,
        [id]
      );

      return { data: "Updated successfully" };
    } catch (error) {
      console.error("Error in updateProducts:", error);
      return { error: "Unable to update products" };
    }
  },
  getSingleProducts = async (body) => {
    try {
      let productName = body.searchInput;
      let { businessId, Target, userID } = body;
      console.log("@getSingleProducts body", body);

      let businessName = await getUniqueBusinessName(businessId, userID);
      console.log("businessName", businessName);

      if (
        businessName === "you are not the owner of this business" ||
        businessName === `Error in server 456`
      ) {
        return { data: businessName };
      }

      let query = `SELECT * FROM ?? WHERE productName LIKE ? and Status=?`;
      let values = [
        `${businessName}_products`,
        "%" + productName + "%",
        "active",
      ];

      if (Target === "All Products") {
        query = `SELECT * FROM ?? WHERE Status=?`;
        values = [`${businessName}_products`, "active"];
      }

      const [rows] = await pool.query(query, values);
      console.log("rows", rows);
      return { data: rows };
    } catch (error) {
      console.error("An error occurred:", error);
      return { data: "Error", Error: error.message };
    }
  },
  getRegisteredProducts = async (body) => {
    try {
      let { userID, BusinessId, businessName } = body;
      businessName = await getUniqueBusinessName(BusinessId, userID);
      if (businessName == "you are not owner of this business") {
        return businessName;
      }
      let select = "SELECT * FROM ?? where Status='active'";
      let table = `${businessName}_products`;
      let [rows] = await pool.query(select, [table]);
      //console.log("in getRegisteredProducts", rows);
      return { data: rows };
    } catch (error) {
      console.log("error", error);
      return { data: "Error" };
    }
  };
module.exports = {
  addProducts,
  searchProducts,
  deleteProducts,
  updateProducts,
  getSingleProducts,
  getRegisteredProducts,
};
