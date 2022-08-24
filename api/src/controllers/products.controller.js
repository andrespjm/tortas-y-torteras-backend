/* eslint-disable camelcase */
import { Op } from 'sequelize';
import dataJson from '../db/torterasJSON.js';
import { Colors } from '../models/Colors.js';
import { Products } from '../models/Products.js';
import { ProductTypes } from '../models/ProductTypes.js';
import { Stocks } from '../models/Stocks.js';

const getAllProducts = async () => {
	// set filters
	const products = await Products.findAll({
		order: [['createdAt', 'DESC']],
		include: [
			{
				model: Colors,
				attributes: ['name', 'hex'],
				through: { attributes: [] },
			},
			{
				model: ProductTypes,
				attributes: ['name', 'diameter'],
				through: { attributes: ['quantity', 'price'] },
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
		color1,
		color2,
		color3, // ["hex1,name1","hex2,name2","hex3,name3"]
		stockCakeTray,
		stockTurntable,
		priceCakeTray,
		priceTurntable,
	} = data;
	const newProduct = await Products.create({
		name,
		description,
		img_home,
		img_detail,
		collection,
		artist,
	});
	if (color1) {
		const colors = [
			{ hex: color1.split(',')[0], name: color1.split(',')[1] },
			{ hex: color2.split(',')[0], name: color2.split(',')[1] },
			{ hex: color3.split(',')[0], name: color3.split(',')[1] },
		];
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

	if (stockCakeTray) {
		const stock = [
			{
				quantity: stockCakeTray,
				price: priceCakeTray,
				productTypeName: 'Cake Tray',
			},
			{
				quantity: stockTurntable,
				price: priceTurntable,
				productTypeName: 'Turntable',
			},
		];
		const arrayStock = stock.map(el =>
			Stocks.create({
				quantity: el.quantity,
				price: el.price,
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
				attributes: ['name', 'diameter'],
				through: { attributes: ['quantity', 'price'] },
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
						price: el.price,
						ProductId: id,
						ProductTypeName: el.productTypeName,
					});
				} else {
					return Stocks.update(
						{
							quantity: el.quantity,
							price: el.price,
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
					attributes: ['name', 'diameter'],
					through: { attributes: ['quantity', 'price'] },
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
			{
				model: ProductTypes,
				attributes: ['name', 'diameter'],
				through: { attributes: ['quantity', 'price'] },
			},
		],
	});
	if (!product) throw new Error('Product not found');
	return product;
};

const setJsonProducts = async () => {
	const data = dataJson.Products;
	try {
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
						price: el.price,
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
	const data = dataJson.ProductType;
	try {
		const dataPromise = data.map(el => ProductTypes.create(el));

		await Promise.all(dataPromise);

		return 'ProductTypes loaded';
	} catch (error) {
		throw new Error(error.message);
	}
};

const filterProducts = (
	collection1,
	collection2,
	collection3,
	collection4,
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
			(color1
				? e.Colors.find(e => e.name.replace(/\s/g, '') === color1)
				: true) &&
			(color2
				? e.Colors.find(e => e.name.replace(/\s/g, '') === color2)
				: true) &&
			(color3 ? e.Colors.find(e => e.name.replace(/\s/g, '') === color3) : true)
	);

	return combinedFilter.filter(
		e =>
			e.collection === collection1 ||
			e.collection === collection2 ||
			e.collection === collection3 ||
			e.collection === collection4
	);
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
