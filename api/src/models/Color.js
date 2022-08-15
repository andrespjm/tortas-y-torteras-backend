import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const Color = sequelize.define('Projects', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	size: {
		type: DataTypes.STRING,
	},
	diameter: {
		type: DataTypes.STRING,
	},
});
