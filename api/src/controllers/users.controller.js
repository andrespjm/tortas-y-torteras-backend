import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';

// /**
//  *
//  * @param {name, lastname, email, password} data
//  * @returns user => user created | user => error
//  */
const signUp = async data => {
	const user = await Users.create(data);
	return user;
};

const getUsers = async () => {
	const users = await Users.findAll();
	return users;
};

const getUsersId = async id => {
	const user = await Users.findOne({ where: { id }});
	return user;
};

const updateUserEnabled = async (id, enabled) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) throw new Error('User not found');
	await Users.update({ enabled }, { where: { id } });
	return 'User updated';
};

const updateUser = async (
	id,
	name,
	lastname,
	typeIdentityCard,
	password,
	birthDate,
	gender,
	identityCard
) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) throw new Error('User not found');
	await Users.update(
		{
			name,
			lastname,
			typeIdentityCard,
			password,
			birthDate,
			gender,
			identityCard,
		},
		{ where: { id } }
	);
	return 'User updated';
};

const setJsonUsers = async () => {
	const data = dataJson.Users;

	const dataPromise = data.map(el => Users.create(el));

	await Promise.all(dataPromise);

	return 'users loaded';
};

export {
	signUp,
	getUsers,
	setJsonUsers,
	getUsersId,
	updateUserEnabled,
	updateUser,
};
