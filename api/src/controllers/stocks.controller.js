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

const createStock = async (ProductTypeName, ProductId, quantity, price) => {
	const existentStock = await Stocks.findOne({
		where: { [Op.and]: [{ ProductTypeName }, { ProductId }] },
	});
	if (existentStock) throw new Error('Stock already created');

	const stock = await Stocks.create({
		ProductTypeName,
		ProductId,
		quantityST: quantity,
		priceST: price,
	});
	return stock;
};

const updateStock = async (id, quantity, price) => {
	const stock = await Stocks.findOne({ where: { id } });
	console.log(stock);
	if (!stock) {
		throw new Error('Stock not found');
	} else {
		await Stocks.update(
			{
				quantityST: quantity,
				priceST: price,
			},
			{
				where: { id },
			}
		);
	}
	return 'Stock udated';
};

const deleteStock = async id => {
	await Stocks.destroy({ where: { id } });
	return 'Stock deleted';
};

const applyPurchaseStock = async (quantity, stockId) => {
	Stocks.decrement('quantityST', {
		by: quantity,
		where: {
			id: stockId,
		},
	});
};

export { getStock, createStock, updateStock, deleteStock, applyPurchaseStock };
