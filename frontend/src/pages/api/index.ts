import { loadAllJobs } from "@/utils/util";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const jobs = await loadAllJobs();
  res.status(200).json(jobs.map((job: any) => [job]));
}

export const config = {
  api: {
    responseLimit: false,
  },
};
