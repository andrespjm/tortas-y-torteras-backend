import { Likes, Products } from '../models/Products.js';
import { Users } from '../models/Users.js';

const allfavorites = async userid => {
	const favorites = await Users.findByPk(userid, {
		attributes: [],
		include: {
			model: Products,
			attributes: ['name', 'description', 'id', 'collection', 'img_home'],
			through: { attributes: [] },
		},
	});
	return favorites;
};
const favoriteStatus = async (userid, productid) => {
	const likes = await Likes.findOne({
		where: {
			UserId: userid,
			ProductId: productid,
		},
	});
	if (!likes) {
		return 'add to my favorites';
	} else {
		return 'Remove from my favorites';
	}
};

const addOrRemoveFromFavorites = async (userid, productid) => {
	const user = await Users.findByPk(userid);
	const product = await Products.findByPk(productid);
	const likes = await Likes.findOne({
		where: {
			UserId: userid,
			ProductId: productid,
		},
		attributes: ['UserId', 'ProductId'],
	});

	if (!likes) {
		await user.addProducts(product);
		return 'added to favorites';
	} else {
		user.removeProducts(product);
		return 'was removed from favorites';
	}
};
const removeFavorites = async (userid, productid) => {
	const user = await Users.findByPk(userid);
	const product = await Products.findByPk(productid);
	const likes = await Likes.findOne({
		where: {
			UserId: userid,
			ProductId: productid,
		},
	});
	if (likes) {
		user.removeProducts(product);
		return 'was removed from favorites';
	}
};

export {
	addOrRemoveFromFavorites,
	allfavorites,
	favoriteStatus,
	removeFavorites,
};
