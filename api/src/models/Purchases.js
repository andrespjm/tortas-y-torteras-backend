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
			'Reserved',
			'Paid',
			'Manufacturing',
			'Delivering',
			'Received'
		),
		allowNull: false,
	},
	phoneNumber: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	postalCode: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	shippingAddressStreet: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	shippingAddressNumber: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	shipmentCompany: {
		type: DataTypes.STRING,
	},
	shipmentTracking: {
		type: DataTypes.STRING,
	},
	shipmentFee: {
		type: DataTypes.STRING,
	},
});

Purchases.belongsTo(Users);
Users.hasMany(Purchases);

Stocks.belongsToMany(Purchases, { through: OrderItems });
Purchases.belongsToMany(Stocks, { through: OrderItems });
