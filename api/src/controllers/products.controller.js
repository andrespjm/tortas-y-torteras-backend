/* eslint-disable camelcase */
import axios from 'axios';
import { Colors } from '../models/Colors.js';
import { Products } from '../models/Products.js';

const getAllProducts = async () => {
	// set filters
	const products = await Products.findAll({
		include: {
			model: Colors,
			attributes: ['name', 'hex'],
			through: { attributes: [] },
		},
	});
	if (!products) throw new Error('Products not found');
	return products;
};

const createProduct = async data => {
	const {
		name,
		description,
		img_home,
		img_detail,
		collection,
		diameter,
		stock,
		price,
		type,
		size,
		artist,
		colors,
	} = data;
	const newProduct = await Products.create({
		name,
		description,
		img_home,
		img_detail,
		collection,
		diameter,
		stock,
		price,
		type,
		size,
		artist,
	});

	const colorId = [];
	console.log(colors.length);
	for (let i = 0; i < colors.length; i++) {
		const [instance] = await Colors.findOrCreate({
			where: { hex: colors[i].hex },
			defaults: { name: colors[i].name },
		});
		colorId.push(instance.id);
	}
	await newProduct.setColors(colorId);

	return await Products.findOne({
		where: { name },
		include: {
			model: Colors,
			attributes: ['name', 'hex'],
			through: { attributes: [] },
		},
	});
};

const updateProduct = async (
	name,
	description,
	img_home,
	img_detail,
	collection,
	diameter,
	stock,
	price,
	type,
	size,
	artist,
	colors,
	id
) => {
	const product = await Products.findOne({ where: { id } });
	if (!product) {
		throw new Error('Product not found');
	} else {
		await Products.update(
			{
				name,
				description,
				img_home,
				img_detail,
				collection,
				diameter,
				stock,
				price,
				type,
				size,
				artist,
			},
			{
				where: { id },
			}
		);

		if (colors) {
			const colorId = [];
			console.log(colors.length);
			for (let i = 0; i < colors.length; i++) {
				const [instance] = await Colors.findOrCreate({
					where: { hex: colors[i].hex },
					defaults: { name: colors[i].name },
				});
				colorId.push(instance.id);
			}
			await product.setColors(colorId);

			return await Products.findOne({
				where: { name },
				include: {
					model: Colors,
					attributes: ['name', 'hex'],
					through: { attributes: [] },
				},
			});
		}

		return await Products.findOne({ where: { id } });
	}
};

const deleteProduct = async id => {
	return await Products.destroy({ where: { id } });
};

const getDetailProducts = async id => {
	// set filters
	const product = await Products.findByPk(id, {
		include: [
			{
				model: Colors,
				attributes: ['name', 'hex'],
				through: { attributes: [] },
			},
		],
	});
	if (!product) throw new Error('Product not found');
	return product;
};

const setJsonProducts = async () => {
	try {
		const data = (await axios(`http://localhost:5000/Products`)).data;

		const dataPromise = data.map(async el => {
			const colors = await Colors.findAll({ where: { hex: el.color } });
			return Products.create({
				name: el.product.name,
				description: el.product.description,
				img_home: el.product.img_home,
				img_detail: el.product.img_detail,
				collection: el.product.collection,
				diameter: el.product.diameter,
				stock: el.product.stock,
				price: el.product.price,
				type: el.product.type,
				size: el.product.size,
				artist: el.product.artist,
			}).then(data => data.setColors(colors));
		});

		await Promise.all(dataPromise);

		return 'Products loaded';
	} catch (error) {
		throw new Error(error.message);
	}
};

export {
	getAllProducts,
	updateProduct,
	setJsonProducts,
	createProduct,
	deleteProduct,
	getDetailProducts,
};
