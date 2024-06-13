const multer = require("multer");

// multer middleware function to upload the media files with the file filter option 
function fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
        cb(null, true);
    }
    else {
        cb("only .png .jpg files are allowed", false);
    };
};

const storage = multer.diskStorage({});

const upload = multer({ storage, fileFilter });

module.exports = upload;