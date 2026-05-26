import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // Upload the image to Cloudinary
       const response = await cloudinaary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })
        // File is uploaded successfully
        console.log("File uploaded successfully",
            reponse.url
        );
        return response;


    }catch(error){
        fs.unlinkSync(localFilePath);
        // File is deleted successfully from server

        return null;

    }}

cloudinary.v2.uploader
.upload("https://1000logos.net/wp-content/uploads/2021/04/Wikipedia-logo.png",
    { public_id: "sample_image" },
    function(error, result) {console.log(result, error);});


export {uploadOnCloudinary};