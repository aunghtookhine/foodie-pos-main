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
    const { name, isRequired, menuIds } = req.body;

    const isValid = name && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad Request.");

    const addonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });

    const menuAddonCategories = await prisma.$transaction(
      menuIds.map((menuId: number) =>
        prisma.menuAddonCategory.create({
          data: { menuId, addonCategoryId: addonCategory.id },
        })
      )
    );

    return res.status(200).send({ addonCategory, menuAddonCategories });
  } else if (method === "PUT") {
    const { id, name, isRequired, menuIds } = req.body;

    const isValid = name && menuIds.length > 0;
    if (!isValid) return res.status(400).send("Bad Request.");

    const addonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });

    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });

    const menuAddonCategories = await prisma.$transaction(
      menuIds.map((menuId: number) =>
        prisma.menuAddonCategory.create({
          data: { menuId, addonCategoryId: addonCategory.id },
        })
      )
    );

    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);

    const addonCategory = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });
    if (!addonCategory) return res.status(400).send("Bad Request.");

    const deletedAddonCategory = await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });
    return res.status(200).send("Addon Category Successfully Deleted.");
  }
  res.status(405).send("Method now allowed.");
}
