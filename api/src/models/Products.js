import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Products = sequelize.define('Projects', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
});
