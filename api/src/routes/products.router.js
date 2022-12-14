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
	const {
		collection1,
		collection2,
		collection3,
		collection4,
		stock,
		color1,
		color2,
		color3,
	} = req.query;
	try {
		verifyDir();
		const products = await getAllProducts();
		if (
			collection1 ||
			collection2 ||
			collection3 ||
			collection4 ||
			stock ||
			color1 ||
			color2 ||
			color3
		) {
			const productsFiltered = filterProducts(
				collection1,
				collection2,
				collection3,
				collection4,
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
			console.log('Imagenes subidas', images.imgDetail);
			data.img_detail = images.imgDetail || [];

			await createProduct(data);
			res.json({ success: 'ok' });
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
		const data = req.body;
		const image = req.files;
		try {
			const { id } = req.params;
			console.log(image);
			if (image) {
				const images = await uploadImageHelper(image);
				data.img_home = images.imgHome;
				// console.log(images);
				console.log('Imagenes subidas', images.imgDetail);
				data.img_detail = images.imgDetail || [];
				// 	if (images.imgHome && images.imgDetail.length > 0) {
				// 	data.img_home = images.imgHome;
				// 	data.img_detail = images.imgDetail || [];
				// } else if (images.imgHome) {
				// 	data.img_home = images.imgHome;
				// } else if (images.imgDetail.length > 0) {
				// 	data.img_detail = images.imgDetail || [];
				// } else {
				// 	console.log('no img');
				// }
			}

			await updateProduct(data, id);

			res.json({ success: 'ok' });
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
