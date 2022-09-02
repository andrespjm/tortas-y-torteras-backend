import { Router } from 'express';
import {
	addOrRemoveFromFavorites,
	allfavorites,
} from '../controllers/favorites.controllers.js';

const router = Router();
router.get('/', async (req, res) => {
	const { userid } = req.query;
	try {
		const favorite = await allfavorites(userid);
		res.send(favorite);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/', async (req, res) => {
	const { productId, userId } = req.body;
	try {
		const favorite = await addOrRemoveFromFavorites(userId, productId);
		res.send(favorite);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});
export default router;
