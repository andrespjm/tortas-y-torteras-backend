import { Router } from 'express';
import colors from './colors.router.js';
import products from './products.router.js';
import users from './users.route.js';
const router = Router();

router.use('/products', products);
router.use('/users', users);
router.use('/colors', colors);

export default router;
