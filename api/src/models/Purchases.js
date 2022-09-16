import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import { Users } from './Users.js';
import { OrderItems } from './OrderItems.js';
import { Stocks } from './Stocks.js';

export const Purchases = sequelize.define('Purchases', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	status: {
		type: DataTypes.ENUM(
			'Cart',
			'Reserved',
			'Paid',
			'Manufacturing',
			'Delivering',
			'Received'
		),
		defaultValue: 'Cart',
		allowNull: false,
	},
	phoneNumber: {
		type: DataTypes.TEXT,
	},
	postalCode: {
		type: DataTypes.STRING,
	},
	shippingAddressStreet: {
		type: DataTypes.STRING,
	},
	shippingAddressNumber: {
		type: DataTypes.TEXT,
	},
	shipmentCompany: {
		type: DataTypes.STRING,
	},
	shipmentTracking: {
		type: DataTypes.STRING,
	},
	shipmentFee: {
		type: DataTypes.FLOAT,
	},
	tax: {
		type: DataTypes.FLOAT,
	},
});

Purchases.belongsTo(Users);
Users.hasMany(Purchases);

Stocks.belongsToMany(Purchases, { through: OrderItems });
Purchases.belongsToMany(Stocks, { through: OrderItems });
Purchases.hasMany(OrderItems);
OrderItems.belongsTo(Purchases);
Stocks.hasMany(OrderItems);
OrderItems.belongsTo(Stocks);
