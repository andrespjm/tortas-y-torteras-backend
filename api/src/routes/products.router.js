import { Router } from 'express';
import {
	createProduct,
	getAllProducts,
} from '../controllers/products.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		res.send(await getAllProducts());
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/', async (req, res) => {
	try {
		const data = req.body;
		res.send(await createProduct(data));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
