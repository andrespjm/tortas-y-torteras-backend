import { Router } from 'express';
import products from './products.router.js';

const router = Router();

router.use('/products', products);

export default router;
