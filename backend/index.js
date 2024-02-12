import { chromium } from "playwright";
import {
  autoScroll,
  sleep,
  extractInfoFromDetailPage,
  createDistinguishedNameFromUrl,
  loadAndParseCsv,
  getCsvFileNameList,
} from "./util.js";
import { createObjectCsvWriter } from "csv-writer";
import _ from "lodash";
import fs from "fs";

const extractInfoFromSinglePage = async (page, alreadyScrapedPageUrls) => {
  // 詳細ページへのURL一覧を取得
  const detailAnchorElems = await page.$$(
    '.projects-index-single [class*="ProjectListJobPostItem__ProjectLink-sc-"]'
  );
  const detailUrls = await Promise.all(
    detailAnchorElems.map(
      async (detailPageElem) => await detailPageElem.getAttribute("href")
    )
  );
  const detailUrlsNoQuery = detailUrls.map((url) => url.replace(/\?.*$/, ""));

  // スクレイピング済みのページURLを除外する
  const noScrapedPageUrl = detailUrlsNoQuery.filter(
    (url) => !alreadyScrapedPageUrls.includes(url)
  );

  // 次ページのURLを取得
  const nextPageButton = await page.$('button[aria-label="Go to next page"]');
  // const nextPageUrl = nextPageAnchorElem
  //   ? await nextPageAnchorElem.getAttribute("href")
  //   : null;

  // 案件一覧からSummaryデータを抽出
  const articleElems = await page.$$(".projects-index-single");
  const jobSummaries = await Promise.all(
    articleElems.map(async (elem) => {
      const eyecatchImgSrc = await elem
        .$eval(
          '[class*="ProjectListJobPostItem__CoverImage-sc-"]',
          (img) => img.src
        )
        .catch(() => "");
      const tags = await elem.$$eval(
        '[class*="FeatureTagList___Tag-sc-"]',
        (tags) => tags.map((tag) => tag.textContent.trim())
      );
      const title = await elem.$eval(
        '[class*="ProjectListJobPostItem__TitleText-sc-"]',
        (a) => a.textContent.trim()
      );
      const detailPageUrl = await elem.$eval(
        '[class*="ProjectListJobPostItem__ProjectLink-sc-"]',
        (a) => a.href
      );
      const summary = await elem.$eval(
        '[class*="ProjectListJobPostItem__DescriptionText-sc-"]',
        (div) => div.textContent.trim()
      );
      const companyThumbnailImgSrc = await elem
        .$eval(
          '[class*="JobPostCompanyWithWorkingConnectedUser__AvatarImage-sc-"]',
          (img) => img.src
        )
        .catch(() => "");
      const companyName = await elem.$eval(
        '[class*="JobPostCompanyWithWorkingConnectedUser__CompanyNameText-sc-"]',
        (a) => a.textContent.trim()
      );

      return {
        eyecatchImgSrc,
        summary,
        companyThumbnailImgSrc,
        tags: tags.join(", "),
        url: detailPageUrl.replace(/\?.*$/, ""),
        title,
        companyName,
      };
    })
  );

  const jobDetails = [];
  // 新しいページ（タブ）を開く
  const pageForDetailPage = await context.newPage();
  for await (const detailUrl of noScrapedPageUrl) {
    const detailPageInfo = await extractInfoFromDetailPage(
      `https://www.wantedly.com${detailUrl}`,
      pageForDetailPage
    );
    jobDetails.push(detailPageInfo);
    await sleep(1000);
  }

  const jobs = jobDetails.map((jobDetail) => {
    const foundJobSummary = jobSummaries.find(
      (jobSummary) => jobSummary.url === jobDetail.url
    );
    if (!foundJobSummary)
      throw Error("jobDetailのurlに一致するjobSummaryが見つからなかった");
    return { ...jobDetail, ...foundJobSummary };
  });

  return [jobs, nextPageButton];
};

const scraping = async (page, alreadyScrapedPageUrls, csvWriter) => {
  let pageNum = 1;
  while (true) {
    const notFoundElem = await page.$(".projects-not-found-wrapper");
    if (notFoundElem) break; // 「検索結果が多すぎるようです」を検知

    console.log(`${pageNum}ページ`);
    const [subRecords, nextPageButton] = await extractInfoFromSinglePage(
      page,
      alreadyScrapedPageUrls
    );

    if (subRecords.length > 0) {
      await csvWriter.writeRecords(subRecords);
    }

    if (nextPageButton) {
      await nextPageButton.click();
      await page.waitForNavigation({ waitUntil: "networkidle" });
      await autoScroll(page);
      await sleep(2000);
      pageNum += 1;
    } else {
      break;
    }
  }
};

let context;

(async () => {
  const startUrl =
    "https://www.wantedly.com/projects?type=recent&page=1&occupation_types%5B%5D=jp__engineering&hiring_types%5B%5D=internship&hiring_types%5B%5D=part_time";

  const startTime = performance.now();

  const browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(startUrl, {
    waitUntil: "networkidle",
  });
  await autoScroll(page);
  await sleep(2000);

  // スクレイピング済みのURL一覧を作る
  const csvFilePaths = await getCsvFileNameList("./csv");
  const listOfUrlListForEachCsv = await Promise.all(
    csvFilePaths.map(async (path) => {
      const jobsForLoadedCsv = await loadAndParseCsv(path);
      return jobsForLoadedCsv.map((job) => job.url);
    })
  );
  const alreadyScrapedPageUrlsWithDuplicates = listOfUrlListForEachCsv.reduce(
    (totalUrls, urls) => [...totalUrls, ...urls],
    []
  );
  const alreadyScrapedPageUrls = Array.from(
    new Set(alreadyScrapedPageUrlsWithDuplicates)
  );

  const csvFileName = `wantedly?${createDistinguishedNameFromUrl(startUrl)}`;
  const filePath = `csv/${csvFileName}.csv`;
  // CSV設定
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "title", title: "title" },
      { id: "company", title: "company" },
      { id: "establishmentDate", title: "establishmentDate" },
      { id: "countOfMember", title: "countOfMember" },
      { id: "location", title: "location" },
      { id: "publishDate", title: "publishDate" },
      { id: "view", title: "view" },
      { id: "countOfEntry", title: "countOfEntry" },
      { id: "description", title: "description" },
      { id: "summary", title: "summary" },
      { id: "tags", title: "tags" },
      { id: "url", title: "url" },
      { id: "eyecatchImgSrc", title: "eyecatchImgSrc" },
      { id: "companyThumbnailImgSrc", title: "companyThumbnailImgSrc" },
    ],
  });
  if (fs.existsSync(filePath)) {
    // csvの存在チェック
    const jobsFromCsv = await loadAndParseCsv(filePath); // 既存のcsvファイルを読み込む
    await csvWriter.writeRecords(jobsFromCsv); // スクレイピング前のCSVデータで書き込む
    await scraping(page, alreadyScrapedPageUrls, csvWriter);
  } else {
    await scraping(page, alreadyScrapedPageUrls, csvWriter);
  }

  const endTime = performance.now();
  console.log((endTime - startTime) / 1000, " [s]");

  await browser.close();
})();
