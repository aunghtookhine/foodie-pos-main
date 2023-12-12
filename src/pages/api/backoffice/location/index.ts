// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, street, township, city, companyId } = req.body;

    const isValid = name && street && township && city && companyId;
    if (!isValid) return res.status(400).send("Bad Request.");

    const location = await prisma.location.create({
      data: { name, street, township, city, companyId },
    });
    return res.status(200).send(location);
  }
}
//   } else if (method === "PUT") {
//     const { id, name, street, township, city, companyId } = req.body;
//     const isValid = id && name && street && township && city && companyId;
//     if (!isValid) return res.status(400).send("Bad Request.");
//     const location = await prisma.location.update({
//       data: { name, street, township, city, companyId },
//       where: { id },
//     });
//     return res.status(200).send(location);
//   } else if (method === "DELETE") {
//     const locationId = Number(req.query.id);
//     const location = await prisma.location.findFirst({
//       where: { id: locationId },
//     });
//     if (!location) return res.status(400).send("Bad Request");
//     await prisma.location.update({
//       data: { isArchived: true },
//       where: { id: locationId },
//     });
//     return res.status(200).send("Successfully deleted.");
//   }
//   res.status(405).send("Method Not Allowed.");
// }
