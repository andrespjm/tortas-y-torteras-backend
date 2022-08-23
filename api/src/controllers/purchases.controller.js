/* eslint-disable camelcase */
import { Purchases } from '../models/Purchases.js';
import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';

const getPurchases = async userId => {
	if (userId) {
		return await Purchases.findAll({ where: { UserId: userId } });
	} else {
		return await Purchases.findAll();
	}
};

const getPurchase = async id => {
	return await Purchases.findOne({ where: { id } });
};

const deletePurchase = async id => {
	await Purchases.destroy({ where: { id } });
	return 'Purchase deleted';
};

const postPurchases = async (purchaseData, userId) => {
	const user = await Users.findOne({ where: { id: userId } });
	if (!user) {
		throw new Error('User not found');
	}
	const purchase = await Purchases.create(purchaseData);
	purchase.setUser(userId);
	return purchase;
};

const updatePurchase = async (
	id,
	status,
	shipmentCompany,
	shipmentTracking
) => {
	const purchase = await Purchases.findOne({ where: { id } });
	if (!purchase) {
		throw new Error('Purchase order not found');
	} else {
		await Purchases.update(
			{
				status,
				shipmentCompany,
				shipmentTracking,
			},
			{
				where: { id },
			}
		);
	}
	return 'Purchase udated';
};

const setJsonPurchases = async () => {
	const data = dataJson.Purchases;

	const dataPromise = data.map(async el => {
		const user = await Users.create(el.user);
		return Purchases.create(el.data).then(data => data.setUser(user.id));
	});

	await Promise.all(dataPromise);

	return 'purchases loaded';
};

export {
	setJsonPurchases,
	getPurchases,
	postPurchases,
	getPurchase,
	deletePurchase,
	updatePurchase,
};
