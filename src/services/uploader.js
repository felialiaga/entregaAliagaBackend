import multer from 'multer';
import __dirname from '../utils.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        return cb(null, `${__dirname}/public/files`);
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage});

export default uploader;