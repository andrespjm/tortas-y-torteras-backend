import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const OrderItems = sequelize.define('OrderItems', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
