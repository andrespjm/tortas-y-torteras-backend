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
		quantityST: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
			},
		},
		priceST: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);
