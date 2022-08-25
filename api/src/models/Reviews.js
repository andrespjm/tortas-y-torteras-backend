import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import { Products } from '../models/Products.js';
import { Users } from '../models/Users.js';

export const Reviews = sequelize.define(
	'Reviews',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		score: {
			type: DataTypes.INTEGER,
			validate: {
				min: 0,
				max: 5,
			},
		},
		comments: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: false,
	}
);

Reviews.belongsTo(Products, { as: 'product', allowNull: false });
Reviews.belongsTo(Users, { as: 'user', allowNull: false });
