import { Router } from 'express';
import { sendMail } from '../nodemailer/sendMail.js';
// import ejs from 'ejs';

const router = Router();

router.get('/', (req, res) => res.send('works'));

router.post('/succ', async (req, res) => {
	const { purchaseMail, orderId, name } = req.body;
	try {
		res.render(
			'successfulPurchase',
			{ purchaseMail, orderId, name },
			(err, data) => {
				if (err) console.log(err);
				else {
					sendMail(purchaseMail, 'Purchase Confirmation', data);
				}
			}
		);

		res.status(200).send('mail delivered');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/shipp', async (req, res) => {
	const { purchaseMail, orderId, name, shipmentCompany, shipmentTracking } =
		req.body;
	try {
		res.render(
			'shippedPurchase',
			{ purchaseMail, orderId, name, shipmentCompany, shipmentTracking },
			(err, data) => {
				if (err) console.log(err);
				else {
					sendMail(purchaseMail, 'Your purchase was shipped', data);
				}
			}
		);

		res.status(200).send('mail delivered');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/received', async (req, res) => {
	const { purchaseMail, orderId, name } = req.body;
	try {
		res.render(
			'receivedPurchase',
			{ purchaseMail, orderId, name },
			(err, data) => {
				if (err) console.log(err);
				else {
					sendMail(purchaseMail, 'Your purchase was received', data);
				}
			}
		);

		res.status(200).send('mail delivered');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/disc', async (req, res) => {
	const { purchaseMail, name, porc } = req.body;
	try {
		res.render('discounts', { purchaseMail, name, porc }, (err, data) => {
			if (err) console.log(err);
			else {
				sendMail(purchaseMail, 'Your have a special discount', data);
			}
		});

		res.status(200).send('mail delivered');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
