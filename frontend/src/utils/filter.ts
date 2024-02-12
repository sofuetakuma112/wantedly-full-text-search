import { Job } from "@/types/type";
import { isKeyExists } from "@/utils/util";

const hasContainWord = (word: string | RegExp, description: string) => {
  const regexp = new RegExp(word, "i");
  return regexp.test(description);
};
const assignDescription = (description: any) => (word: any) =>
  hasContainWord(word, description);

const stringToDateTime = (date: string | number | Date) => {
  if (date) return new Date(date).getTime();
  else return new Date("1900/01/01").getTime();
};

const sortByCriteriaAndDirection = (
  a: {
    countOfEntry: any;
    view: any;
    publishDate: any;
    establishmentDate: any;
    countOfMember: any;
  },
  b: {
    countOfEntry: any;
    view: any;
    publishDate: any;
    establishmentDate: any;
    countOfMember: any;
  },
  sortCriteria: any,
  sortDirection: string
) => {
  const ASCENDING = "ascending";
  switch (sortCriteria) {
    case "entry":
      // 0 未満の場合、a を b より小さいインデックスにソート
      return sortDirection === ASCENDING
        ? Number(String(a.countOfEntry).replace(/,/g, "")) -
            Number(String(b.countOfEntry).replace(/,/g, ""))
        : Number(String(b.countOfEntry).replace(/,/g, "")) -
            Number(String(a.countOfEntry).replace(/,/g, ""));
    case "countOfView":
      return sortDirection === ASCENDING
        ? Number(String(a.view).replace(/,/g, "")) -
            Number(String(b.view).replace(/,/g, ""))
        : Number(String(b.view).replace(/,/g, "")) -
            Number(String(a.view).replace(/,/g, ""));
    case "publishDate":
      return sortDirection === ASCENDING
        ? stringToDateTime(a.publishDate) - stringToDateTime(b.publishDate)
        : stringToDateTime(b.publishDate) - stringToDateTime(a.publishDate);
    case "establishmentDate":
      return sortDirection === ASCENDING
        ? stringToDateTime(a.establishmentDate) -
            stringToDateTime(b.establishmentDate)
        : stringToDateTime(b.establishmentDate) -
            stringToDateTime(a.establishmentDate);
    case "countOfMember":
      const aCountOfMember = Number(a.countOfMember || 0);
      const bCountOfMember = Number(b.countOfMember || 0);
      if (sortDirection === ASCENDING) {
        return aCountOfMember - bCountOfMember;
      } else return bCountOfMember - aCountOfMember;
    default:
      return 0;
  }
};

export const filterJobs = (
  {
    andWords,
    orWords,
    sortCriteria,
    sortDirection,
    shouldSummarizeByCompany,
  }: {
    andWords: string[];
    orWords: string[];
    sortCriteria: string | string[];
    sortDirection: string | string[];
    shouldSummarizeByCompany: boolean;
  },
  jobs: Job[]
) => {
  // title,company,establishmentDate,countOfMember,location,publishDate,view,countOfEntry,description,summary,tags,url,eyecatchImgSrc,companyThumbnailImgSrc
  const filteredJobs = jobs.filter(
    ({ description, publishDate, establishmentDate }: any) => {
      const hasContainWordInDesc = assignDescription(description);
      if (sortCriteria === "publishDate" && !publishDate) return false;
      if (sortCriteria === "establishmentDate" && !establishmentDate)
        return false;
      const hasMatchedByWords =
        (andWords.length === 0 ? true : andWords.every(hasContainWordInDesc)) &&
        (orWords.length === 0 ? true : orWords.some(hasContainWordInDesc));
      return hasMatchedByWords;
    }
  );
  if (shouldSummarizeByCompany) {
    const filteredJobsByCompany_obj = filteredJobs
      // 会社ごとに求人を纏める
      .reduce(
        (
          jobOffersByCompany: { [x: string]: any[] },
          currentJobOffer: { company: string | number }
        ) => {
          if (isKeyExists(jobOffersByCompany, currentJobOffer.company)) {
            // 既にkeyが存在する
            jobOffersByCompany[currentJobOffer.company].push(currentJobOffer);
          } else {
            jobOffersByCompany[currentJobOffer.company] = [currentJobOffer];
          }
          return jobOffersByCompany;
        },
        {}
      );
    // 会社ごとにまとめた求人リストごとに指定された条件でソートする
    const filteredJobsByCompany_array = [];
    for (const key in filteredJobsByCompany_obj) {
      const jobs = filteredJobsByCompany_obj[key];
      // ソートする
      const sortedJobs = jobs.sort((a: any, b: any) =>
        sortByCriteriaAndDirection(a, b, sortCriteria, sortDirection as string)
      );
      filteredJobsByCompany_array.push(sortedJobs);
    }
    // 会社ごとに纏めた求人リストの先頭の求人を会社間で比較してソートする
    return filteredJobsByCompany_array.sort((a: any, b: any) => {
      const a_job = a[0];
      const b_job = b[0];
      return sortByCriteriaAndDirection(
        a_job,
        b_job,
        sortCriteria,
        sortDirection as string
      ) as number;
    });
  } else {
    return filteredJobs.map((job: any) => [job]);
  }
};
