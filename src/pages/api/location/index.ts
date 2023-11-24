// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).send("Unauthorized.");

    const user = session.user;
    const email = user?.email as string;

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!dbUser) return res.status(400).send("Bad Request.");

    const companyId = dbUser.companyId;

    const { name, street, township, city } = req.body;

    const isValid = name && street && township && city;
    if (!isValid) return res.status(400).send("Bad Request.");

    const location = await prisma.location.create({
      data: { name, street, township, city, companyId },
    });
    return res.status(200).send(location);
  } else if (method === "PUT") {
    const { id, name, street, township, city, companyId } = req.body;
    const isValid = id && name && street && township && city && companyId;
    if (!isValid) return res.status(400).send("Bad Request.");
    const location = await prisma.location.update({
      data: { name, street, township, city, companyId },
      where: { id },
    });
    return res.status(200).send(location);
  } else if (method === "DELETE") {
    const locationId = Number(req.query.id);
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("Bad Request");
    await prisma.location.update({
      data: { isArchived: true },
      where: { id: locationId },
    });
    return res.status(200).send("Successfully deleted.");
  }
  res.status(405).send("Method Not Allowed.");
}
