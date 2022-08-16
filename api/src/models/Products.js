import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Products = sequelize.define('Products', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	img_main: {
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
	paddles: {
		type: DataTypes.ARRAY(DataTypes.JSON),
		allowNull: false,
	},
	collection: {
		type: DataTypes.ENUM('flowers', 'abstract', 'butterflies'),
	},
	diameter: {
		type: DataTypes.JSON,
	},
	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
});

// Data for test of send

// {
//     "name": "Tortera de flores 2",
//     "img_main": "https://picsum.photos/200/300",
//     "img_detail": ["https://picsum.photos/id/237/200/300", "https://picsum.photos/seed/picsum/200/300"],
//     "collection": "abstract",
//     "description": "This a deatail",
//     "paddles":[{
//         "name":"Black",
//         "color":"#000"
//     },
//     {
//         "name":"Verde",
//         "color":"green"
//     },
//     {
//         "name":"Red",
//         "color":"red"
//     }
//     ],
//     "diameter": {
//         "name":"Median",
//         "size":20
//     },
//     "stock": 1,
//     "price": 50.00
// }
