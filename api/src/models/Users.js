import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
const REGEX = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

export const Users = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: REGEX,
			},
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				is: REGEX,
			},
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			isEmail: { msg: 'Wrong email' },
		},
		password: DataTypes.STRING,
	},
	{
		hooks: {
			beforeCreate: async function (user) {
				const salt = await bcrypt.genSalt(10); // any number you want
				user.password = await bcrypt.hash(user.password, salt);
			},
		},
	}
);

Users.prototype.validPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};