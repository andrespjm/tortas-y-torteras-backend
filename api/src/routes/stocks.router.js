/* eslint-disable camelcase */
import { Router } from 'express';
import {
	getStock,
	createStock,
	deleteStock,
	updateStock,
	applyPurchaseStock,
} from '../controllers/stocks.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	const data = req.query;
	try {
		const stock = await getStock(data);
		res.status(200).send(stock);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { ProductTypeName, ProductId, quantity, price } = req.body;
	if (!ProductTypeName || !ProductId || !quantity || !price) {
		throw new Error(
			'Need product type, quantity, price and productId to create stock'
		);
	}
	try {
		const stock = await createStock(
			ProductTypeName,
			ProductId,
			quantity,
			price
		);

		res.status(200).send(stock);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/apply', async (req, res) => {
	const { quantity, stockId } = req.body;
	try {
		await applyPurchaseStock(quantity, stockId);
		res.status(200).send('stock applied');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { quantity, price } = req.body;
	try {
		res.status(200).send(await updateStock(id, quantity, price));
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await deleteStock(id);
		res.status(200).send('Stock deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
