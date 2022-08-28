/* eslint-disable camelcase */
import { Purchases } from '../models/Purchases.js';
import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';
import { Op } from 'sequelize';
import { Stocks } from '../models/Stocks.js';
import { OrderItems } from '../models/OrderItems.js';

const getPurchases = async userId => {
	if (userId) {
		return await Purchases.findAll({
			where: { UserId: userId },
			order: [['createdAt', 'DESC']],
			include: [Users, Stocks],
		});
	} else {
		return await Purchases.findAll({
			order: [['createdAt', 'DESC']],
			include: [Users, Stocks],
		});
	}
};

const getPurchasesCart = async userId => {
	return await Purchases.findAll({
		where: {
			UserId: userId,
			status: 'Cart',
		},
		order: [['createdAt', 'DESC']],
	});
};

const getPurchasesData = async userId => {
	return await Purchases.findAll({
		where: {
			UserId: userId,
			phoneNumber: { [Op.not]: null },
		},
		order: [['createdAt', 'DESC']],
	});
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

const updatePurchaseAdmin = async (
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

const updatePurchaseCart = async (
	id,
	status,
	shipmentFee,
	tax,
	phoneNumber,
	postalCode,
	shippingAddressStreet,
	shippingAddressNumber
) => {
	const purchase = await Purchases.findOne({ where: { id } });
	if (!purchase) {
		throw new Error('Purchase order not found');
	} else {
		await Purchases.update(
			{
				status,
				shipmentFee,
				tax,
				phoneNumber,
				postalCode,
				shippingAddressStreet,
				shippingAddressNumber,
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
		const purchase = await Purchases.create(el.data).then(data =>
			data.setUser(user.id)
		);
		const id = purchase.id;
		await Promise.all(
			el.items.map(el =>
				OrderItems.create({
					StockId: el.StockId,
					quantity: el.quantity,
					PurchaseId: id,
					price: el.price,
					confirmed: el.confirmed,
				})
			)
		);
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
	updatePurchaseAdmin,
	updatePurchaseCart,
	getPurchasesData,
	getPurchasesCart,
};
