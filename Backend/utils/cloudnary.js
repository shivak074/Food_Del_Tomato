import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();



cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});
console.log('Cloud Name:', process.env.CLOUDNARY_CLOUD_NAME + "error in  Cloud Name:', process.env.CLOUDNARY_CLOUD_NAME");
console.log('API Key:', process.env.CLOUDNARY_API_KEY + "error in  API Key:', process.env.CLOUDNARY_API_KEY");
console.log('API Secret:', process.env.CLOUDNARY_API_SECRET + "API Secret:', process.env.CLOUDNARY_API_SECRET");
const uploadOnCloudnary = async (localFilepath) => {
    if (!localFilepath) return null;

    try {
        
        console.log("Uploading file from path:", localFilepath);

        // Check if file exists
        const fileExists = await fs.access(localFilepath).then(() => true).catch(() => false);
        if (!fileExists) {
            console.error("File does not exist at path:", localFilepath);
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto"
        });

        console.log("Cloudinary upload response:", response);

        // Remove the local file after successful upload
        await fs.unlink(localFilepath);

        return response;
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        try {
            await fs.unlink(localFilepath);
        } catch (unlinkErr) {
            console.error('Error removing local file:', unlinkErr);
        }
        return null;
    }
};

export { uploadOnCloudnary };

