import {Request, Response} from "express";
import {FileUpload} from "./FileUploadCloudinary";
import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";

export const UploadFileControl = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  let title: string | undefined;
  let userid: string | undefined;

  if (Array.isArray(req.fields!.title)) {
    title = req.fields!.title[0];
  } else {
    title = req.fields!.title;
  }

  if (Array.isArray(req.fields!.userid)) {
    userid = req.fields!.userid[0];
  } else {
    userid = req.fields!.userid;
  }
  const file: any = req.files;

  let filetype: string;

  if (file.image.type.includes("spreadsheetml")) filetype = "xlsx";
  else if (file.image.type.includes("wordprocessingml.document")) filetype = "docx";
  else if (file.image.type.includes("pdf")) filetype = "pdf";
  else if (file.image.type.includes("png")) filetype = "png";
  else if (file.image.type.includes("jpg")) filetype = "jpg";
  else if (file.image.type.includes("jpeg")) filetype = "jpeg";
  else {
    filetype = "null";
  }

  if (!title || !userid || !file) {
    return res.status(400).send({message: "Missing title or userid or file", success: false});
  }

  try {
    const data = await FileUpload(file.image.path, filetype);
    if (data) {
      const file = await prisma.userPersonalFile.create({
        data: {
          title: title,
          filetype: filetype,
          url: data.url,
          userId: userid,
        },
      });

      return res.status(200).send({
        message: "file uploaded sucessfully",
        file: file,
        success: true,
      });
    } else {
      return res.status(400).send({message: "Something went wrong", success: false});
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({message: "Something went wrong", success: false});
  }
};
