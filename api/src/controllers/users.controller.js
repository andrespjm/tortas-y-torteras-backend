import dataJson from '../db/torterasJSON.js';
import { Users } from '../models/Users.js';
import { Purchases } from '../models/Purchases.js';
import { OrderItems } from '../models/OrderItems.js';
import { Stocks } from '../models/Stocks.js';
import { Products } from '../models/Products.js';
import { Op } from 'sequelize';
import { Reviews } from '../models/Reviews.js';

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
	const user = await Users.findOne({ where: { id } });
	return user;
};

const getUserPurchases = async id => {
	const user = await Users.findOne({
		where: {
			id,
		},
		order: [[{ model: Purchases }, 'createdAt', 'DESC']],
		include: [
			{
				model: Purchases,
				where: {
					status: {
						[Op.not]: 'Cart',
					},
				},
				include: [
					{
						model: OrderItems,
						include: [
							{
								model: Stocks,
								include: [
									{
										model: Products,
										include: [
											{
												model: Reviews,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	});

	return user;
};

const updateUserEnabled = async (id, enabled) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) throw new Error('User not found');
	await Users.update({ enabled }, { where: { id } });
	const userUpdated = await Users.findOne({ where: { id } });
	return userUpdated;
};

const updateUser = async (id, data) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) throw new Error('User not found');
	await Users.update(data, { where: { id } });
	const userUpdated = await Users.findOne({ where: { id } });
	return userUpdated;
};

const deleteAccountUser = async (id, data) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) throw new Error('User not found');
	await Users.update({ enabled: false }, { where: { id } });
	const userUpdated = await Users.findOne({ where: { id } });
	return userUpdated;
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
	getUserPurchases,
	deleteAccountUser,
};
