import { Router } from 'express';
import { Products } from '../models/Products.js';
import { crud } from 'express-crud-router';
import { Purchases } from '../models/Purchases.js';
import { Colors } from '../models/Colors.js';
import { Users } from '../models/Users.js';
import { Stocks } from '../models/Stocks.js';

const router = Router();

router.use(
	crud('/purchase', {
		getList: ({ filter, limit, offset, order }) =>
			Purchases.findAndCountAll({ limit, offset, order, where: filter }),
		getOne: id => Purchases.findByPk(id),
		create: body => Purchases.create(body),
		update: (id, body) => Purchases.update(body, { where: { id } }),
		destroy: id => Purchases.destroy({ where: { id } }),
	})
);

router.use(
	crud('/user', {
		getList: ({ filter, limit, offset, order }) =>
			Users.findAndCountAll({ limit, offset, order, where: filter }),
		getOne: id => Users.findByPk(id),
		create: body => Users.create(body),
		update: (id, body) => Users.update(body, { where: { id } }),
		destroy: id => Users.destroy({ where: { id } }),
	})
);

router.use(
	crud('/product', {
		getList: ({ filter, limit, offset, order }) =>
			Products.findAndCountAll({ limit, offset, order, where: filter }),
		getOne: id => Products.findByPk(id),
		create: body => Products.create(body),
		update: (id, body) => Products.update(body, { where: { id } }),
		destroy: id => Products.destroy({ where: { id } }),
	})
);

router.use(
	crud('/color', {
		getList: ({ filter, limit, offset, order }) =>
			Colors.findAndCountAll({ limit, offset, order, where: filter }),
		getOne: id => Colors.findByPk(id),
		create: body => Colors.create(body),
		update: (id, body) => Colors.update(body, { where: { id } }),
		destroy: id => Colors.destroy({ where: { id } }),
	})
);

router.use(
	crud('/stock', {
		getList: ({ filter, limit, offset, order }) =>
			Stocks.findAndCountAll({ limit, offset, order, where: filter }),
		getOne: id => Stocks.findByPk(id),
		create: body => Stocks.create(body),
		update: (id, body) => Stocks.update(body, { where: { id } }),
		destroy: id => Stocks.destroy({ where: { id } }),
	})
);

export default router;
