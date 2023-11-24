// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { tableId } = req.query;
  const isOrderApp = tableId;
  if (method === "GET") {
    if (isOrderApp) {
      const table = await prisma.table.findFirst({
        where: { id: Number(tableId) },
      });

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
        location: [],
        table: [table],
        disabledLocationMenuCategory: [],
        disabledLocationMenu: [],
        order,
      });
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (!session) return res.status(401).send("Unauthorized");
      const user = session.user;
      const name = user?.name as string;
      const email = user?.email as string;

      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (!dbUser) {
        //create new company
        const newCompanyName = "Shal Swel";
        const newCompanyStreet = "30/232 Taung Htate Pan St";
        const newCompanyTownship = "Thuwunna";
        const newCompanyCity = "Yangon";
        const company = await prisma.company.create({
          data: {
            name: newCompanyName,
            street: newCompanyStreet,
            township: newCompanyTownship,
            city: newCompanyCity,
          },
        });

        //create new user
        const companyId = company.id;
        await prisma.user.create({
          data: { name, email, companyId },
        });

        //create new menu category
        const newMenuCategoryName = "Default Menu Category";
        const menuCategory = await prisma.menuCategory.create({
          data: { name: newMenuCategoryName, companyId: company.id },
        });

        //create new menu
        const newMenuName = "Default Menu";
        const newMenuPrice = 1000;
        const menu = await prisma.menu.create({
          data: { name: newMenuName, price: newMenuPrice },
        });

        //create new row in MenuCategoryMenu
        const menuCategoryMenu = await prisma.menuCategoryMenu.create({
          data: { menuCategoryId: menuCategory.id, menuId: menu.id },
        });

        //create new addonCategory
        const newAddonCategoryName = "Default Addon Category";
        const addonCategory = await prisma.addonCategory.create({
          data: { name: newAddonCategoryName },
        });

        //create new row in MenuAddonCategory
        const menuAddonCategory = await prisma.menuAddonCategory.create({
          data: { menuId: menu.id, addonCategoryId: addonCategory.id },
        });

        //create new addon
        const newAddonNameOne = "Default Addon 1";
        const newAddonNameTwo = "Default Addon 2";
        const newAddonNameThree = "Default Addon 3";
        const newAddonsData = [
          { name: newAddonNameOne, addonCategoryId: addonCategory.id },
          { name: newAddonNameTwo, addonCategoryId: addonCategory.id },
          { name: newAddonNameThree, addonCategoryId: addonCategory.id },
        ];

        const addons = await prisma.$transaction(
          newAddonsData.map((addon) => prisma.addon.create({ data: addon }))
        );

        //create new location
        const newLocationName = "Thuwunna";
        const newLocationStreet = "Kha Yay Pin St";
        const newLocationTownship = "Thuwunna";
        const newLocationCity = "Yangon";
        const location = await prisma.location.create({
          data: {
            name: newLocationName,
            street: newLocationStreet,
            township: newLocationTownship,
            city: newLocationCity,
            companyId: company.id,
          },
        });

        const newTableName = "Default Table";
        const newTable = await prisma.table.create({
          data: { name: newTableName, locationId: location.id, assetUrl: "" },
        });
        await qrCodeImageUpload(newTable.id);
        const assetUrl = getQrCodeUrl(newTable.id);
        const table = await prisma.table.update({
          data: { assetUrl },
          where: { id: newTable.id },
        });

        return res.status(200).json({
          company,
          menuCategory: [menuCategory],
          menu: [menu],
          menuCategoryMenu: [menuCategoryMenu],
          addonCategory: [addonCategory],
          menuAddonCategory: [menuAddonCategory],
          addons,
          location: [location],
          table: [table],
          disableLocationMenuCategory: [],
          disableLocationMenu: [],
          order: [],
        });
      }
      const companyId = dbUser.companyId;

      //find menuCategory
      const menuCategory = await prisma.menuCategory.findMany({
        where: { companyId, isArchived: false },
      });

      const menuCategoryIds = menuCategory.map((item) => item.id);

      //find disabledLocationMenuCategory
      const disabledLocationMenuCategory =
        await prisma.disabledLocationMenuCategory.findMany({
          where: { menuCategoryId: { in: menuCategoryIds } },
        });

      //find menu
      const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
      });

      const menuIds = menuCategoryMenu.map((item) => item.menuId);
      const menu = await prisma.menu.findMany({
        where: { id: { in: menuIds }, isArchived: false },
      });

      //find disabledLocationMenu
      const disabledLocationMenu = await prisma.disabledLocationMenu.findMany({
        where: { menuId: { in: menuIds } },
      });

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

      //find location
      const location = await prisma.location.findMany({
        where: { companyId, isArchived: false },
      });
      const locationIds = location.map((item) => item.id);
      //find table
      const table = await prisma.table.findMany({
        where: { locationId: { in: locationIds }, isArchived: false },
      });

      const order = await prisma.order.findMany({
        where: {
          tableId: { in: table.map((item) => item.id) },
          isArchived: false,
        },
      });

      const company = await prisma.company.findFirst({
        where: { id: companyId, isArchived: false },
      });

      return res.status(200).json({
        company,
        menuCategory,
        menu,
        menuCategoryMenu,
        addonCategory,
        menuAddonCategory,
        addons,
        location,
        table,
        disabledLocationMenuCategory,
        disabledLocationMenu,
        order,
      });
    }
  }
}
