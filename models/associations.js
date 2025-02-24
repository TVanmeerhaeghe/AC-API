module.exports = (sequelize) => {
    const { Customer, Calendar, Category, Product } = sequelize.models;

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
};

