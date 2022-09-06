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
		idOrderItems: {
			type: DataTypes.INTEGER,
		},
	},
	{
		timestamps: false,
	}
);

Reviews.belongsTo(Products);
Products.hasMany(Reviews);
Reviews.belongsTo(Users);
Users.hasMany(Reviews);
