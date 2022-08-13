import 'dotenv/config';
import app from './app.js';
import { sequelize } from './db/database.js';

const { PORT } = process.env;
const PORT_SERVER = PORT || 3001;

(async () => {
	try {
		await sequelize.sync({ force: true });
		console.log('Connection has been established successfully');
		app.listen(PORT_SERVER, () =>
			console.log('Server is running on port: ', PORT_SERVER)
		);
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
})();
