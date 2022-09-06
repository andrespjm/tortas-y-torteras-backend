import { Reviews } from '../models/Reviews.js';
import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';
import { Products } from '../models/Products.js';

const productReview = async productId => {
	return await Reviews.findAll({
		where: { ProductId: productId },
		include: [
			{
				model: Users,
				attributes: ['firstName', 'lastName', 'displayName', 'profilePicture'],
			},

			{
				model: Products,
				attributes: ['img_home'],
			},
		],
	});
};

const allReview = async () => {
	return await Reviews.findAll({
		include: {
			model: Users,
			as: 'user',
			attributes: ['firstName', 'lastName', 'displayName'],
		},
	});
};

const createReview = async (
	comments,
	score,
	productId,
	userId,
	idOrderItems
) => {
	const review = await Reviews.findOrCreate({
		where: {
			ProductId: productId,
			UserId: userId,
			idOrderItems,
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
		where: { ProductId: productId },
		attributes: ['score'],
	});
	const sumScore = allScore.map(e => e.score).reduce((a, b) => a + b, 0);
	const averageScore = (sumScore / allScore.length).toFixed(1);
	const data = {
		averageScore,
		numberRevisions: allScore.length,
	};
	return data;
};

const setJsonReviews = async () => {
	const data = dataJson.Reviews;
	data.map(
		async e =>
			await Reviews.create({
				ProductId: e.ProductId,
				UserId: e.UserId,
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
	// userReviewByProduct,
};
