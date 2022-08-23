import { Router } from 'express';
import {
	getProductTypes,
	createProductType,
	updateProductType,
	deleteProductType,
} from '../controllers/productTypes.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		const productTypes = await getProductTypes();
		res.status(200).send(productTypes);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { name, diameter } = req.body;
	try {
		const productType = await createProductType(name, diameter);
		res.status(200).send(productType);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/:name', async (req, res) => {
	const { name } = req.params;
	const { newName, diameter } = req.body;
	try {
		const productType = await updateProductType(name, newName, diameter);
		res.status(200).send(productType);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:name', async (req, res) => {
	const { name } = req.params;
	try {
		await deleteProductType(name);
		res.status(200).send('Product Type deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
