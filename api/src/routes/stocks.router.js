/* eslint-disable camelcase */
import { Router } from 'express';
import {
	getStock,
	createStock,
	deleteStock,
} from '../controllers/stocks.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	const data = req.body;
	try {
		const stock = await getStock(data);
		res.status(200).send(stock);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { ProductTypeName, ProductId, quantity } = req.body;
	if (!ProductTypeName || !ProductId || !quantity) {
		throw new Error(
			'Need product type, quantity and productId to create stock'
		);
	}
	try {
		const stock = await createStock(ProductTypeName, ProductId, quantity);

		res.status(200).send(stock);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		deleteStock(id);
		res.status(200).send('Stock deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
