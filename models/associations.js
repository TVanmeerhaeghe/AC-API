module.exports = (sequelize) => {
    const { Customer, Calendar, Category, Product, Estimate, Invoice, Task } = sequelize.models;

    if (Customer && Calendar) {
        Customer.hasMany(Calendar, {
            foreignKey: 'customer_id',
            as: 'calendars'
        });
        Calendar.belongsTo(Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    }

    if (Category && Product) {
        Category.hasMany(Product, {
            foreignKey: 'category_id',
            as: 'products'
        });
        Product.belongsTo(Category, {
            foreignKey: 'category_id',
            as: 'category'
        });
    }

    if (Customer && Estimate) {
        Customer.hasMany(Estimate, {
            foreignKey: 'customer_id',
            as: 'estimates'
        });
        Estimate.belongsTo(Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    }

    if (Customer && Invoice) {
        Customer.hasMany(Invoice, {
            foreignKey: 'customer_id',
            as: 'invoices'
        });
        Invoice.belongsTo(Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    }

    if (Product && Invoice) {
        Product.hasMany(Invoice, {
            foreignKey: 'product_id',
            as: 'invoices'
        });
        Invoice.belongsTo(Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    }

    if (Invoice && Task) {
        Invoice.hasMany(Task, {
            foreignKey: 'invoice_id',
            as: 'tasks'
        });
        Task.belongsTo(Invoice, {
            foreignKey: 'invoice_id',
            as: 'invoice'
        });
    }

    if (Estimate && Task) {
        Estimate.hasMany(Task, {
            foreignKey: 'estimate_id',
            as: 'tasks'
        });
        Task.belongsTo(Estimate, {
            foreignKey: 'estimate_id',
            as: 'estimate'
        });
    }

    if (Customer && Product) {
        Customer.hasMany(Product, {
            foreignKey: 'buy_by',
            as: 'purchasedProducts'
        });
        Product.belongsTo(Customer, {
            foreignKey: 'buy_by',
            as: 'buyer'
        });
    }

    if (Product && Invoice) {
        Invoice.belongsToMany(Product, {
            through: InvoiceProduct,
            foreignKey: 'invoice_id',
            as: 'products'
        });
        Product.belongsToMany(Invoice, {
            through: InvoiceProduct,
            foreignKey: 'product_id',
            as: 'invoices'
        });
    }

};
