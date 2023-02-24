var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: 'public/images/Coaches-Avatar/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});
var upload = multer({
    storage: storage,
    fileFilter: checkFiletype
}).single('image');

function checkFiletype(req, file, cb) {
    var fileT = /jpeg|jpg|png|gif/;
    var extname = fileT.test(path.extname(file.originalname).toLowerCase());
    var mimeType = fileT.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    } else {
        req.ImageError = "Images only";
        cb('Error: Images only', false)
    }
}
