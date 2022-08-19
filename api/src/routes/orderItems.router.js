import { Router } from 'express';
import {
	getOrderItems,
	createOrderItems,
	deleteOrderItems,
} from '../controllers/orderItems.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		const orderItems = await getOrderItems();
		res.status(200).send(orderItems);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { quantity, stockId, purchaseId } = req.body;
	try {
		const orderItem = await createOrderItems(quantity, stockId, purchaseId);
		res.status(200).send(orderItem);
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

export default router;
