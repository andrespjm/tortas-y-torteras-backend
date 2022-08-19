/* eslint-disable camelcase */
import { Router } from 'express';
import fileUpload from 'express-fileupload';

import {
	createProduct,
	deleteProduct,
	filterProducts,
	getAllProducts,
	getDetailProducts,
	updateProduct,
} from '../controllers/products.controller.js';
import uploadImageHelper from '../helpers/uploud-image.helper.js';
const router = Router();

router.get('/', async (req, res) => {
	const { collection, stock, color1, color2, color3 } = req.query;
	try {
		const products = await getAllProducts();
		if (collection || stock || color1 || color2 || color3) {
			return res.json(
				filterProducts(collection, stock, color1, color2, color3, products)
			);
		}
		return res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});


router.post(
	'/',
	fileUpload({
		useTempFiles: true,
		tempFileDir: './uploads',
	}),
	async (req, res) => {
		const data = req.body;
		const image = req.files;
		try {
			const images = await uploadImageHelper(image);
			data.img_home = images.imgHome;
			data.img_detail = images.imgDetail || [];
			// data.color exclusivo para pruebas de tipo Body form-data
			// Comentar cuando ya reciba data desde el form de Front
			data.colors = [
				{ hex: '#0000FF', name: 'blue' },
				{ hex: '#FFC0CB', name: 'pink' },
				{ hex: '#FFF8FF', name: 'new' },
			];
			const post = await createProduct(data);

			res.send(post);
		} catch (error) {
			res.status(500).send(error.message);
		}

	}
);

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const {
		name,
		description,
		img_home,
		img_detail,
		collection,
		artist,
		colors,
		stock,
	} = req.body;

	try {
		const products = await updateProduct(
			name,
			description,
			img_home,
			img_detail,
			collection,
			artist,
			colors,
			stock,
			id
		);
		res.status(200).send(products);
	} catch (e) {
		res.send(e.message);
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
