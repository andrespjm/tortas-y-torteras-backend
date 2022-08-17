import { Router } from 'express';
import { signUp } from '../controllers/user.controller.js';

const router = Router();

router.post('/signup', async (req, res) => {
	try {
		const data = req.body;
		res.send(await signUp(data));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
