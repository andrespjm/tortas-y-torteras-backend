import { Router } from 'express';
import {
	addOrRemoveFromFavorites,
	allfavorites,
	removeFavorites,
	favoriteStatus,
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
router.put('/status', async (req, res) => {
	const { productid, userid } = req.body;
	try {
		console.log(productid, userid);
		const status = await favoriteStatus(userid, productid);
		res.send(status);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/', async (req, res) => {
	const { productid, userid } = req.body;
	try {
		const favorite = await addOrRemoveFromFavorites(userid, productid);
		res.send(favorite);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});
router.delete('/', async (req, res) => {
	const { userid, productid } = req.body;

	try {
		const favorite = await removeFavorites(userid, productid);
		res.send(favorite);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
