const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");

const getExpensesLists = async (query, body) => {
  try {
    console.log("query==", query, "body===", body);
    let { businessId } = query;
    let { userID } = body;
    let businessName = await getUniqueBusinessName(businessId, userID);

    if (businessName === "you are not owner of this business") {
      return { data: businessName };
    }

    // Construct the SQL query to retrieve expenses with user information
    let selectQuery = `select * from?? , ??  where userId=registeredBy`;
    let costValues = [`${businessName}_Costs`, "usersTable"];

    // Execute the query
    const [result] = await pool.query(selectQuery, costValues);

    // Return the result
    return { data: result };
  } catch (error) {
    console.error("Error in getExpensesLists:", error);
    return { data: "Error fetching expenses" };
  }
};
const updateExpencesItem = async (body) => {
  try {
    let { businessName, costName, costsId, businessId, userID } = body;

    // Fetch unique business name asynchronously
    businessName = await getUniqueBusinessName(businessId, userID);
    console.log("@updateCostData businessName", businessName);
    let queryTocheck = `SELECT * FROM ?? WHERE costName = ?`;
    let [checkResult] = await pool.query(queryTocheck, [
      businessName + "_Costs",
      costName,
    ]);
    if (checkResult.length > 0) {
      return { data: "already exist" };
    }

    const updateQuery = `UPDATE ?? SET costName=? WHERE costsId=?`;
    const table = businessName + "_Costs";
    const values = [table, costName, costsId];

    const results = await pool.query(updateQuery, values);
    return { data: "updated successfully", results };
  } catch (error) {
    return { data: error, Type: "error" };
  }
};
const searchExpByName = async (body) => {
  try {
    const { expName, businessId, userID } = body;
    const businessName = await getUniqueBusinessName(businessId, userID);

    if (businessName === "you are not owner of this business") {
      return { data: businessName };
    }
    // Construct the SQL query with a dynamic LIKE clause
    const selectQuery = `
      SELECT * 
      FROM ${businessName}_Costs 
      WHERE costName LIKE ?
    `;

    // Execute the query passing '%' + expName + '%' to search for any occurrence of expName
    const [rows] = await pool.query(selectQuery, [`%${expName}%`]);

    return { data: rows };
  } catch (error) {
    console.error("Error searching expenses by name:", error);
    return { error: "Internal Server Error" };
  }
};
let deleteExpenceItem = async (body) => {
  try {
    const { userID, costsId, businessId } = body;

    // Retrieve businessName based on businessId and userID
    const businessName = await getUniqueBusinessName(businessId, userID);

    if (!businessName) {
      return { data: "Please make logout and login again." };
    }

    // Check if the business and user combination is valid
    const [businessData] = await pool.query(
      "SELECT * FROM Business WHERE uniqueBusinessName = ? AND ownerId = ?",
      [businessName, userID]
    );

    if (!businessData.length) {
      return { data: "You are not allowed" };
    }

    // Delete the cost item
    const table = `${businessName}_Costs`;
    await pool.query("DELETE FROM ?? WHERE costsId = ?", [table, costsId]);

    return { data: "deleted" };
  } catch (error) {
    console.error(error);
    return { data: "Internal Server Error" };
  }
};
let getExpTransactions = async (query, body) => {
  try {
    let { businessId, fromDate, toDate, searchTarget, InputValue } = query;
    let { userID } = body;
    let businessName = await getUniqueBusinessName(businessId, userID);
    let sql = `SELECT * FROM ?? as e, ?? as c WHERE e.costRegisteredDate BETWEEN ? AND ? AND e.costId = c.costsId`;
    // define the input data as an array of values
    let inputExp = [
      `${businessName}_expenses`,
      `${businessName}_Costs`,
      fromDate,
      toDate,
    ];
    if (searchTarget == "singleTransaction") {
      console.log("InputValue", InputValue);
      let { costName, costsId } = InputValue;
      sql += ` and c.costsId = ?`;
      inputExp.push(costsId);
    }
    let [rows] = await pool.query(sql, inputExp);
    return {
      expenceTransaction: rows,
    };
  } catch (error) {
    return { expenceTransaction: "error no 113" };
  }
};
async function inserExpencesItem({
  businessName,
  data,
  userID,
  registrationDate,
}) {
  try {
    const sanitizedCostName = data.Costname;
    const checkQuery = "SELECT * FROM ?? WHERE costName=?";
    const checkValues = [businessName, sanitizedCostName];

    const [checkRows] = await pool.query(checkQuery, checkValues);
    console.log("checkRows", checkRows);

    if (checkRows.length > 0) {
      return { data: "already registered before" };
    } else {
      const insertQuery =
        "INSERT INTO ?? (costName, registeredBy, expItemRegistrationDate) VALUES (?, ?, ?)";
      const insertValues = [
        businessName,
        sanitizedCostName,
        userID,
        registrationDate,
      ];

      const [insertRows] = await pool.query(insertQuery, insertValues);
      console.log(`Rows on ${businessName}`, insertRows);

      if (insertRows.affectedRows > 0) {
        return { data: "Registered successfully" };
      } else {
        return { data: "Unable to register data" };
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return { error };
  }
}

let AddExpencesItems = async (body) => {
  try {
    let { businessId, registrationDate, userID } = body;
    let businessName = await getUniqueBusinessName(businessId, userID);
    if (businessName == "you are not owner of this business")
      return { data: "you are not owner of this business" };
    let Results = await inserExpencesItem({
      businessName: `${businessName}_Costs`,
      data: body,
      userID,
      registrationDate,
    });
    console.log("Results", Results);
    return Results;
  } catch (error) {
    console.log("error", error);
    return { data: error, Type: "error" };
  }
};
const registerExpenseTransaction = async (body) => {
  try {
    const { businessId, userID, costData, expDescription, expAmount, expDate } =
      body;
    console.log("costData", costData);
    const businessName = await getUniqueBusinessName(businessId, userID);
    if (businessName == "you are not owner of this business")
      return { data: "you are not owner of this business" };
    const costsId = costData.costsId;
    let costName = costData.costName.replace(/ /g, "");
    const table = `${businessName}_expenses`;
    const insertQuery = `INSERT INTO ?? (costId, costAmount, costDescription, costRegisteredDate) VALUES (?, ?, ?, ?)`;
    const insertValues = [table, costsId, expAmount, expDescription, expDate];

    const [results] = await pool.query(insertQuery, insertValues);
    console.log("Inserted values:", results);

    return { data: "Inserted properly" };
  } catch (error) {
    console.error("Error:", error);
    return { data: "error", error: "Unable to insert" };
  }
};
const updateMyExpensesList = async (body) => {
  try {
    const { businessId, userID, costDescription, costAmount, expenseId } = body;
    const businessName = await getUniqueBusinessName(businessId, userID);
    if (businessName == "you are not owner of this business")
      return { data: "you are not owner of this business" };
    console.log("Body:", body);
    console.log("Business Name:", businessName);

    const query =
      "UPDATE ?? SET costDescription = ?, costAmount = ? WHERE expenseId = ?";
    const table = `${businessName}_expenses`;
    const values = [table, costDescription, costAmount, expenseId];
    console.log(table, values);
    const [rows] = await pool.query(query, values);
    console.log(`Updated ${rows.affectedRows} row(s)`);
    if (rows.affectedRows > 0) {
      return { data: "Updated" };
    }
    return { data: "notUpdated" };
  } catch (error) {
    console.error("Error:", error);
    return { data: "Error updating expenses" };
  }
};
let deleteExpenceTransaction = async (body) => {
  try {
    let { expenseId, userID, businessId } = body;
    const businessName = await getUniqueBusinessName(businessId, userID);
    if (businessName == "you are not owner of this business")
      return { data: businessName };
    const table = `${businessName}_expenses`;
    let sqlToDelete = `DELETE FROM ?? WHERE expenseId=?`;
    const values = [table, expenseId];
    const [rows] = await pool.query(sqlToDelete, values);
    if (rows.affectedRows > 0) {
      return { data: "Successfully deleted" };
    } else {
      return { data: "Unable to delete" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { data: "Error deleting expenses" };
  }
};
module.exports = {
  deleteExpenceTransaction,
  updateExpencesItem,
  updateMyExpensesList,
  registerExpenseTransaction,
  AddExpencesItems,
  getExpTransactions,
  getExpensesLists,
  searchExpByName,
  deleteExpenceItem,
};
