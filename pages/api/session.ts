import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Session } from "next-auth"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  session: Session | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(authOptions);

  res.status(200).json({ session });

}
