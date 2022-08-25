import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
// import { Products } from './Products.js';

export const OrderItems = sequelize.define('OrderItems', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
		},
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	confirmed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

// OrderItems.belongsTo(Products);
