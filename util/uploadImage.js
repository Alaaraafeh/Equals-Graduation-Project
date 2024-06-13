const cloudinary = require('../config/cloud.config');

exports.uploadImageToCloudinary = async (file, publicId, path) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file, {
            folder: path,
            public_id: publicId,
            overwrite: true,
        },
            function (error, result) {
                if (error) {
                    return {
                        success: false,
                        statusCode: 500,
                        message: "something went wrong !"
                    }
                };
            });
        return {
            success: true,
            statusCode: 201,
            message: "success",
            data: result.url
        }
    }
    catch (err) {
        return {
            success: false,
            statusCode: 500,
            message: err.message
        }
    }
};
