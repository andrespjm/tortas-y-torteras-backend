/* eslint-disable camelcase */
import { Router } from 'express';
import {
	createColor,
	deleteColor,
	getAllColors,
	updateColor,
} from '../controllers/colors.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		const colors = await getAllColors();
		res.status(200).send(colors);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await deleteColor(id);
		res.status(200).send('Color deleted');
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/', async (req, res) => {
	const { name, hex } = req.body;
	if (!name || !hex) {
		throw new Error('Need name and hex to create color');
	}
	try {
		const color = await createColor(name, hex);

		res.status(200).send(color);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { name, hex } = req.body;
	try {
		const color = await updateColor(id, name, hex);

		res.status(200).send(color);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
