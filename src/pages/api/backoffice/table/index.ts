// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;

    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad Request");
    const newTable = await prisma.table.create({
      data: { name, locationId, assetUrl: "" },
    });
    const tableId = newTable.id;
    await qrCodeImageUpload(tableId);
    const assetUrl = getQrCodeUrl(tableId);
    const table = await prisma.table.update({
      data: { assetUrl },
      where: { id: tableId },
    });
    return res.status(200).send(table);
  } else if (method === "PUT") {
    const { id, name, locationId } = req.body;

    const isValid = id && name && locationId;
    if (!isValid) return res.status(400).send("Bad Request");

    const table = await prisma.table.update({
      data: { name, locationId },
      where: { id },
    });

    return res.status(200).send(table);
  } else if (method === "DELETE") {
    const tableId = Number(req.query.id);
    const table = await prisma.table.findFirst({ where: { id: tableId } });
    if (!table) return res.status(400).send("Bad Request");
    await prisma.table.update({
      data: { isArchived: true },
      where: { id: tableId },
    });
    return res.status(200).send("Menu Successfully Deleted.");
  }
  res.status(405).send("Method not allowed.");
}
