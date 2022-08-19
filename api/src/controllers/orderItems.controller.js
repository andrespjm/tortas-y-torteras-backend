import { OrderItems } from '../models/OrderItems.js';
import { Stocks } from '../models/Stocks.js';

const getOrderItems = async () => {
	const orderItems = await OrderItems.findAll();
	if (!orderItems) throw new Error('Orders not found');
	return orderItems;
};

const createOrderItems = async (quantity, stockId, purchaseId) => {
	const orderItem = await OrderItems.create({
		quantity,
		StockId: stockId,
		PurchaseId: purchaseId,
	});
	Stocks.decrement('quantity', {
		by: quantity,
		where: {
			id: stockId,
		},
	});

	return orderItem;
};

const deleteOrderItems = async id => {
	const orderItem = await OrderItems.findOne({
		where: { id },
	});
	await OrderItems.destroy({
		where: { id },
	});
	Stocks.increment('quantity', {
		by: orderItem.quantity,
		where: {
			id: orderItem.StockId,
		},
	});

	return orderItem;
};

export { getOrderItems, createOrderItems, deleteOrderItems };
