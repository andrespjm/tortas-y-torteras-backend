/* eslint-disable camelcase */
import { Colors } from '../models/Colors.js';
import dataJson from '../db/torterasJSON.js';

const getAllColors = async () => {
	const colors = await Colors.findAll();
	if (!colors) throw new Error('Colors not found');
	return colors;
};

const createColor = async (id, name, hex) => {
	const existentColor = await Colors.findOne({
		where: { id },
	});
	if (existentColor) throw new Error('Color already created');

	const color = await Colors.create({
		name,
		hex,
	});
	return color;
};

const updateColor = async (id, name, hex) => {
	const color = await Colors.findOne({ where: { id } });
	if (!color) {
		throw new Error('Color not found');
	} else {
		await Colors.update(
			{
				name,
				hex,
			},
			{
				where: { id },
			}
		);
	}
	return 'Color udated';
};

const deleteColor = async id => {
	await Colors.destroy({ where: { id } });
	return 'Color deleted';
};

const setJsonColors = async () => {
	const data = dataJson.Colors;

	const dataPromise = data.map(el => Colors.create(el));

	await Promise.all(dataPromise);

	return 'colors loaded';
};

export { setJsonColors, getAllColors, deleteColor, createColor, updateColor };
