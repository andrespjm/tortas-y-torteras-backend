import { Router } from 'express';
import products from './products.router.js';
import users from './users.route.js';
const router = Router();

router.use('/products', products);
router.use('/users', users);

export default router;
