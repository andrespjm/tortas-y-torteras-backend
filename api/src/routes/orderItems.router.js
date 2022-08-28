import { Router } from 'express';
import {
	getOrderItems,
	createOrderItems,
	deleteOrderItems,
	addItem,
	createOrderItemsConfirmed,
	deleteOrderItemsConfirmed,
	removeItem,
	deleteItemsFromPurchase,
	changeOrderItemStatus,
} from '../controllers/orderItems.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	const { PurchaseId } = req.query;
	try {
		const orderItems = await getOrderItems(PurchaseId);
		res.status(200).send(orderItems);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { quantity, price, stockId, purchaseId } = req.body;
	try {
		const orderItem = await createOrderItems(
			quantity,
			price,
			stockId,
			purchaseId
		);
		res.status(200).send(orderItem);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/confirmed', async (req, res) => {
	const { quantity, price, stockId, purchaseId } = req.body;
	try {
		const orderItem = await createOrderItemsConfirmed(
			quantity,
			price,
			stockId,
			purchaseId
		);
		res.status(200).send(orderItem);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/add', async (req, res) => {
	const { num, id } = req.body;
	try {
		await addItem(num, id);
		res.status(200).send('Products added');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/confirmed', async (req, res) => {
	const { orderId } = req.body;
	try {
		await changeOrderItemStatus(orderId);
		res.status(200).send('Order items confirmed');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/remove', async (req, res) => {
	const { id } = req.body;
	console.log(id);
	try {
		await removeItem(id);
		res.status(200).send('Products removed');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await deleteOrderItems(id);
		res.status(200).send('Order items deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/PurchaseId/:PurchaseId', async (req, res) => {
	const { PurchaseId } = req.params;
	try {
		await deleteItemsFromPurchase(PurchaseId);
		res.status(200).send('Order items deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/confirmed/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await deleteOrderItemsConfirmed(id);
		res.status(200).send('Order items deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
