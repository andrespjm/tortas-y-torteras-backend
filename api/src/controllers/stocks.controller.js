/* eslint-disable camelcase */
import { Stocks } from '../models/Stocks.js';
import { Op } from 'sequelize';

const getStock = async data => {
	let stock = null;
	if (data.ProductTypeName && data.ProductId) {
		stock = await Stocks.findAll({
			where: {
				[Op.and]: [
					{ ProductTypeName: data.ProductTypeName },
					{ ProductId: data.ProductId },
				],
			},
		});
	} else if (data.ProductTypeName) {
		stock = await Stocks.findAll({
			where: { ProductTypeName: data.ProductTypeName },
		});
	} else if (data.ProductId) {
		stock = await Stocks.findAll({
			where: { ProductId: data.ProductId },
		});
	} else {
		stock = await Stocks.findAll();
	}
	if (stock.length === 0) {
		throw new Error('Stock not found');
	} else {
		return stock;
	}
};

const createStock = async (ProductTypeName, ProductId, quantity) => {
	const stock = await Stocks.create({ ProductTypeName, ProductId, quantity });
	if (!stock) throw new Error('Product stock not found');
	return stock;
};

const deleteStock = async id => {
	await Stocks.destroy({ where: { id } });
	return 'Stock deleted';
};

export { getStock, createStock, deleteStock };
