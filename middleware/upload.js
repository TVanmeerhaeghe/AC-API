const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let baseDir = 'uploads/';
        if (file.fieldname === 'image') {
            baseDir += 'image';
        } else if (file.fieldname === 'video') {
            baseDir += 'video';
        } else {
            baseDir += 'others';
        }

        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const finalPath = path.join(baseDir, year, month);

        fs.mkdirSync(finalPath, { recursive: true });
        cb(null, finalPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
        cb(null, `${basename}-${timestamp}-${random}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées pour le champ "image".'), false);
        }
    } else if (file.fieldname === 'video') {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les vidéos sont autorisées pour le champ "video".'), false);
        }
    } else {
        cb(new Error('Champ de fichier inattendu.'), false);
    }
};

const limits = {
    fileSize: 50 * 1024 * 1024
};

const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits
});

module.exports = uploadMiddleware;
