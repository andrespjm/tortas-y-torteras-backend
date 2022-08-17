/* eslint-disable camelcase */
import { Router } from 'express';
import { getAllColors } from '../controllers/colors.controller.js';
const router = Router();

router.get('/', async (req, res) => {
	try {
		const colors = await getAllColors();
		res.status(200).send(colors);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

export default router;
