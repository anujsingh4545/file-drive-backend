import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";

export const register = async (req: Request, res: Response) => {
  const prisma_con = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());
  const {name, email, profile} = req.body;

  try {
    const check = await prisma_con.user.findUnique({
      where: {
        email: email,
      },
    });

    if (check) {
      const token = jwt.sign({id: check.id}, process.env.JWTSECRET!);

      return res.status(200).send({
        message: `Welcome back ${check.name}!`,
        user: check,
        token: token,
        status: true,
      });
    }

    const user = await prisma_con.user.create({
      data: {
        name: name,
        email: email,
        profile: profile,
      },
    });

    const token = jwt.sign({id: user.id}, process.env.JWTSECRET!);

    return res.status(200).send({
      message: "User registered sucessfully!",
      user: user,
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      massage: error,
      success: false,
    });
  }
};

export const userInfo = async (req: Request, res: Response) => {
  const id: string | undefined = req.body.userId;

  if (!id) {
    return res.status(400).send({
      message: "No id found",
      success: false,
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).send({
        messsage: "user not found",
        success: false,
      });
    }

    return res.status(200).send({
      message: " data found",
      user: user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: error,
      success: false,
    });
  }
};

interface Admin {
  id: string;
  name: String;
  createdAt: Date;
  membercount?: Number;
}
interface Member {
  id: string;
  name: String;
  createdAt: Date;
  creatorId?: String;
  userCreated?: Date;
}

export const GetAdminMemberData = async (req: Request, res: Response) => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URLS,
  }).$extends(withAccelerate());
  const {userId} = req.body;

  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        admin: true,
        member: true,
      },
    });
    if (userData) {
      let admin: Admin[] = userData.admin;
      let member: Member[] = userData.member;

      await Promise.all(
        admin.map(async (group) => {
          const groupData = await prisma.group.findUnique({
            where: {
              id: group.id,
            },
            select: {
              members: true,
            },
          });
          if (groupData) {
            group.membercount = groupData.members.length;
          } else {
            group.membercount = 0;
          }
        })
      );
      await Promise.all(
        member.map(async (group) => {
          const groupData = await prisma.groupMembership.findFirst({
            where: {
              groupId: group.id,
              userId: userId,
            },
            select: {
              joinedAt: true,
            },
          });

          group.userCreated = groupData?.joinedAt;
        })
      );
      await Promise.all(
        member.map(async (group) => {
          const groupData = await prisma.group.findFirst({
            where: {
              id: group.id,
            },
            select: {
              createdBy: true,
            },
          });
          group.creatorId = groupData?.createdBy;
        })
      );

      member = member.filter((data) => data.creatorId !== userId);

      return res.status(200).send({
        message: "Data fetched successfully!",
        admin: admin,
        member: member,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: "Something went wrong",
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
