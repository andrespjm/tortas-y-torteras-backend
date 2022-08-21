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
import { verifyDir } from '../helpers/verify-dir.js';
const router = Router();

router.get('/', async (req, res) => {
	const { collection, stock, color1, color2, color3 } = req.query;
	try {
		verifyDir();
		const products = await getAllProducts();
		if (collection || stock || color1 || color2 || color3) {
			const productsFiltered = filterProducts(
				collection,
				stock,
				color1,
				color2,
				color3,
				products
			);
			productsFiltered.length > 0
				? res.json(productsFiltered)
				: res.status(500).send('Empty selection');
		} else {
			products.length > 0
				? res.json(products)
				: res.status(500).send('Empty selection');
		}
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
			// Uploader Image
			const images = await uploadImageHelper(image);
			data.img_home = images.imgHome;
			data.img_detail = images.imgDetail || [];

			const post = await createProduct(data);

			res.send(post);
		} catch (error) {
			res.status(500).send(error.message);
		}
	}
);

router.put(
	'/:id',
	fileUpload({
		useTempFiles: true,
		tempFileDir: './uploads',
	}),
	async (req, res) => {
		try {
			const { id } = req.params;
			const image = req.files;
			let {
				name,
				description,
				img_home,
				img_detail,
				collection,
				artist,
				colors,
				stock,
			} = req.body;
			const images = await uploadImageHelper(image);
			img_home = images.imgHome;
			img_detail = images.imgDetail || [];

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
	}
);

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
