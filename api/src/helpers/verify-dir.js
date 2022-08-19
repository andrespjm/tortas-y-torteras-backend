import fs from 'fs-extra';

export const verifyDir = () => {
	try {
		const directory = fs.existsSync('./uploads');
		if (directory) return fs.rm('./uploads', { recursive: true });
	} catch (err) {
		console.log(err.message);
	}
};
