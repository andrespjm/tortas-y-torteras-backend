import { Router } from 'express';
import products from './products.router.js';
import colors from './colors.router.js';
const router = Router();

router.use('/products', products);
router.use('/colors', colors);

export default router;
