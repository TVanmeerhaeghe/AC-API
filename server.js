const express = require("express");
const app = express();
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');

dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

