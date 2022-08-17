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

export { signUp };
