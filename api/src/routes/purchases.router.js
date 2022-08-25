/* eslint-disable camelcase */
import { Router } from 'express';
import ejs from 'ejs';
import {
	deletePurchase,
	getPurchase,
	getPurchases,
	postPurchases,
	updatePurchase,
} from '../controllers/purchases.controller.js';
import { sendMail } from '../nodemailer/sendMail.js';
const router = Router();

router.get('/', async (req, res) => {
	const { userId } = req.body;
	try {
		const purchases = await getPurchases(userId);
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
		const purchaseMail = await getPurchases(userId); 	//	get info to send a mail
		ejs.renderFile('../views/successfulPurchase.ejs', {purchaseMail}, (err, data) => {
			if(err) console.log(err)
			else{
				sendMail(purchaseMail[0].User.email, 'Successful Purchase', data)
			}
		})
		res.status(200).send(purchase);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { status, shipmentCompany, shipmentTracking } = req.body;
	try {
		res
			.status(200)
			.send(
				await updatePurchase(id, status, shipmentCompany, shipmentTracking)
			);
			const purchaseMail = await getPurchases(id);
			ejs.renderFile('../views/purchaseStatus.ejs', {purchaseMail}, (err, data) => {
				if(err) console.log(err)
				else{
					sendMail(purchaseMail[0].User.email, 'Successful Purchase', data)
				}
			})

	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
