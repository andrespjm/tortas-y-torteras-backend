import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const ProductTypes = sequelize.define('ProductTypes', {
	name: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	diameter: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	// price: {
	// 	type: DataTypes.FLOAT,
	// 	allowNull: false,
	// },
});
