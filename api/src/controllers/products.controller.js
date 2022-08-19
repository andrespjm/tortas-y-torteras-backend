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
	if (stock && collection && color1 && color2 && color3) {
		const combinedFilter = products.filter(
			e =>
				e.collection === collection &&
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2) &&
				e.Colors.find(e => e.name === color3) &&
				e.stock.find(e => e.stock > 0)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available with the selected colors, but you can make your special order',
		};
	}
	if (stock && collection && color1 && color2) {
		const combinedFilter = products.filter(
			e =>
				e.collection === collection &&
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2) &&
				e.stock.find(e => e.stock > 0)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available with the selected colors, but you can make your special order',
		};
	}
	if (stock && collection && color1) {
		const combinedFilter = products.filter(
			e =>
				e.collection === collection &&
				e.Colors.find(e => e.name === color1) &&
				e.stock.find(e => e.stock > 0)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available with the selected colors, but you can make your special order',
		};
	}
	if (collection && color1 && color2 && color3) {
		const combinedFilter = products.filter(
			e =>
				e.collection === collection &&
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2) &&
				e.Colors.find(e => e.name === color3)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available with the selected colors, but you can make your special order',
		};
	}
	if (collection && color1 && color2) {
		const combinedFilter = products.filter(
			e =>
				e.collection === collection &&
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available with the selected colors, but you can make your special order',
		};
	}
	if (collection && color1) {
		const combinedFilter = products.filter(
			e => e.collection === collection && e.Colors.find(e => e.name === color1)
		);
		if (combinedFilter.length) return combinedFilter;
		return {
			msj: 'We do not have this collection available but you can make your special order',
		};
	}
	if (stock && collection) {
		const productsFilter = products.filter(
			e => e.stock > 0 && e.collection === collection
		);
		if (productsFilter.length) return productsFilter;
		return {
			msj: 'We do not have this collection available but you can order yours',
		};
	}
	if (collection) {
		const filterByCollection = products.filter(
			e => e.collection === collection
		);
		return filterByCollection;
	}
	if (stock) {
		const filterByStock = products.filter(e => e.stock > 0);
		if (filterByStock.length > 0) return filterByStock;
		else return { msj: 'no products in stock' };
	}
	if (color1 && color2 && color3) {
		const colorSchemeFilter = products.filter(
			e =>
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2) &&
				e.Colors.find(e => e.name === color3)
		);
		if (colorSchemeFilter.length) return colorSchemeFilter;
		return {
			msj: 'We do not have products with this color combination but you can create your own special product',
		};
	}
	if (color1 && color2) {
		const colorSchemeFilter = products.filter(
			e =>
				e.Colors.find(e => e.name === color1) &&
				e.Colors.find(e => e.name === color2)
		);
		console.log(colorSchemeFilter);
		if (colorSchemeFilter.length) return colorSchemeFilter;
		return {
			msj: 'We do not have products with this color combination but you can create your own special product',
		};
	}
	if (color1) {
		const filterByColor = products.filter(e =>
			e.Colors.find(e => e.name === color1)
		);
		if (filterByColor.length) return filterByColor;
		return { msj: 'this color is not available' };
	}
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
