import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {v4 as uuidv4 } from 'uuid';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (fileBuffer, fileName) => {
    if (!fileBuffer) return null; // Check for null buffer early

    const publicId = uuidv4(); // Generate a unique ID for the file

    try {
        const response = await cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto",
                filename: fileName, // You can include the filename if necessary
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed:", error);
                    throw new Error("Failed to upload to Cloudinary.");
                }
                return result; // Return the result upon success
            }
        );

        // Create a stream to upload the buffer
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
                console.error("Cloudinary upload failed:", error);
                throw new Error("Failed to upload to Cloudinary.");
            }
            return result; // Return the response
        });

        // Write the buffer to the stream
        stream.end(fileBuffer); // Close the stream
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Failed to upload to Cloudinary."); // Throw error to handle it upstream
    }
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