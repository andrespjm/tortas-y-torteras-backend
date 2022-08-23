import { ProductTypes } from '../models/ProductTypes.js';

const getProductTypes = async () => {
	const productTypes = await ProductTypes.findAll();
	if (!productTypes) throw new Error('Product types not found');
	return productTypes;
};

const createProductType = async (name, diameter) => {
	const productType = await ProductTypes.create({
		name,
		diameter,
	});

	return productType;
};

const updateProductType = async (name, newName, diameter) => {
	const productType = await ProductTypes.findOne({ where: { name } });
	if (!productType) {
		throw new Error('Product type not found');
	} else {
		await ProductTypes.update(
			{
				name: newName,
				diameter,
			},
			{
				where: { name },
			}
		);
	}
	return 'Product type udated';
};

const deleteProductType = async name => {
	await ProductTypes.findOne({
		where: { name },
	});
	await ProductTypes.destroy({
		where: { name },
	});

	return 'Product type deleted';
};

export {
	getProductTypes,
	createProductType,
	updateProductType,
	deleteProductType,
};
