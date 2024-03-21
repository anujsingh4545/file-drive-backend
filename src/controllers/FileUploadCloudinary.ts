import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

export const FileUpload = async (file: any, filetype: string) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      format: filetype,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
  } catch (error) {
    return null;
  }
};
