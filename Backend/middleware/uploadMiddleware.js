


const multer = require('multer');
const path = require('path');
const fs = require('fs');


const createUploadDirectories = () => {
    const directories = ['logos', 'event-banners', 'attachments', 'misc'].map(
        dir => path.join('./uploads', dir)
    );

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirectories();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPaths = {
            clubLogo: 'logos', 
            eventBanner: 'event-banners',
            attachments: 'attachments'
        };

        const uploadDir = path.join('./uploads', uploadPaths[file.fieldname] || 'misc');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});


const ALLOWED_FILE_TYPES = {
    images: ['image/jpeg', 'image/png', 'image/jpg'],
    documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
};


const fileFilter = (req, file, cb) => {
    const filters = {
        clubLogo: (file) => ALLOWED_FILE_TYPES.images.includes(file.mimetype), 
        eventBanner: (file) => [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents].includes(file.mimetype),
        attachments: (file) => [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents].includes(file.mimetype)
    };

    const isValid = filters[file.fieldname]?.(file);

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${ALLOWED_FILE_TYPES.images.join(', ')}`), false);
    }
};


const uploadLogo = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
}).single('clubLogo');


const uploadEventFiles = multer({
    storage,
    fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 }
}).fields([
    { name: 'eventBanner', maxCount: 1 },
    { name: 'attachments', maxCount: 10 }
]);

module.exports = {
    uploadLogo,
    uploadEventFiles
};
