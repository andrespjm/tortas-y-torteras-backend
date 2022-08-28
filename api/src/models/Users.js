// import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
const REGEX = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

export const Users = sequelize.define(
	'Users',
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		firstName: {
			type: DataTypes.STRING,
			// allowNull: false,
			validate: {
				is: REGEX,
			},
		},
		lastName: {
			type: DataTypes.STRING,
			// allowNull: false,
			validate: {
				is: REGEX,
			},
		},
		displayName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// logic erase
		disabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			isEmail: { msg: 'Wrong email' },
		},
		birthDate: {
			type: DataTypes.DATE,
		},
		gender: {
			type: DataTypes.ENUM('Male', 'Female', 'Other'),
		},
		identityCard: {
			type: DataTypes.STRING,
		},
		profilePicture: {
			type: DataTypes.STRING,
		},
		processCompleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		// password: DataTypes.STRING,
		// typeIdentityCard: {
		// 	type: DataTypes.STRING,
		// },
	}
	// ,

	// {
	// 	hooks: {
	// 		beforeCreate: async function (user) {
	// 			const salt = await bcrypt.genSalt(10); // any number you want
	// 			user.password = await bcrypt.hash(user.password, salt);
	// 		},
	// 		beforeUpdate: async function (user) {
	// 			const salt = await bcrypt.genSalt(10); // any number you want
	// 			user.password = await bcrypt.hash(user.password, salt);
	// 		},
	// 	},
	// }
);

// Users.prototype.validPassword = async function (password) {
// 	return await bcrypt.compare(password, this.password);
// };
