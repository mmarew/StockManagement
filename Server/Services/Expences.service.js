const { pool } = require("../Config/db.config");
const { getUniqueBusinessName } = require("../UniqueBusinessName");

const getExpensesLists = async (query, body) => {
  try {
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
module.exports = { getExpensesLists };
