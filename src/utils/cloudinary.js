import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully
    console.log("File uploaded successfully:", response.url);

    return response.url; // return only the URL for simplicity
  } catch (error) {
    // Delete file safely
    try {
      await fs.promises.unlink(localFilePath);
      console.log("File deleted from server due to upload error");
    } catch (err) {
      console.error("Error deleting file:", err);
    }

    return null;
  }
};

export { uploadOnCloudinary };
