import { Router } from 'express';
import mercadopago from 'mercadopago';
const { ACCESS_TOKEN } = process.env;
mercadopago.configure({
	access_token: ACCESS_TOKEN,
});

const router = Router();
router.get('/', (_, res) => {
	res.send('funciona');
});

router.post('/', async (req, res) => {
	// const ids =req.body
	try {
		const preference = {
			items: [
				{
					title: 'Mi producto',
					unit_price: 10,
					quantity: 1,
				},
			],
			back_urls: {
				success: 'http://127.0.0.1:5173/home',
				failure: 'http://127.0.0.1:5173/home',
				pending: 'http://127.0.0.1:5173/home',
			},
			auto_return: 'approved',
		};
		const response = await mercadopago.preferences.create(preference);
		const preferenceId = response.body.id;
		res.send({ preferenceId });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id,
	});
});

export default router;
