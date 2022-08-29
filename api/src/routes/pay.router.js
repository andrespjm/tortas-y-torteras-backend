import { Router } from 'express';
import mercadopago from 'mercadopago';
const { ACCESS_TOKEN, HTTP_LOCAL } = process.env;
mercadopago.configure({
	access_token: ACCESS_TOKEN,
});

const router = Router();
router.get('/', (_, res) => {
	res.send('funciona');
});
router.post('/', async (req, res) => {
	const items = req.body;
	try {
		const preference = {
			items,
			back_urls: {
				success:
					process.env.NODE_ENV === 'production'
						? 'https://cakes-and-bases.vercel.app/paysuccess'
						: HTTP_LOCAL + '/paysuccess',
				failure:
					process.env.NODE_ENV === 'production'
						? 'https://cakes-and-bases.vercel.app/payfailure'
						: HTTP_LOCAL + '/payfailure',
			},
			auto_return: 'approved',
		};
		const response = await mercadopago.preferences.create(preference);
		const preferenceId = response.body.id;
		return res.send({ preferenceId });
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
