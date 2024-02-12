import fs from "fs";
import * as csv from "csv";
import _ from "lodash";

// The getTextContentFromElemHandler function adapted for Playwright
export const getTextContentFromElemHandler = async (elementHandle) => {
  return await elementHandle.innerText();
};

// The getHrefFromElemHandler function adapted for Playwright
export const getHrefFromElemHandler = async (elementHandle) => {
  return await elementHandle.getAttribute("href");
};

// The getSrcFromElemHandler function adapted for Playwright
export const getSrcFromElemHandler = async (elementHandle) => {
  return await elementHandle.getAttribute("src");
};

export const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 10);
    });
  });
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const range = (length) => Array.from({ length }, (v, i) => i);

export const formatDate = (
  date,
  regex = /[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])/
) => {
  const found = date.match(regex);
  if (found) {
    return found[0];
  } else return "1900/01/01";
};

export const formatText = (text) => {
  return text
    .split(/\n/)
    .filter((line) => line)
    .join("\n");
};

export const createDistinguishedNameFromUrl = (url) => {
  const params = new URLSearchParams(url.slice(url.indexOf("?"), url.length));
  let text = "";
  for (const [key, value] of params.entries()) {
    if (key !== "page") {
      text += `${key}=${value}&`;
    }
  }
  text = text.slice(0, text.length - 1);
  return text.replace(/\[\]/g, "");
};

export const extractInfoFromDetailPage = async (detailUrl, page) => {
  console.log(detailUrl);
  // Playwrightでの遷移と待機を同時に行う方法に変更
  await page.goto(detailUrl, { waitUntil: "networkidle" });

  // 各要素の存在確認とテキスト取得を行う
  const getText = async (selector) => {
    const element = await page.$(selector);
    return element ? await element.innerText() : "";
  };

  const title = await getText('[class*="ProjectHeaderTitle__Title-sc-"]');
  const company = await getText(
    '[class*="CompanySection__CompanyNameLaptop-sc-"]'
  );
  const establishmentDateText = await getText(
    '[class*="CompanySection__LabelList-sc-"] > div:nth-child(2)'
  );
  const memberText = await getText(
    '[class*="CompanySection__LabelList-sc-"] > div:nth-child(3)'
  );
  const location = await getText(
    '[class*="CompanySection__LabelList-sc-"] > div:nth-child(5)'
  );
  const description = await getText(
    '[class*="layouts__ProjectDescriptionList-sc-"]'
  );
  const entryText = await getText(
    '[class*="ProjectHeaderTitle__MetaInfoList-sc-"] > p:nth-child(5)'
  );

  // テキスト処理のロジックはそのまま利用
  const establishmentDate = formatDate(
    establishmentDateText,
    /[0-9]{4}\/(0[1-9]|1[0-2])/
  );
  const countOfMember = memberText.slice(0, memberText.indexOf("人"));
  const publishDate = formatDate(
    await getText(
      '[class*="ProjectHeaderTitle__MetaInfoList-sc-"] > p:nth-child(1)'
    )
  );
  const viewText = await getText(
    '[class*="ProjectHeaderTitle__MetaInfoList-sc-"] > p:nth-child(3)'
  );
  const view = viewText
    .slice(0, viewText.indexOf("views"))
    .trim()
    .replace(/,/g, "");
  const entry = entryText
    .slice(0, entryText.indexOf("人"))
    .trim()
    .replace(/,/g, "");
  const formattedDesc = formatText(description);

  const pageDetail = {
    title,
    company,
    establishmentDate,
    countOfMember,
    location,
    publishDate,
    view,
    countOfEntry: entry,
    description: formattedDesc,
    url: detailUrl,
  };

  Object.entries(pageDetail).forEach(([key, value]) => {
    if (!value) {
      // 値がfalsyである場合、フィールド名を出力
      console.log("key: %o", key);
    }
  });

  return pageDetail;
};

export const loadAndParseCsv = (filePath) => {
  let rows = [];
  const parser = csv.parse({ columns: true }, function (err, data) {
    rows = [...rows, ...data];
  });
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath).pipe(parser);

    parser.on("end", function () {
      resolve(rows);
    });
  });
};

export const getCsvFileNameList = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, function (err, files) {
      if (err) reject(err);
      const fullPaths = files.map((file) => `${directoryPath}/${file}`);
      const fileList = fullPaths.filter(
        (file) => fs.statSync(file).isFile() && /.*\.csv$/.test(file)
      ); //絞り込み

      resolve(fileList);
    });
  });
};