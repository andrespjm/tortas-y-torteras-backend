/* eslint-disable camelcase */
import { Op } from 'sequelize';
import axios from 'axios';
import { Colors } from '../models/Colors.js';
import { Products } from '../models/Products.js';
import { ProductTypes } from '../models/ProductTypes.js';
import { Stocks } from '../models/Stocks.js';

const getAllProducts = async () => {
	// set filters
	const products = await Products.findAll({
		include: [
			{
				model: Colors,
				attributes: ['name', 'hex'],
				through: { attributes: [] },
			},
			{
				model: ProductTypes,
				attributes: ['name', 'price', 'diameter'],
				through: { attributes: ['quantity'] },
			},
		],
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
		artist,
		colors,
		stock,
	} = data;
	const newProduct = await Products.create({
		name,
		description,
		img_home,
		img_detail,
		collection,
		artist,
	});
	if (colors) {
		const colorId = [];
		for (let i = 0; i < colors.length; i++) {
			const [instance] = await Colors.findOrCreate({
				where: { hex: colors[i].hex },
				defaults: { name: colors[i].name },
			});
			colorId.push(instance.id);
		}
		await newProduct.setColors(colorId);
	}

	if (stock) {
		const arrayStock = stock.map(el =>
			Stocks.create({
				quantity: el.quantity,
				ProductId: newProduct.id,
				ProductTypeName: el.productTypeName,
			})
		);

		await Promise.all(arrayStock);
	}

	return await Products.findOne({
		where: { name },
		include: [
			{
				model: Colors,
				attributes: ['name', 'hex'],
				through: { attributes: [] },
			},
			{
				model: ProductTypes,
				attributes: ['name', 'price', 'diameter'],
				through: { attributes: ['quantity'] },
			},
		],
	});
};

const updateProduct = async (
	name,
	description,
	img_home,
	img_detail,
	collection,
	artist,
	colors,
	stock,
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
				artist,
			},
			{
				where: { id },
			}
		);

		if (colors) {
			const colorId = [];
			for (let i = 0; i < colors.length; i++) {
				const [instance] = await Colors.findOrCreate({
					where: { hex: colors[i].hex },
					defaults: { name: colors[i].name },
				});
				colorId.push(instance.id);
			}
			await product.setColors(colorId);
		}

		if (stock) {
			const arrayStock = stock.map(async el => {
				const existentStock = await Stocks.findOne({
					where: {
						[Op.and]: [
							{ ProductId: id },
							{ ProductTypeName: el.productTypeName },
						],
					},
				});
				if (!existentStock) {
					return Stocks.create({
						quantity: el.quantity,
						ProductId: id,
						ProductTypeName: el.productTypeName,
					});
				} else {
					return Stocks.update(
						{
							quantity: el.quantity,
						},
						{
							where: {
								[Op.and]: [
									{ ProductId: id },
									{ ProductTypeName: el.productTypeName },
								],
							},
						}
					);
				}
			});

			await Promise.all(arrayStock);
		}

		return await Products.findOne({
			where: { id },
			include: [
				{
					model: Colors,
					attributes: ['name', 'hex'],
					through: { attributes: [] },
				},
				{
					model: ProductTypes,
					attributes: ['name', 'price', 'diameter'],
					through: { attributes: ['quantity'] },
				},
			],
		});
	}
};

const deleteProduct = async id => {
	return await Products.destroy({ where: { id } });
};

const getDetailProducts = async id => {
	// set filters ??
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
				artist: el.product.artist,
			}).then(product => {
				product.setColors(colors);
				el.stock?.map(el => {
					return Stocks.create({
						quantity: el.quantity,
						ProductId: product.id,
						ProductTypeName: el.productTypeName,
					});
				});
			});
		});

		await Promise.all(dataPromise);

		return 'Products loaded';
	} catch (error) {
		throw new Error(error.message);
	}
};

const setJsonProductTypes = async () => {
	try {
		const data = (await axios(`http://localhost:5000/ProductType`)).data;

		const dataPromise = data.map(el => ProductTypes.create(el));

		await Promise.all(dataPromise);

		return 'ProductTypes loaded';
	} catch (error) {
		throw new Error(error.message);
	}
};

const filterProducts = (
	collection,
	stock,
	color1,
	color2,
	color3,
	products
) => {
	const combinedFilter = products.filter(
		e =>
			(stock
				? stock === 'true'
					? e.ProductTypes.find(e => e.Stocks.quantity > 0)
					: !e.ProductTypes.find(e => e.Stocks.quantity > 0)
				: true) &&
			(collection ? e.collection === collection : true) &&
			(color1 ? e.Colors.find(e => e.name === color1) : true) &&
			(color2 ? e.Colors.find(e => e.name === color2) : true) &&
			(color3 ? e.Colors.find(e => e.name === color3) : true)
	);
	return combinedFilter;
};

export {
	getAllProducts,
	updateProduct,
	setJsonProducts,
	createProduct,
	deleteProduct,
	getDetailProducts,
	setJsonProductTypes,
	filterProducts,
};
