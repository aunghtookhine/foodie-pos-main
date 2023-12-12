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
    const { name, locationId } = req.body;

    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad Request.");

    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("Bad Request.");

    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId: location.companyId },
    });

    return res.status(200).json(menuCategory);
  } else if (method === "PUT") {
    const { id, name, locationId, isAvailable } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad Request.");

    const exist = await prisma.menuCategory.findFirst({
      where: { id },
    });
    if (!exist) return res.status(400).send("Bad Request.");

    const menuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });

    if (locationId) {
      if (isAvailable === false) {
        const exist = await prisma.disabledLocationMenuCategory.findFirst({
          where: { menuCategoryId: id, locationId },
        });
        if (!exist)
          await prisma.disabledLocationMenuCategory.create({
            data: { locationId, menuCategoryId: id },
          });
      } else if (isAvailable === true) {
        const exist = await prisma.disabledLocationMenuCategory.findFirst({
          where: { menuCategoryId: id, locationId },
        });
        if (exist) {
          await prisma.disabledLocationMenuCategory.delete({
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

    const disabledLocationMenuCategories =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: allMenuCategoryIds } },
      });
    return res
      .status(200)
      .json({ menuCategory, disabledLocationMenuCategories });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id); //2
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId, isArchived: false },
      })
    ) // [{m1, mc2}, {m2, mc2}]
      .map((item) => item.menuId); //[1, 2]
    const menuIdsPromise = menuIds.map(async (menuId) => {
      const menuData = { menuId, count: 1 }; // {1, 1}, {2, 1}
      const count = await prisma.menuCategoryMenu.count({
        where: { menuId, isArchived: false }, // count = 2, count = 1
      });
      menuData.count = count; // {1, 2}, {2, 1}
      return menuData;
    }); // [<Promise>, <Promise>] --> [{1, 2}, {2, 1}]
    const menuIdsToArchive = (await Promise.all(menuIdsPromise)) //[{1, 2}, {2, 1}]
      .filter((item) => item.count === 1)
      .map((item) => item.menuId); //[2]

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIdsToArchive }, isArchived: false },
      })
    ) //[{1,2}, {2,2}]
      .map((item) => item.addonCategoryId); // [1, 2]

    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const addonCategoryMenuIds = (
          await prisma.menuAddonCategory.findMany({
            where: {
              addonCategoryId,
              isArchived: false,
            },
          })
        ) //[{1, 1}, {1, 2}] [{2, 2}]
          .map((item) => item.menuId); // [1, 2] [2]
        return addonCategoryMenuIds.every((item) =>
          menuIdsToArchive.includes(item)
        )
          ? addonCategoryId
          : undefined;
      }
    ); //[undefined, 2]

    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    ).filter((item) => item !== undefined); //[1, 1, 2] [2]

    for (const menuId of menuIdsToArchive) {
      await prisma.menu.updateMany({
        data: { isArchived: true },
        where: { id: menuId },
      });
      await prisma.menuAddonCategory.updateMany({
        data: { isArchived: true },
        where: { menuId },
      });
    }
    for (const addonCategoryId of addonCategoryIdsToArchive) {
      await prisma.addonCategory.updateMany({
        data: { isArchived: true },
        where: { id: addonCategoryId },
      });
      await prisma.addon.updateMany({
        data: { isArchived: true },
        where: { addonCategoryId },
      });
    }
    for (const menuId of menuIds) {
      await prisma.menuCategoryMenu.updateMany({
        data: { isArchived: true },
        where: { menuId, menuCategoryId },
      });
    }
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method Not Allowed.");
}

// const menuCategoryId = Number(req.query.id);
// const menuCategory = await prisma.menuCategory.findFirst({
//   where: { id: menuCategoryId },
// });
// if (!menuCategory) return res.status(400).send("Bad Request.");

// const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
//   where: { menuCategoryId, isArchived: false },
// });

// const menuIds = menuCategoryMenus.map((item) => item.menuId);

// menuIds.map(async (menuId) => {
//   const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
//     where: { menuId, isArchived: false },
//   });

//   if (menuCategoryMenus.length === 1) {
//     const menuAddonCategory = await prisma.menuAddonCategory.findMany({
//       where: { menuId, isArchived: false },
//     });

//     const addonCategoryIds = menuAddonCategory.map(
//       (item) => item.addonCategoryId
//     );

//     addonCategoryIds.map(async (addonCategoryId) => {
//       const menuAddonCategory = await prisma.menuAddonCategory.findMany({
//         where: { addonCategoryId, isArchived: false },
//       });

//       if (menuAddonCategory.length === 1) {
//         await prisma.addon.updateMany({
//           data: { isArchived: true },
//           where: { addonCategoryId },
//         });
//         await prisma.menuAddonCategory.updateMany({
//           data: { isArchived: true },
//           where: { menuId, addonCategoryId },
//         });
//         await prisma.addonCategory.update({
//           data: { isArchived: true },
//           where: { id: addonCategoryId },
//         });
//       } else {
//         await prisma.menuAddonCategory.updateMany({
//           data: { isArchived: true },
//           where: { menuId, addonCategoryId },
//         });
//       }
//     });

//     await prisma.menuCategoryMenu.updateMany({
//       data: { isArchived: true },
//       where: { menuCategoryId },
//     });
//     await prisma.menu.update({
//       data: { isArchived: true },
//       where: { id: menuId },
//     });
//   } else {
//     await prisma.menuCategoryMenu.updateMany({
//       data: { isArchived: true },
//       where: { menuCategoryId },
//     });
//   }
// });

// await prisma.menuCategory.update({
//   data: { isArchived: true },
//   where: { id: menuCategoryId },
// });
