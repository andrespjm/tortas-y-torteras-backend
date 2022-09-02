import { Router } from 'express';
import { getSales } from '../controllers/sales.controller.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const data = req.query;
		const sales = await getSales(data);
		res.send(sales);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
