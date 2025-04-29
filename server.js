const express = require('express');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const calendarRoutes = require('./routes/calendar');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const estimateRoutes = require('./routes/estimate');
const invoiceRoutes = require('./routes/invoice');
const taskRoutes = require('./routes/task');

dotenv.config();

app.use(express.json());

const basePath = '/acbrocante/api';

app.use(`${basePath}/users`, userRoutes);
app.use(`${basePath}/customers`, customerRoutes);
app.use(`${basePath}/calendars`, calendarRoutes);
app.use(`${basePath}/categories`, categoryRoutes);
app.use(`${basePath}/products`, productRoutes);
app.use(`${basePath}/estimates`, estimateRoutes);
app.use(`${basePath}/invoices`, invoiceRoutes);
app.use(`${basePath}/tasks`, taskRoutes);
app.use(`${basePath}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
