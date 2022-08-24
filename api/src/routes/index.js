import { Router } from 'express';
import colors from './colors.router.js';
import products from './products.router.js';
import users from './users.router.js';
import purchases from './purchases.router.js';
import stocks from './stocks.router.js';
import orderItems from './orderItems.router.js';
import productTypes from './productTypes.router.js';
import review from './reviews.router.js';
const router = Router();

router.use('/products', products);
router.use('/users', users);
router.use('/colors', colors);
router.use('/purchases', purchases);
router.use('/stocks', stocks);
router.use('/orderItems', orderItems);
router.use('/productTypes', productTypes);
router.use('/review', review);
router.use((_, res) => {
	res.status(404).send('componenete por defecto');
});

export default router;
