const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/products')
    },
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-img-${path.extname(file.originalname)}`)
    },
})

const upload = multer({
    storage,
});

module.exports = upload;