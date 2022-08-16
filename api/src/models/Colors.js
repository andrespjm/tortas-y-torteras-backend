import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Colors = sequelize.define(
	'Colors',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hex: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);
