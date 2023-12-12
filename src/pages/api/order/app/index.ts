// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { tableId } = req.query;
  const isValid = tableId;
  if (!isValid) return res.status(400).send("Bad Request");

  if (method === "GET") {
    const table = await prisma.table.findFirst({
      where: { id: Number(tableId) },
    });

    if (!table) return res.status(400).send("Bad Request.");

    const locationId = table?.locationId;

    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });

    const companyId = location?.companyId;

    const company = await prisma.company.findFirst({
      where: { id: companyId, isArchived: false },
    });

    //find menuCategory
    let menuCategory = await prisma.menuCategory.findMany({
      where: { companyId, isArchived: false },
    });

    const menuCategoryIds = menuCategory.map((item) => item.id);

    //find disabledLocationMenuCategory
    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: menuCategoryIds } },
      });

    const disabledLocationMenuCategoryIds = disabledLocationMenuCategory.map(
      (item) => item.menuCategoryId
    );

    menuCategory = menuCategory.filter(
      (item) => !disabledLocationMenuCategoryIds.includes(item.id)
    );

    //find menu
    const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
    });

    let menuIds = menuCategoryMenu.map((item) => item.menuId);
    let menu = await prisma.menu.findMany({
      where: { id: { in: menuIds }, isArchived: false },
    });

    //find disabledLocationMenu
    const disabledLocationMenu = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: menuIds } },
    });

    const disabledLocationMenuIds = disabledLocationMenu.map(
      (item) => item.menuId
    );

    menu = menu.filter((item) => !disabledLocationMenuIds.includes(item.id));

    //find addon category
    const menuAddonCategory = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: menuIds }, isArchived: false },
    });
    const addonCategoryIds = menuAddonCategory.map(
      (item) => item.addonCategoryId
    );
    const addonCategory = await prisma.addonCategory.findMany({
      where: { id: { in: addonCategoryIds }, isArchived: false },
    });

    //find addon
    const addons = await prisma.addon.findMany({
      where: { addonCategoryId: { in: addonCategoryIds }, isArchived: false },
    });

    const order = await prisma.order.findMany({
      where: { tableId: Number(tableId) },
    });

    return res.status(200).json({
      company,
      menuCategory,
      menu,
      menuCategoryMenu,
      addonCategory,
      menuAddonCategory,
      addons,
      location: [location],
      table: [table],
      disabledLocationMenuCategory: [],
      disabledLocationMenu: [],
      order,
    });
  }

  res.status(405).send("Method now allowed.");
}
