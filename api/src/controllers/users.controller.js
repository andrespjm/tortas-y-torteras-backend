import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';
/**
 *
 * @param {name, lastname, email, password} data
 * @returns user => user created | user => error
 */
const signUp = async data => {
	const user = await Users.create(data);
	return user;
};

const getUsers = async () => {
	const users = await Users.findAll();
	return users;
};

const setJsonUsers = async () => {
	const data = dataJson.Users;

	const dataPromise = data.map(el => Users.create(el));

	await Promise.all(dataPromise);

	return 'users loaded';
};

export { signUp, getUsers, setJsonUsers };
