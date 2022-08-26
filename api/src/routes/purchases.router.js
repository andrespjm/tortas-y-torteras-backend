/* eslint-disable camelcase */
import { Router } from 'express';
import {
	deletePurchase,
	getPurchase,
	getPurchases,
	postPurchases,
	getPurchasesData,
	getPurchasesCart,
	updatePurchaseCart,
	updatePurchaseAdmin,
} from '../controllers/purchases.controller.js';

const router = Router();

router.get('/', async (req, res) => {
	const { userId } = req.query;
	try {
		const purchases = await getPurchases(userId);
		res.status(200).send(purchases);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.get('/cart', async (req, res) => {
	const { userId } = req.query;
	try {
		const purchases = await getPurchasesCart(userId);
		res.status(200).send(purchases);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.get('/data', async (req, res) => {
	const { userId } = req.query;
	try {
		const purchases = await getPurchasesData(userId);
		res.status(200).send(purchases);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const purchase = await getPurchase(id);
		res.status(200).send(purchase);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await deletePurchase(id);
		res.status(200).send(deleted);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const purchaseData = req.body;
		const purchase = await postPurchases(purchaseData, userId);

		res.status(200).send(purchase);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// admin
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { status, shipmentCompany, shipmentTracking } = req.body;
	try {
		res
			.status(200)
			.send(
				await updatePurchaseAdmin(id, status, shipmentCompany, shipmentTracking)
			);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// cart
router.put('/user/:id', async (req, res) => {
	const { id } = req.params;
	const {
		status,
		shipmentFee,
		tax,
		phoneNumber,
		postalCode,
		shippingAddressStreet,
		shippingAddressNumber,
	} = req.body;
	try {
		res
			.status(200)
			.send(
				await updatePurchaseCart(
					id,
					status,
					shipmentFee,
					tax,
					phoneNumber,
					postalCode,
					shippingAddressStreet,
					shippingAddressNumber
				)
			);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
