/* eslint-disable camelcase */
import { Router } from 'express';
import {
	createProduct,
	getAllProducts,
	updateProduct,
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

// receives color:{name,hex}
router.post('/', async (req, res) => {
	const data = req.body;
	try {
		const post = await createProduct(data);
		res.send(post);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

// can receive one, many or all parameters
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const {
		name,
		description,
		img_home,
		img_detail,
		collection,
		diameter,
		stock,
		price,
		type,
		size,
		artist,
		colors,
	} = req.body;

	try {
		const products = await updateProduct(
			name,
			description,
			img_home,
			img_detail,
			collection,
			diameter,
			stock,
			price,
			type,
			size,
			artist,
			colors,
			id
		);
		res.status(200).send(products);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

export default router;
