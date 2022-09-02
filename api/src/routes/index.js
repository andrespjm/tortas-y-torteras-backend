import { Router } from 'express';
import colors from './colors.router.js';
import orderItems from './orderItems.router.js';
import products from './products.router.js';
import productTypes from './productTypes.router.js';
import purchases from './purchases.router.js';
import stocks from './stocks.router.js';
import review from './reviews.router.js';
import users from './users.router.js';
import pay from './pay.router.js';
import mails from './mails.router.js';
import sales from './sales.router.js';
const router = Router();

router.use('/products', products);
router.use('/users', users);
router.use('/colors', colors);
router.use('/purchases', purchases);
router.use('/stocks', stocks);
router.use('/review', review);
router.use('/order-items', orderItems);
router.use('/product-types', productTypes);
router.use('/pay', pay);
router.use('/mails', mails);
router.use('/sales', sales);
router.use((_, res) => {
	res.status(404).send('componente por defecto');
});

export default router;
