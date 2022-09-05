import { Reviews } from '../models/Reviews.js';
import { Users } from '../models/Users.js';
import dataJson from '../db/torterasJSON.js';
import { Products } from '../models/Products.js';

const productReview = async productId => {
	return await Reviews.findAll({
		where: { productId },
		include: [
			{
				model: Users,
				as: 'user',
				attributes: ['firstName', 'lastName', 'displayName'],
			},

			{
				model: Products,
				as: 'product',
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

const createReview = async (comments, score, productId, userId) => {
	const review = await Reviews.findOrCreate({
		where: {
			ProductId: productId,
			UserId: userId,
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

// const userReviewByProduct = async (productId, userId) => {
// 	// const productId = [1, 2, 3, 5, 100];
// 	// const userId = 'b94011bb-fdb7-4b06-ba02-552c2199c1f1';

// 	const promise = [];

// 	for (let i = 0; i < productId.length; i++) {
// 		const resp = await Reviews.findAll({
// 			where: {
// 				[Op.and]: [{ ProductId: productId[i] }, { UserId: userId }],
// 			},
// 		});
// 		promise.push(resp);
// 	}
// 	return promise.map(e => {
// 		if (e.length) return true;
// 		return false;
// 	});
// };

export {
	createReview,
	averageProductScore,
	productReview,
	allReview,
	setJsonReviews,
	// userReviewByProduct,
};
