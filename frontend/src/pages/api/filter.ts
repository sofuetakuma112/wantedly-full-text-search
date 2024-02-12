// /pages/api/filter.js
import { filterJobs } from "@/utils/filter"; // パスは実際の配置に合わせて調整してください
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    andWord = "",
    orWord = "",
    sortCriteria = "",
    sortDirection = "",
    shouldSummarizeByCompany = "false",
  } = req.query;
  const searchCondition = {
    andWords: (andWord as string).split(/\s+/),
    orWords: (orWord as string).split(/\s+/),
    sortCriteria,
    sortDirection,
    shouldSummarizeByCompany: shouldSummarizeByCompany === "true",
  };
  const filteredJobs = await filterJobs(searchCondition);

  res.status(200).json(filteredJobs);
}

export const config = {
  api: {
    responseLimit: false,
  },
};
