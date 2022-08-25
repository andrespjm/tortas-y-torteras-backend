import { Reviews } from '../models/Reviews.js';
import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';
const productReview = async productId => {
	return await Reviews.findAll({
		where: { productId },
		include: {
			model: Users,
			as: 'user',
			attributes: ['name', 'lastname'],
		},
	});
};

const allReview = async () => {
	return await Reviews.findAll({
		include: {
			model: Users,
			as: 'user',
			attributes: ['name', 'lastname'],
		},
	});
};

const createReview = async (comments, score, productId, userId) => {
	const review = await Reviews.findOrCreate({
		where: {
			productId,
			userId,
		},
		defaults: {
			comments,
			score,
		},
	});

	return review;
};

const averageProductScore = async productId => {
	const allScore = await Reviews.findAll({
		where: { productId },
		attributes: ['score'],
	});
	const sumScore = allScore.map(e => e.score).reduce((a, b) => a + b, 0);
	const averageScore = sumScore / allScore.length;
	return averageScore.toFixed(1);
};

const setJsonReviews = async () => {
	const data = dataJson.Reviews;
	console.log(data);
	data.map(
		async e =>
			await Reviews.create({
				productId: e.productId,
				userId: e.userId,
				comments: e.comments,
				score: e.score,
			})
	);
};

export {
	createReview,
	averageProductScore,
	productReview,
	allReview,
	setJsonReviews,
};
