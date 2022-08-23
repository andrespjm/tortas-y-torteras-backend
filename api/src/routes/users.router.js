import { Router } from 'express';
import {
	signUp,
	getUsers,
	getUsersId,
	updateUserEnabled,
	updateUser,
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const users = await getUsers();
		res.status(200).send(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const user = await getUsersId(id);
		res.status(200).send(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/signup', async (req, res) => {
	try {
		const data = req.body;
		res.send(await signUp(data));
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/user/:id', async (req, res) => {
	const { id } = req.params;
	const { name, lastname, email, password } = req.body;
	try {
		const user = await updateUser(id, name, lastname, email, password);
		res.status(200).send(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { enabled } = req.body;
	try {
		const user = await updateUserEnabled(id, enabled);
		res.status(200).send(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
