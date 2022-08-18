import { Users } from '../models/Users.js';

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

export { signUp, getUsers };
