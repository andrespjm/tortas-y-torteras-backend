import { Router } from 'express';
import { getAllProducts } from '../controllers/products.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		res.send(await getAllProducts());
	} catch (error) {}
});

export default router;
