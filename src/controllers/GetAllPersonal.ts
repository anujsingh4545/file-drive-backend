import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";
import {Request, Response} from "express";

interface PersonalFile {
  id: string;
  title: string;
  filetype: string;
  url: string;
  createdAt: Date;
  userId: string;
  name?: string; // New property
  email?: string; // New property
  profile?: string; // New property
}

export const GetAllFiles = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());
  const userId: string = req.body.userId;

  try {
    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        personalGroup: {
          orderBy: {
            createdAt: "desc", // Sort by createdAt timestamp in descending order
          },
        },
      },
    });

    if (userData) {
      let favFiles: PersonalFile[] = userData.personalGroup; // Accessing the personal files

      favFiles.forEach((file) => {
        (file.name = userData.name), (file.email = userData.email), (file.profile = userData.profile);
      });

      return res.status(200).json({files: favFiles, success: true});
    } else {
      return res.status(404).json({message: "User not found", success: false});
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({message: "Error", success: false});
  }
};

export const UploadFavs = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.userPersonalFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.userPersonalFile.update({
        where: {
          id: fileId,
        },
        data: {
          favourite: true,
        },
      });
      return res.status(200).send({
        message: "Added to fav!",
        success: true,
      });
    } else {
      return res.status(403).send({
        message: "File not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Something went wrong",
      success: false,
    });
  }
};
export const RemoveFavs = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.userPersonalFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.userPersonalFile.update({
        where: {
          id: fileId,
        },
        data: {
          favourite: false,
        },
      });
      return res.status(200).send({
        message: "Removed from fav!",
        success: true,
      });
    } else {
      return res.status(403).send({
        message: "File not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Something went wrong",
      success: false,
    });
  }
};
export const makeTrash = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.userPersonalFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.userPersonalFile.update({
        where: {
          id: fileId,
        },
        data: {
          trash: true,
          trashtime: new Date(),
        },
      });
      return res.status(200).send({
        message: "Added to trash!",
        success: true,
      });
    } else {
      return res.status(403).send({
        message: "File not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Something went wrong",
      success: false,
    });
  }
};
export const removeTrash = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.userPersonalFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.userPersonalFile.update({
        where: {
          id: fileId,
        },
        data: {
          trash: false,
          trashtime: null,
        },
      });
      return res.status(200).send({
        message: "Removed from trash!",
        success: true,
      });
    } else {
      return res.status(403).send({
        message: "File not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const deletePFile = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.userPersonalFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.userPersonalFile.delete({
        where: {
          id: fileId,
        },
      });
      return res.status(200).send({
        message: "File deleted Sucessfully!",
        success: true,
      });
    } else {
      return res.status(403).send({
        message: "File not found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getallagroups = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {userId} = req.body;

  try {
    const Agroup = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        admin: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (Agroup) {
      return res.status(200).send({
        adminG: Agroup.admin,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "User not found!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(200).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const getalluser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {userId, username} = req.body;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: username,
          mode: "insensitive",
        },
        NOT: {
          id: userId, // Exclude users with the provided userId
        },
      },
    });

    return res.status(200).send({
      users: users,
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};
