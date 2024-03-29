import type { NextApiRequest, NextApiResponse } from "next";
import { type Database } from "@data/database.types";
import { getSeries } from "@lib/supabase";

export default async function Series(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  switch (method) {
    case "GET":
      let entries;

      const { publisher, type } = query;
      const status = query.status as
        | Database["public"]["Enums"]["status"]
        | Database["public"]["Enums"]["status"][]
        | undefined;

      entries = await getSeries({
        publishers: publisher,
        types: type,
        status: status,
      });

      if (entries) {
        // Get data from your database, also cache on Vercel's network for 2 hours
        res.setHeader("Cache-Control", "max-age=0, s-maxage=7200");
        res.status(200).json(entries);
      } else {
        res.status(204).end();
      }

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
