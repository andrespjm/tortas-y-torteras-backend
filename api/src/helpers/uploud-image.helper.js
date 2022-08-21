import fs from 'fs-extra';
import { uploadImage } from '../db/cloudinary.js';
import { verifyDir } from './verify-dir.js';
const ALLOWED_EXTENSIONS = /(.jpg|.jpeg|.png|.gif)$/i;

const uploadImageHelper = async req => {
	const imageMain = req.imageMain;
	const numberOfImages = 3;
	const imagesDetail = [];
	if (req['imagesDetail.0']) {
		for (let i = 0; i < numberOfImages; i++) {
			if (req['imagesDetail.' + i] !== undefined)
				imagesDetail.push(req['imagesDetail.' + i]);
		}
	}
	const imgDetail = [];
	// Main Image
	if (!imageMain) throw new Error('Main image required');
	if (!ALLOWED_EXTENSIONS.test(imageMain.mimetype)) {
		verifyDir();
		throw new Error('Image - home, format invalid');
	}
	const resImageMain = await uploadImage(imageMain.tempFilePath);
	const imgHome = {
		public_id: resImageMain.public_id,
		secure_url: resImageMain.secure_url,
	};
	await fs.unlink(imageMain.tempFilePath);

	// Images Detail
	if (imagesDetail.length) {
		for (let i = 0; i < imagesDetail.length; i++) {
			if (!ALLOWED_EXTENSIONS.test(imagesDetail[i].mimetype)) {
				verifyDir();
				throw new Error('Image - detail, format invalid');
			}
			const res = await uploadImage(imagesDetail[i].tempFilePath);
			if (!res) throw new Error(res.statusText);
			imgDetail.push({ public_id: res.public_id, secure_url: res.secure_url });
			await fs.unlink(imagesDetail[i].tempFilePath);
		}
	}
	return { imgHome, imgDetail };
};

export default uploadImageHelper;
