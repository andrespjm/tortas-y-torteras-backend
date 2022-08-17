import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import { Colors } from '../models/Colors.js';
const REGEX = /^[a-zA-Z0-9-()-: .]+$/;
export const Products = sequelize.define('Products', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
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
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isUrl: {
				msg: 'Invalid URL',
				protocols: ['https'],
				require_protocol: true,
			},
		},
	},
	img_detail: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		validate: {
			isUrl: {
				msg: 'Invalid URL',
				protocols: ['https'],
				require_protocol: true,
			},
		},
		allowNull: false,
	},
	collection: {
		type: DataTypes.ENUM('Flowers', 'Abstract', 'Butterflies'),
	},
	type: {
		type: DataTypes.ENUM('Cake Tray', 'Turntable'),
		allowNull: false,
	},
	size: {
		type: DataTypes.ENUM('Standard', 'Special'),
		allowNull: false,
	},
	diameter: {
		type: DataTypes.FLOAT,
		allowNull: false,
		// set(value) {
		// 	this.setDataValue(
		// 		'diameter',
		// 		this.size === 'Standard' ? (this.type === 'Turntable' ? 35 : 32) : value
		// 	);
		// },
	},
	// stock: {
	// 	type: DataTypes.INTEGER,
	// 	defaultValue: 1,
	// 	allowNull: false,
	// },
	price: {
		type: DataTypes.FLOAT,
	},
	artist: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

Products.belongsToMany(Colors, { through: 'ProductsColors' });
Colors.belongsToMany(Products, { through: 'ProductsColors' });
