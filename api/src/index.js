import 'dotenv/config';
import app from './app.js';
import { sequelize } from './db/database.js';
import { setJsonColors } from './controllers/colors.controller.js';
import { setJsonUsers } from './controllers/users.controller.js';
import { setJsonPurchases } from './controllers/purchases.controller.js';
import {
	setJsonProducts,
	setJsonProductTypes,
} from './controllers/products.controller.js';
const { PORT } = process.env;
const PORT_SERVER = PORT || 3001;

(async () => {
	try {
		await sequelize.sync({ force: true });
		console.log('Connection has been established successfully');
		setJsonColors();
		setJsonUsers();
		setJsonPurchases();
		setJsonProducts();
		setJsonProductTypes();
		app.listen(PORT_SERVER, () =>
			console.log('Server is running on port: ', PORT_SERVER)
		);
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
})();
