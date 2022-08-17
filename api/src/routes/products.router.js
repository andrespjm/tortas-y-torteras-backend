/* eslint-disable camelcase */
import { Router } from 'express';
import {
	createProduct,
	getAllProducts,
	updateProduct,
	deleteProduct,
	getDetailProducts,
} from '../controllers/products.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		res.send(await getAllProducts());
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

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const confirmation = deleteProduct(id);
		confirmation
			? res.json({ msj: 'product removed successfully' })
			: res
					.status(404)
					.json({ msj: 'The product you want to delete was not found' });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		res.send(await getDetailProducts(id));
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
