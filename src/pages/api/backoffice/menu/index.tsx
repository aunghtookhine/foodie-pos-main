// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized.");
  const method = req.method;
  if (method === "POST") {
    const { name, price, assetUrl, menuCategoryIds } = req.body;

    const isValid = name && price && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad Request");

    const menu = await prisma.menu.create({
      data: { name, price, assetUrl },
    });

    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryIds.map((item: number) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: menu.id, menuCategoryId: item },
        })
      )
    );
    return res.status(200).send({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    const {
      id,
      name,
      price,
      menuCategoryIds,
      locationId,
      isAvailable,
      assetUrl,
    } = req.body;

    const isValid =
      id && name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad Request");

    const exist = await prisma.menu.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad Request");

    const menu = await prisma.menu.update({
      data: { name, price, assetUrl },
      where: { id },
    });

    await prisma.menuCategoryMenu.deleteMany({
      where: { menuId: id },
    });

    const menuCategoryMenuData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));

    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryMenuData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: item.menuId, menuCategoryId: item.menuCategoryId },
        })
      )
    );

    if (locationId) {
      if (isAvailable === false) {
        const exist = await prisma.disabledLocationMenu.findFirst({
          where: { locationId, menuId: id },
        });
        if (!exist)
          await prisma.disabledLocationMenu.create({
            data: { locationId, menuId: id },
          });
      } else if (isAvailable === true) {
        const exist = await prisma.disabledLocationMenu.findFirst({
          where: { locationId, menuId: id },
        });
        if (exist) {
          await prisma.disabledLocationMenu.delete({
            where: { id: exist.id },
          });
        }
      }
    }
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    const allMenuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: dbUser?.companyId },
      })
    ).map((item) => item.id);
    const allMenuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: allMenuCategoryIds } },
      })
    ).map((item) => item.menuId);
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: allMenuIds } },
    });

    return res
      .status(200)
      .json({ menu, menuCategoryMenus, disabledLocationMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const menu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!menu) return res.status(400).send("Bad Request");

    const menuAddonCategories = await prisma.menuAddonCategory.findMany({
      where: { menuId },
    });

    const addonCategoryIds = menuAddonCategories.map(
      (item) => item.addonCategoryId
    );

    addonCategoryIds.map(async (addonCategoryId) => {
      const menuAddonCategories = await prisma.menuAddonCategory.findMany({
        where: { addonCategoryId },
      });
      if (menuAddonCategories.length === 1) {
        await prisma.addonCategory.update({
          data: { isArchived: true },
          where: { id: addonCategoryId },
        });
      }
    });

    await prisma.menuAddonCategory.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });

    return res.status(200).send("Menu Successfully Deleted.");
  }
  res.status(405).send("Method not allowed.");
}
