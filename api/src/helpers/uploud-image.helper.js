import fs from 'fs-extra';
import { uploadImage } from '../db/cloudinary.js';
import { verifyDir } from './verify-dir.js';
const ALLOWED_EXTENSIONS = /(.jpg|.jpeg|.png|.gif)$/i;

const uploadImageHelper = async req => {
	const imageMain = req.imageMain;
	const imagesDetail = req.imagesDetail;
	const numberOfImages = 3;
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
	if (imagesDetail) {
		for (let i = 0; i < numberOfImages; i++) {
			if (!ALLOWED_EXTENSIONS.test(imagesDetail[i].mimetype)) {
				verifyDir();
				throw new Error('Image - detail, format invalid');
			}
			const res = await uploadImage(imagesDetail[i].tempFilePath);
			imgDetail.push({ public_id: res.public_id, secure_url: res.secure_url });
		}
		imagesDetail.forEach(async img => await fs.unlink(img.tempFilePath));
	}

	return { imgHome, imgDetail };
};

export default uploadImageHelper;
