import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";
import {Request, Response} from "express";

export const AddRequest = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {groupId, UserId, role} = req.body;

  try {
    const checkRequest = await prisma.request.findFirst({
      where: {
        groupId: groupId,
        userId: UserId,
      },
    });

    if (checkRequest) {
      return res.status(200).send({
        message: "Request already sent!",
        success: false,
      });
    }

    const verifyuser = await prisma.user.findUnique({
      where: {
        id: UserId,
      },
    });

    if (!verifyuser) {
      return res.status(200).send({
        message: "User not found!",
        success: false,
      });
    }

    const verifyGroup = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!verifyGroup) {
      return res.status(200).send({
        message: " Group not found!",
        success: false,
      });
    }

    const checkpreadded = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: {
          where: {
            id: UserId,
          },
        },
        admins: {
          where: {
            id: UserId,
          },
        },
      },
    });

    const isMember = checkpreadded!.members.length > 0;
    const isAdmin = checkpreadded!.admins.length > 0;

    if (isMember || isAdmin) {
      return res.status(200).send({
        message: "User already added to group !",
        success: false,
      });
    }

    await prisma.request.create({
      data: {
        role: role,
        groupName: verifyGroup.name,
        groupId: groupId,
        userId: UserId,
      },
    });

    return res.status(200).send({
      message: "Request sent!",
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

export const GetAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {userId} = req.body;

  try {
    const userReq = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        requests: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return res.status(200).send({
      req: userReq?.requests,
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

export const AcceptReq = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {id, UserId, groupId, role} = req.body;

  try {
    const reqVerify = await prisma.request.findUnique({
      where: {
        id: id,
      },
    });

    if (!reqVerify) {
      return res.status(200).send({
        message: "Request not found!",
        success: false,
      });
    }

    if (role == "admin") {
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          admins: {connect: {id: UserId}},
          members: {connect: {id: UserId}},
          GroupMembership: {
            create: {
              userId: UserId,
              joinedAt: new Date(),
            },
          },
        },
      });
    } else {
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          members: {connect: {id: UserId}},
          GroupMembership: {
            create: {
              userId: UserId,
              joinedAt: new Date(),
            },
          },
        },
      });
    }

    await prisma.request.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).send({
      message: "Added to group Sucessfully!",
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
export const DeclineReq = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  const {id, UserId, groupId, role} = req.body;

  try {
    const reqVerify = await prisma.request.findUnique({
      where: {
        id: id,
      },
    });

    if (!reqVerify) {
      return res.status(200).send({
        message: "Request not found!",
        success: false,
      });
    }

    await prisma.request.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).send({
      message: "Declined request Sucessfully!",
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
