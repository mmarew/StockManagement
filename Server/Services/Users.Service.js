const { pool } = require("../Config/db.config");
const { insertIntoUserTable } = require("../Database");
let registerUsers = async (body) => {
  const { registerPhone, registerPassword, fullName } = body;

  try {
    let results = await insertIntoUserTable(
      fullName,
      registerPhone,
      registerPassword
    );
    return results;
  } catch (error) {
    console.error("Error registering user:", error);
    return null; // Or handle the error appropriately
  }
};

const getMyProfile = async (body, res) => {
  try {
    const { userID } = body;
    const query = `SELECT * FROM usersTable WHERE userId = ?`;
    const values = [userID];
    const [rows] = await pool.query(query, values);
    return { data: rows };
  } catch (error) {
    console.error("An error occurred:", error);
    return { error: "Internal server error" };
  }
};
const deleteUsers = async (body) => {
  try {
    const { userID } = body;

    // Check if the user has associated businesses
    const [businessResults] = await pool.query(
      "SELECT * FROM Business WHERE ownerId = ?",
      [userID]
    );

    if (businessResults.length > 0) {
      // If the user has associated businesses, drop associated tables
      const businessName = businessResults[0].uniqueBusinessName;
      const tables = [
        `${businessName}_expenses`,
        `${businessName}_costs`,
        `${businessName}_products`,
        `${businessName}_transaction`,
      ];

      const dropQuery = `DROP TABLE IF EXISTS ${tables.join(", ")}`;
      await pool.query(dropQuery);
    }

    // Delete the user's businesses
    await pool.query("DELETE FROM Business WHERE ownerId = ?", [userID]);

    // Delete the user from the usersTable
    await pool.query("DELETE FROM usersTable WHERE userId = ?", [userID]);

    return { data: "User and associated data deleted successfully." };
  } catch (error) {
    console.error(error);
    return {
      data: "Error occurred while deleting user and associated data.",
    };
  }
};

module.exports = { registerUsers, getMyProfile, deleteUsers };
