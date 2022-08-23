import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Stocks = sequelize.define(
	'Stocks',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);
