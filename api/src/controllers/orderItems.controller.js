import { OrderItems } from '../models/OrderItems.js';
import { Stocks } from '../models/Stocks.js';
import { Products } from '../models/Products.js';
// import { Purchases } from '../models/Purchases.js';

const getOrderItems = async PurchaseId => {
	let orderItems = '';
	if (PurchaseId) {
		orderItems = await OrderItems.findAll({
			where: { PurchaseId },
			include: [
				{
					model: Stocks,
					include: [
						{ model: Products, attributes: ['name', 'img_home', 'id'] },
					],
					attributes: ['ProductTypeName', 'quantityST'],
				},
			],
		});
	} else {
		orderItems = await OrderItems.findAll({
			include: [
				{
					model: Stocks,
					include: [{ model: Products, attributes: ['name', 'img_home'] }],
					attributes: ['ProductTypeName', 'quantityST'],
				},
			],
		});
	}
	if (!orderItems) throw new Error('Orders not found');
	return orderItems;
};

const createOrderItems = async (quantity, price, stockId, purchaseId) => {
	const orderItem = await OrderItems.create({
		quantity,
		price,
		StockId: stockId,
		PurchaseId: purchaseId,
	});

	return orderItem;
};

const deleteItemsFromPurchase = async PurchaseId => {
	await OrderItems.destroy({
		where: { PurchaseId },
	});

	return 'Purchase order items deleted';
};

const deleteOrderItems = async id => {
	const orderItem = await OrderItems.findOne({
		where: { id },
	});
	await OrderItems.destroy({
		where: { id },
	});
	return orderItem;
};

const createOrderItemsConfirmed = async (
	quantity,
	price,
	stockId,
	purchaseId
) => {
	const orderItem = await OrderItems.create({
		quantity,
		price,
		StockId: stockId,
		PurchaseId: purchaseId,
		confirmed: true,
	});
	Stocks.decrement('quantityST', {
		by: quantity,
		where: {
			id: stockId,
		},
	});

	return orderItem;
};

const deleteOrderItemsConfirmed = async id => {
	const orderItem = await OrderItems.findOne({
		where: { id },
	});
	await OrderItems.destroy({
		where: { id },
	});
	Stocks.increment('quantityST', {
		by: orderItem.quantity,
		where: {
			id: orderItem.StockId,
		},
	});

	return orderItem;
};

const addItem = async (num, id) => {
	OrderItems.increment('quantity', {
		by: num,
		where: {
			id,
		},
	});

	return 'Product added';
};

const changeOrderItemStatus = async orderId => {
	OrderItems.update(
		{
			confirmed: true,
		},
		{
			where: { PurchaseId: orderId },
		}
	);
};

const removeItem = async id => {
	OrderItems.decrement('quantity', {
		by: 1,
		where: {
			id,
		},
	});

	return 'Product added';
};

export {
	getOrderItems,
	createOrderItems,
	deleteOrderItems,
	addItem,
	removeItem,
	createOrderItemsConfirmed,
	deleteOrderItemsConfirmed,
	deleteItemsFromPurchase,
	changeOrderItemStatus,
};
