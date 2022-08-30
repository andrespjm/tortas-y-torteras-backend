import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import { Colors } from '../models/Colors.js';
import { ProductTypes } from '../models/ProductTypes.js';
import { Stocks } from '../models/Stocks.js';

const REGEX = /^[a-zA-Z0-9-()-: .]+$/;
export const Products = sequelize.define(
	'Products',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			// defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			// unique: true,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			isEven(value) {
				if (!REGEX.test(value) || value.length > 255 || !value.trim().length)
					return { msg: 'Invalid description' };
			},
		},
		img_home: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		img_detail: {
			type: DataTypes.ARRAY(DataTypes.JSON),
			allowNull: false,
		},
		collection: {
			type: DataTypes.ENUM('Flowers', 'Abstract', 'Butterflies', 'Other'),
		},

		artist: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

Products.belongsToMany(Colors, { through: 'ProductsColors' });
Colors.belongsToMany(Products, { through: 'ProductsColors' });

Products.belongsToMany(ProductTypes, { through: Stocks });
ProductTypes.belongsToMany(Products, { through: Stocks });
ProductTypes.hasMany(Stocks);
Stocks.belongsTo(ProductTypes);
Products.hasMany(Stocks);
Stocks.belongsTo(Products);
