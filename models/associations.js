module.exports = (sequelize) => {
    const { Customer, Calendar } = sequelize.models;

    Customer.hasMany(Calendar, {
        foreignKey: 'customer_id',
        as: 'calendars'
    });

    Calendar.belongsTo(Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
    });
};
