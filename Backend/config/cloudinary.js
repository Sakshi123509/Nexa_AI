import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

export const uploadcloudinary = async (filepath) => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log("Cloudinary config:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
    })
    console.log("filepath:", filepath)
    console.log("api_secret", process.env.CLOUDINARY_API_SECRET)
    try {
        const uploadResult = await cloudinary.uploader
            .upload(filepath)
        fs.unlinkSync(filepath)
        return uploadResult.secure_url
    } catch (error) {
        console.log("cloudinary error:", { error })
        fs.unlinkSync(filepath)
        return null;
    }
}

