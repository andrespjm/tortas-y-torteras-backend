import { Products } from '../models/Products.js';

const getAllProducts = async () => {
	const products = await Products.findAll();
	if (!products) throw new Error('Products not found');
	return products;
};

const createProduct = async data => {
	const product = await Products.create(data);
	if (!product)
		throw new Error('Has occurred an error while creating the product');
	return product;
};

export { getAllProducts, createProduct };
