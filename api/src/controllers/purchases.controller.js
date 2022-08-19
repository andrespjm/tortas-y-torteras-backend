/* eslint-disable camelcase */
import axios from 'axios';
import { Purchases } from '../models/Purchases.js';
import { Users } from '../models/Users.js';

const getPurchases = async id => {
	if (id) {
		return await Purchases.findAll({ where: { UserId: id } });
	} else {
		return await Purchases.findAll();
	}
};

const postPurchases = async (purchaseData, id) => {
	const user = await Users.findOne({ where: { id } });
	if (!user) {
		throw new Error('User not found');
	}
	const purchase = await Purchases.create(purchaseData);
	purchase.setUser(id);
	return purchase;
};

const setJsonPurchases = async () => {
	const data = (await axios(`http://localhost:5000/Purchases`)).data;

	const dataPromise = data.map(async el => {
		const user = await Users.create(el.user);
		return Purchases.create(el.data).then(data => data.setUser(user.id));
	});

	await Promise.all(dataPromise);

	return 'purchases loaded';
};

export { setJsonPurchases, getPurchases, postPurchases };