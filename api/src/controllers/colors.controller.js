/* eslint-disable camelcase */
import axios from 'axios';
import { Colors } from '../models/Colors.js';

const getAllColors = async () => {
	const colors = await Colors.findAll();
	if (!colors) throw new Error('Colors not found');
	return colors;
};

const setJsonColors = async () => {
	const data = (await axios(`http://localhost:5000/Colors`)).data;

	const dataPromise = data.map(el => Colors.create(el));

	await Promise.all(dataPromise);

	return 'colors loaded';
};

export { setJsonColors, getAllColors };
