import fs from 'fs-extra';
import { uploadImage } from '../db/cloudinary.js';

const uploadImageHelper = async req => {
	const imageMain = req.imageMain.tempFilePath;
	const imagesDetail = req.imagesDetail;
	const numberOfImages = 3;
	const imgDetail = [];
	// Main Image
	if (!imageMain) throw new Error('Main image required');
	const resImageMain = await uploadImage(imageMain);
	const imgHome = {
		public_id: resImageMain.public_id,
		secure_url: resImageMain.secure_url,
	};
	await fs.unlink(imageMain);

	// Images Detail
	if (imagesDetail) {
		for (let i = 0; i < numberOfImages; i++) {
			const res = await uploadImage(imagesDetail[i].tempFilePath);
			imgDetail.push({ public_id: res.public_id, secure_url: res.secure_url });
		}
		imagesDetail.forEach(async img => await fs.unlink(img.tempFilePath));
	}

	return { imgHome, imgDetail };
};

export default uploadImageHelper;
