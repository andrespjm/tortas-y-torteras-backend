/* eslint-disable camelcase */
import { Router } from 'express';
import {
	getPurchases,
	postPurchases,
} from '../controllers/purchases.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	const { id } = req.body;
	try {
		const purchases = await getPurchases(id);
		res.status(200).send(purchases);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const purchaseData = req.body;
		const purchase = await postPurchases(purchaseData, id);
		res.status(200).send(purchase);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
