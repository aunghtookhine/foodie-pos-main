// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CartItem } from "@/types/cart";
import { prisma } from "@/utils/db";
import { ORDERSTATUS } from "@prisma/client";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const orderSeq = req.query.orderSeq;
    if (!orderSeq) return res.status(400).send("Bad Request.");
    const exist = await prisma.order.findMany({
      where: { orderSeq: String(orderSeq) },
    });
    if (!exist) return res.status(400).send("Bad Request.");
    return res.status(200).json({ orders: exist });
  } else if (method === "POST") {
    const { tableId, cartItems } = req.body;
    const isValid = tableId && cartItems.length;
    if (!isValid) return res.status(400).send("Bad request.");
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { in: [ORDERSTATUS.PENDING, ORDERSTATUS.COOKING] },
      },
    });
    const orderSeq = order ? order.orderSeq : nanoid();
    for (const item of cartItems) {
      const cartItem = item as CartItem;
      let totalPrice = cartItem.menu.price;
      const hasAddons = cartItem.addons.length > 0;
      if (hasAddons) {
        const totalAddonPrices = cartItem.addons.reduce(
          (prev, curr) => (prev += curr.price),
          0
        );
        totalPrice += totalAddonPrices;

        for (const addon of cartItem.addons) {
          await prisma.order.create({
            data: {
              menuId: cartItem.menu.id,
              addonId: addon.id,
              quantity: cartItem.quantity,
              orderSeq,
              itemId: cartItem.id,
              status: ORDERSTATUS.PENDING,
              totalPrice: totalPrice * cartItem.quantity,
              tableId,
            },
          });
        }
      } else {
        await prisma.order.create({
          data: {
            menuId: cartItem.menu.id,
            quantity: cartItem.quantity,
            orderSeq,
            itemId: cartItem.id,
            status: ORDERSTATUS.PENDING,
            totalPrice: totalPrice * cartItem.quantity,
            tableId,
          },
        });
      }
    }
    const orders = await prisma.order.findMany({ where: { orderSeq } });
    return res.status(200).json({ orders });
  } else if (method === "PUT") {
    const { status } = req.body;
    const itemId = String(req.query.itemId);
    const isValid = status && itemId;
    if (!isValid) return res.status(400).send("Bad Request.");
    const exist = await prisma.order.findFirst({
      where: { itemId },
    });
    if (!exist) return res.status(400).send("Bad Request.");
    await prisma.order.updateMany({
      data: { status },
      where: { itemId },
    });
    const table = await prisma.table.findFirst({
      where: { id: exist.tableId },
    });
    const tables = await prisma.table.findMany({
      where: { locationId: table?.locationId },
    });
    const orders = await prisma.order.findMany({
      where: {
        tableId: { in: tables.map((item) => item.id) },
        isArchived: false,
      },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({ orders });
  }
  res.status(405).send("Method not allowed.");
}
