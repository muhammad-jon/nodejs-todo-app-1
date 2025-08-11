import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "root", "root", {
  host: "localhost",
  dialect: "postgres",
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return { success: true, message: "Database connected successfully" };
  } catch (error) {
    console.log("Unable to connect to the database: ", error);
    return { success: false, error: error.message };
  }
};

// Test the connection when this module is imported
connection().then(result => {
  if (!result.success) {
    console.error("Database connection failed:", result.error);
  }
});

export { connection, sequelize };
