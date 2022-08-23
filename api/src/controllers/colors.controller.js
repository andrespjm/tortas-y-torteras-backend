/* eslint-disable camelcase */
import { Colors } from '../models/Colors.js';
import dataJson from '../db/torterasJSON.js';

const getAllColors = async () => {
	const colors = await Colors.findAll();
	if (!colors) throw new Error('Colors not found');
	return colors;
};

const setJsonColors = async () => {
	const data = dataJson.Colors;

	const dataPromise = data.map(el => Colors.create(el));

	await Promise.all(dataPromise);

	return 'colors loaded';
};

export { setJsonColors, getAllColors };
