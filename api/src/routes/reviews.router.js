import { Router } from 'express';
import {
	createReview,
	productReview,
	averageProductScore,
	allReview,
	// userReviewByProduct,
} from '../controllers/reviews.controller.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const { productId } = req.query;
		productId
			? res.json(await productReview(productId))
			: res.json(await allReview());
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// router.get('/prueba', async (req, res) => {
// 	// const { productId, userId } = req.body;
// 	console.log();
// 	try {
// 		res.json(await userReviewByProduct());
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

router.get('/score/:productId', async (req, res) => {
	const { productId } = req.params;
	try {
		res.json(await averageProductScore(productId));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/', async (req, res) => {
	const { comments, score, productId, userId } = req.body;
	try {
		const review = await createReview(comments, score, productId, userId);
		review[1] === false
			? res.json({ msj: 'the user already made his score' })
			: res.json(review[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
