const sequelize = require("./config/db");

(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Error syncing database:", error);
    } finally {
        process.exit();
    }
})();
