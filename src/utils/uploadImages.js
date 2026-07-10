import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "folder_name" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadImages = async (files) =>{
    try {
        let urls =[];
        for(let file of files){
            const cloudinaryResponse = await uploadFromBuffer(file.buffer);
            urls.push({
                url :cloudinaryResponse.secure_url,
                public_id : cloudinaryResponse.public_id
            });
        }
        return urls;
    } catch (error) {
        throw error;
    }
}

export default uploadImages;