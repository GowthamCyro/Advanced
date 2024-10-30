import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {v4 as uuidv4 } from 'uuid';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: uuidv4(),
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(new ApiError(400, "Image did not upload successfully to Cloudinary! Please try again!"));
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

const deleteOnCloudinary = async (public_id,resource_type="image") => {
    try {
        if(!public_id) return null
    
        const response = await cloudinary.uploader.destroy(public_id,{
            resource_type : `${resource_type}`
        })
    } catch (error) {
        console.log("Delete on cloudinary Failed",error);
        return error
    }
}

export {
    uploadOnCloudinary,
    deleteOnCloudinary
}