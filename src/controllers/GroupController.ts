import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";
import {Request, Response} from "express";
import {FileUpload} from "./FileUploadCloudinary";

interface GroupFile {
  id: string;
  title: string;
  filetype: string;
  url: string;
  createdAt: Date;
  groupId: String;
  createdById: string;
  name?: string; // New property
  email?: string; // New property
  profile?: string; // New property
}

export const CreateGroup = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {name, userId} = req.body;

  console.log(name, userId);

  try {
    await prisma.group.create({
      data: {
        name: name,
        createdBy: userId,
        admins: {connect: {id: userId}},
        members: {connect: {id: userId}},
        GroupMembership: {
          create: {
            userId: userId,
            joinedAt: new Date(),
          },
        },
      },
    });

    return res.status(200).send({message: "Group created sucessfully!", success: true});
  } catch (error) {
    console.log(error);
    return res.status(400).send({message: "Something went wrong", success: false});
  }
};

export const DeleteGroup = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {grpId, userId} = req.body;

  try {
    await prisma.groupMembership.deleteMany({
      where: {
        groupId: grpId,
      },
    });
    await prisma.groupFile.deleteMany({
      where: {
        groupId: grpId,
      },
    });
    await prisma.request.deleteMany({
      where: {
        groupId: grpId,
      },
    });

    await prisma.group.delete({
      where: {
        id: grpId,
      },
    });

    return res.status(200).send({
      message: "Group deleted Sucessfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Some error occured",
      success: false,
    });
  }
};

export const GetAllFile = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {groupId, userId} = req.body;

  try {
    const file = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        files: {
          orderBy: {
            createdAt: "desc", // Sort by createdAt timestamp in descending order
          },
        },
      },
    });

    if (file) {
      let GrpFiles: GroupFile[] = file.files;

      const promises = GrpFiles.map(async (file) => {
        try {
          const userData = await prisma.user.findUnique({
            where: {
              id: file.createdById,
            },
          });
          if (userData) {
            file.email = userData.email;
            file.name = userData.name;
            file.profile = userData.profile;
          }
        } catch (error) {
          throw error;
        }
      });

      await Promise.all(promises);

      return res.status(200).json({files: GrpFiles, success: true});
    } else {
      return res.status(404).json({message: "User not found", success: false});
    }
  } catch (error) {
    return res.status(404).json({message: "Error", success: false});
  }
};

export const UploadFileControl = async (req: Request, res: Response) => {
  console.log("fkdf");
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  let title: string | undefined;
  let userid: string | undefined;
  let GroupId: string | undefined;

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

  if (Array.isArray(req.fields!.GroupId)) {
    GroupId = req.fields!.GroupId[0];
  } else {
    GroupId = req.fields!.GroupId;
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

  if (!title || !userid || !file || !GroupId) {
    return res.status(400).send({message: "Missing title or userid or file", success: false});
  }

  try {
    const data = await FileUpload(file.image.path, filetype);
    if (data) {
      await prisma.groupFile.create({
        data: {
          title: title,
          filetype: filetype,
          url: data.url,
          groupId: GroupId,
          createdById: userid,
        },
      });

      return res.status(200).send({
        message: "File uploaded sucessfully",
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

export const UploadFavs = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {fileId} = req.body;

  try {
    const File = await prisma.groupFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.groupFile.update({
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
    const File = await prisma.groupFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.groupFile.update({
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
    const File = await prisma.groupFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.groupFile.update({
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
    const File = await prisma.groupFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.groupFile.update({
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
    const File = await prisma.groupFile.findUnique({
      where: {
        id: fileId,
      },
    });

    if (File) {
      await prisma.groupFile.delete({
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

interface member {
  id: String;
  name: String;
  email: String;
  profile: String;
  role?: String;
  joined?: Date;
  createdBy?: String;
}

export const GetAllMembers = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const mySet = new Set();

  const addToSet = (dataArray: any) => {
    dataArray?.forEach((data: any) => {
      const existingData = Array.from(mySet).find((item: any) => item.id === data.id);
      if (!existingData) {
        mySet.add(data);
      }
    });
  };

  const {groupId, userId} = req.body;

  try {
    const data = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        admins: true,
        members: true,
      },
    });

    if (data) {
      const admin: member[] = data?.admins;
      const member: member[] = data.members;

      admin.forEach((user) => {
        user.role = "admin";
        user.createdBy = data.createdBy;
      });
      member.forEach((user) => {
        user.role = "member";
        user.createdBy = data.createdBy;
      });

      addToSet(admin);
      addToSet(member);

      await Promise.all(
        Array.from(mySet).map(async (group: any) => {
          const groupData = await prisma.groupMembership.findFirst({
            where: {
              groupId: groupId,
              userId: group.id,
            },
            select: {
              joinedAt: true,
            },
          });

          group.joined = groupData?.joinedAt;
        })
      );

      mySet.forEach((element: any) => {
        if (element.id == data.createdBy) {
          mySet.delete(element);
        }
      });

      const membersArray = Array.from(mySet);
      return res.status(200).send({
        members: membersArray,
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};

export const ChangeRole = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {UserId, groupId, role} = req.body;

  try {
    if (role == "admin") {
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          admins: {connect: {id: UserId}},
        },
      });
    } else {
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          admins: {disconnect: {id: UserId}},
        },
      });
    }

    return res.status(200).send({
      message: "Role updated sucessfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send({
      message: "Something went wrong! ",
      success: false,
    });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {UserId, groupId} = req.body;

  try {
    await prisma.groupMembership.deleteMany({
      where: {
        userId: UserId,
        groupId: groupId,
      },
    });

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {disconnect: {id: UserId}},
      },
    });

    return res.status(200).send({
      message: " User removed successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};
export const DeleteMember = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {userId, groupId} = req.body;

  try {
    await prisma.groupMembership.deleteMany({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {disconnect: {id: userId}},
      },
    });

    return res.status(200).send({
      message: " User removed successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Something went wrong!",
      success: false,
    });
  }
};
